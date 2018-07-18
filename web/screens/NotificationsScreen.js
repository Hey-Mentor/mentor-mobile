import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';

const headerTitleStyle = {
  //flex: 1,  
  textAlign: 'center',  
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold'
};

class NotificationsScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Notifications',
    headerTitleStyle  
  });

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <Notification text="Kevin's University of Washington application is due tomorrow" />
        <Notification text="Chadwick's FAFSA is due in 3 days" />
        <Notification text="College applications are due tomorrow" />
      </View> 
    );
  }
}

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = { isRead: false };
    this.markAsRead = this.markAsRead.bind(this);
    this.delete = this.delete.bind(this);
  }

  markAsRead() {
    this.setState(prevState => ({
      isRead: !prevState.isRead
    }));
  }

  delete() {
    this.setState(prevState => ({
      isDeleted: true
    }));
  }

  render() {
    const isDeleted = this.state.isDeleted;
    const isRead = this.state.isRead;

    return !isDeleted ? (
      <View style={styles.card}>
        <View style={{ backgroundColor: isRead ? '#909090' : 'rgba(25, 175, 229, 0.33)' }}>
          <Text style={styles.message}>{this.props.text}</Text>
          <View style={styles.buttonsContainer}>
            <Button onPress={this.markAsRead} title={isRead ? 'Read' : 'Unread'} />
            <Button onPress={this.delete} title="Remove" />
          </View>
        </View>
      </View>
    ) : (
      <View />
    );
  }
}

const styles = {
  message: {
    padding: 20,
    textAlign: 'center'
  },
  card: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'rgba(25, 175, 229, 0.33)'
  },
  buttonsContainer: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonStyle: {
    marginTop: 30,
    backgroundColor: '#007aff',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'center',
    width: 200,
    height: 50
  },
  textStyle: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
};

export default NotificationsScreen;
