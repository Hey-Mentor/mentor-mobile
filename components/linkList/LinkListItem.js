import React, { Component } from 'react';
import { ListItem } from 'react-native-elements';
import { Linking } from 'expo';

export default class LinkListItem extends Component {
  state: {
    title: string,
    url: string,
    icon: string
  };

  constructor(props) {
    super(props);
    this.state = {
      title: null,
      url: props.url,
      icon: 'https://storage.needpix.com/rsynced_images/link-4088190_1280.png'
    };
  }

  async componentDidMount() {
    // Regex to get the second level domain
    const regx = new RegExp(/(\.[^.]{0,2})(\.[^.]{0,2})(\.*$)|(\.[^.]*)(\.*$)/);

    // Callback: The url request happens after the default text has been added to the listItem
    this.setState(
      (prevState) => ({
        title: prevState.url
          .replace(regx, '')
          .split('.')
          .pop()
      }),
      () => {
        const requestString =
          'http://10.0.0.11:8081/media/link/5c15446bbf35ae4057111111?token=5f33fb8d2a6441a9ad5d3ac0340e7bc3';
        const { url } = this.state; // 'http://www.google.com';
        const bodyData = {
          url
        };
        fetch(requestString, {
          method: 'post',
          body: JSON.stringify(bodyData),
          headers: { 'Content-Type': 'application/json' }
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              title: responseJson.linkInformation.title,
              icon: responseJson.linkInformation.icon
            });
            return responseJson;
          })
          .catch((error) => {
            // TODO: Add error handling
            throw error;
          });
      }
    );
  }

  render() {
    return (
      <ListItem
        title={this.state.title}
        subtitle={this.state.url}
        leftAvatar={{
          source: {
            uri: this.state.icon
          }
        }}
        bottomDivider
        onPress={() => {
          Linking.openURL(this.state.url).catch(() => {
            // Catch failed to open link
          });
        }}
      />
    );
  }
}
