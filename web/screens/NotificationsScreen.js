import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class NotificationsScreen extends Component {
  goBack() {

  }

  render() {
    return (
      <View style={{flex: 1}}>
      	<Text style={{margin: 5, fontSize: 36, textAlign: 'center'}}>Notifications</Text>
        <Notification text="Kevin's University of Washington application is due tomorrow"></Notification>
        <Notification text="Chadwick's FAFSA is due in 3 days"></Notification>
        <Notification text="College applications are due tomorrow"></Notification>
        <Button onPress={this.goBack} title="Got It" style={{marginTop: 50}}></Button>
      </View>
    );
  }
}

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {isRead: false};
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

    return (
    	!isDeleted ?
    	<View style={styles.card}>
    		<View  style={{backgroundColor: isRead ? '#909090' : 'rgba(25, 175, 229, 0.33)'}}>
	    		<Text style={styles.message}>{this.props.text}</Text>
	    		<View style={styles.buttonsContainer}>
					<Button onPress={this.markAsRead} title={isRead ? "Read" : "Unread"}></Button>
					<Button onPress={this.delete} title="Remove"></Button>
				</View>
			</View>
    	</View>
    	:
    	<View></View>
    );
  }
}

const styles = {
  message: {
    padding: 20,
    textAlign: 'center'
  },
  card: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'rgba(25, 175, 229, 0.33)'  	
  },
  buttonsContainer: {
  	margin: 10, 
  	flexDirection: 'row', 
  	justifyContent: 'center'
  }
};

export default NotificationsScreen;
