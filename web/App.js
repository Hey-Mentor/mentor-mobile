import React from 'react';
import Expo, { Notifications } from 'expo';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeAuth from './screens/HomeAuth';
import NotificationsScreen from './screens/NotificationsScreen';
import MenteeDetailsView from './screens/MenteeDetailsView';
import registerForNotifications from './services/pushNotifications';

export default class App extends React.Component {
  componentDidMount() {
    // registerForNotifications();
    // Notifications.addListener(notification => {
    //   const {
    //     data: { text },
    //     origin
    //   } = notification;
    //
    //   if (origin === 'recieved' && text) {
    //     Alert.alert('new push notification', text, [{ text: 'Ok' }]);
    //   }
    // });
  }

  render() {
    const headerTitleStyle = {
      flex: 1,
      textAlign: 'center',
      color: '#000000',
      fontSize: 24,
      fontWeight: 'bold'
    };

    const styles = StyleSheet.create({
      leftImage: {
        width: 30,
        height: 26,
        marginLeft: 15
      },
      rightImage: {
        width: 40,
        height: 40,
        marginRight: 24
      }
    });

    const MainNavigator = StackNavigator({
      menteeDetails: {
        screen: MenteeDetailsView,
        navigationOptions: ({ navigation }) => ({
          title: 'Ace N',
          headerTitleStyle: headerTitleStyle,
          headerLeft: (
            <Image
              source={require('./static/left-arrow.png')}
              style={styles.leftImage}
            />
          ),
          headerRight: (
            <Image
              source={require('./static/gear.png')}
              style={styles.rightImage}
            />
          )
        })
      },
      home: { screen: HomeAuth },
      notifications: { screen: NotificationsScreen }
    });
    return <MainNavigator />;
  }
}
