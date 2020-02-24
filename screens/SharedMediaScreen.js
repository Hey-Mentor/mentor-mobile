import React, { Component } from 'react';
import { View, ActivityIndicator, AsyncStorage } from 'react-native';
import LinkList from '../components/linkList/LinkList.js';

import CONFIG from '../config.js';

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;

class SharedMediaScreen extends Component {
  // static navigationOptions = ({ navigation }) => ({
  //   title: `Shared media - ${navigation.state.params.mentee.person.fname}`
  // });

  constructor() {
    super();
    this.state = {
      DATA: [],
      isLoading: true,
      hmToken: ''
    };
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('hm_token');
    this.setState({ hmToken: token });

    this.setState((prevState) => {
      // Fetch all links from api
      const parsedToken = JSON.parse(prevState.hmToken);
      const channelSid = 'CHc52d6ba439524ebcbcdc41dcc0d3d59c';
      const requestUri = `${API_URL}/chat/channel/media/links/${parsedToken._id}?token=${parsedToken.api_key}`;

      fetch(requestUri, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelSid
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          // Creating list
          const list = [];
          let processCounter = 0;
          responseJson.links.forEach((obj, index, array) => {
            list.push({
              title: 'Firsterrr',
              data: [
                {
                  url: obj.url,
                  sender: '5c15446bbf35ae4057111111',
                  channel: 'CHc52d6ba439524ebcbcdc41dcc0d3d59c',
                  dateSent: '2019-12-06T20:17:35.000Z',
                  dateUpdated: '2019-12-06T20:17:35.000Z',
                  media: null
                }
              ]
            });
            processCounter += 1;

            // "Callback"
            if (processCounter === array.length) {
              this.setState({
                DATA: list
              });
            }
          });

          // Set the list state
          return responseJson.links.url;
        })
        .catch(() => {
          // console.error(error);
        });

      return { isLoading: false };
    });
  }

  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator size='large' color='#0000ff' />;
    }
    // <Text>{'Media shared between you and'} {this.props.navigation.state.params.mentee.person.fname}</Text>
    return (
      <View>
        <LinkList linkItems={this.state.DATA} />
      </View>
    );
  }
}

export default SharedMediaScreen;
