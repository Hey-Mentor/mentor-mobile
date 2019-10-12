import React, { Component } from 'react';

import {
  ScrollView,
  AsyncStorage,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import {
  Image,
} from 'react-native-elements';

import MenteeList from '../components/menteeList/MenteeList';
import { CONFIG } from '../config.js';
import { MessageBox } from '../components/common/MessageBox';

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;

class MenteeListView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.headerTitle}`,
    headerTitleStyle,
    headerLeft: null
    /* headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('notifications');
        }}
      >
        <BadgeIcon count={3}>
          <Icon
            name="ios-notifications"
            type="ionicon"
            size={35}
            iconStyle={styles.leftImage}
          />
        </BadgeIcon>
      </TouchableOpacity>
    ),

    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('settings');
        }}
      >
        <Icon
          name="gear"
          type="font-awesome"
          size={40}
          iconStyle={styles.rightImage}
        />
      </TouchableOpacity>

    ) */
  });

  state = {
    contactItem: [],
    hmToken: '',
    loading: true,

    //MessageBox default Configuration
    messageBoxVisibile: false,
    messageBoxText: 'Specify the text output',
    messageBoxTitle: 'Add a title',
    messageBoxImage: {uri: 'https://storage.needpix.com/rsynced_images/question-310891_1280.png'},
    
    //Pull to refresh
    refreshing: false,
  };

  async componentDidMount() {
    //Starting loading icon animation
    this.setState({loading:true});

    //Fetching token
    const token = await AsyncStorage.getItem('hm_token');
    this.setState({hmToken: token});

    // this.getUserData(this.state.fbUserId, this.state.fbToken);
    if (this.state.hmToken) {
      const profile = await this.getMyProfile(JSON.parse(this.state.hmToken)).catch((error) =>{
        console.log('ERrorororo' + error.statusCode);
        this.newErrorMessage('Uh-Oh','Failed to retrieve user information.',true);
        this.setState({loading: false});
      });
      this.constructContactItemsFromResponse(profile.contacts, JSON.parse(this.state.hmToken));
    } else {
      // TODO: Add sentry logs
    }
  }

  getMyProfile = async (token) => {
    const response = await fetch(
      `${API_URL}/profile/${token._id}?token=${token.api_key}`
    );
    const responseJson = await response.json();
    return responseJson;
  };

  newErrorMessage = async (title, message, visible) => {
    this.setState({
      messageBoxVisibile: visible,
      messageBoxTitle: title,
      messageBoxText: message
    });
  };

  constructContactItemsFromResponse = async (contactIds, token) => {
    const contactItems = [];
    var contactCount = 0;
    const requestString = `${API_URL}/contacts/${token._id}?token=${token.api_key}`;
    var statusCode = 0;
    
    const contactData = fetch(requestString)

      .then(
        (response) => {
        statusCode = response.status;
        //statusCode = 300; //Test other status codes

        //If the database returns the status code 200 (OK)
        if (statusCode == 200){
          console.log("Successfully fetched data with the response code: " + statusCode)

          //Continuing the promise chain
          return response;
        }

        //Any other status codes
        else{
          return Promise.reject('Failed with status code: ' + statusCode);
        }
      })

      .catch((error) =>{
        console.log("Error: " + error)
      })

      .then(response => response.json())

      .catch((error) => {
        // TODO: Add sentry logs
        console.log("Error2: " + error)
      })

      // TODO: Show "No mentees" error message on screen
      .then(responseJson => responseJson.contacts.map((contact) => {
        const fullName = `${contact.person.fname} ${contact.person.lname}`;
        return contactItems.push({
          name: fullName,
          school: contact.school.name,
          grade: contact.school.grade,
          id: contact._id,
          fullContact: contact
        });
      }))
      .catch((error) => {
        console.log("Error3: " + error)
        // TODO: add sentry logs
      })
      .catch((error) => {
        
      });

      //Stop the loading indicator
      

    contactData.then(() => this.setState({ contactItem: contactItems }))
    .then(()=>{
      //Successfully loaded all contacts. 
      this.setState({ loading: false });

      //Checking how many items are in the contact list.
      contactCount = contactItems.length
      console.log("contactCount: " + contactCount);



      
      //Checking if the app should display an error message

      //fetch was successfull, but there were no contacts
      if(contactCount == 0 && statusCode == 200){
        //Display message to user
        this.newErrorMessage('Uh-Oh',"You don't have any contacts to display.",true);
      }
      //The fetch was not successfull
      if(statusCode !== 200){
        this.newErrorMessage(
          'Failed to retrieve contacts.',
          "Statuscode: " + statusCode
          ,true);
      }
    });


    
  };


  render() {
    return (
      <View style={styles.contentWrap}>
        {/* //Floating view*/}
        <View style= {styles.floatingView}>
          <ActivityIndicator 
                animating={this.state.loading} 
                size="large" 
                color="#0000ff" />
        </View>

        {/* Contact list */}
        <ScrollView
          refreshControl={

            //Pull to refresh
            <RefreshControl refreshing={this.state.refreshing} 
              onRefresh={() => {
                //Removing old data
                this.setState({
                  refreshing: true,
                  contactItem: []
                });
                //Hiding errormessage
                this.newErrorMessage("","",false);

                //Reload page
                this.componentDidMount();
                this.setState({refreshing: false});
              
            }}/>
        }>
            {/* No content messages */}
          <MessageBox
            title = {this.state.messageBoxTitle}
            text = {this.state.messageBoxText}
            imageSource = {this.state.messageBoxImage}
            visible = {this.state.messageBoxVisibile}
            />
          <MenteeList
            menteeItem={this.state.contactItem}
            navigation={this.props.navigation}
            />  
        </ScrollView>   
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
  contentWrap: {
  },

  floatingView:{
    position: 'absolute',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    flex: 1,
    margin:30,
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
  },


  messageBox: {
    backgroundColor: "#ef553a", //Red
    borderRadius: 8,
    width: '90%',
    margin: 20,
  },
  messageBoxTitleText: {
    fontSize:20,
    color: '#fff',
    fontWeight:'bold',

    alignItems: 'center',
    textAlign: 'center'
  },

  messageBoxText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,

    margin:10,
    textAlign:'center',
  },

  imageBox: {

  },

  imageBoxImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 350,
    marginTop: 50,
  },

  

})
const headerTitleStyle = {
  flex: 1,
  textAlign: 'center',
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold',
  position: 'absolute',
  top:0,
  left:0,
};

export default MenteeListView;
