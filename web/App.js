import React from 'react';
import Expo, { Notifications } from 'expo';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeAuth from './screens/HomeAuth';
import NotificationsScreen from './screens/NotificationsScreen';
import MenteeDetailsView from './screens/MenteeDetailsView';
import MenteesListView from './screens/MenteesListView';
import Settings from './screens/Settings';
import registerForNotifications from './services/pushNotifications';
import ChatScreen from './screens/ChatScreen'

export default class App extends React.Component {
  render() {
    const userName = 'Matt';
    const MainNavigator = StackNavigator({
      home: { screen: HomeAuth },
      notifications: { screen: NotificationsScreen },
      menteeListView: { screen: MenteesListView },
      menteeDetails: { screen: MenteeDetailsView },
      settings: { screen: Settings },
      chat: {
        screen: ChatScreen,
        navigationOptions: ({ navigation }) => ({
          title: `💬 ${userName}`, // TODO: Specify recipient name
          headerTitleStyle: headerTitleStyle
        })
      },
    });
    return <MainNavigator />;
  }
}
