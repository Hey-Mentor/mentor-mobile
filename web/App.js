import React from 'react';
import Expo, { Notifications } from 'expo';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeAuth from './screens/HomeAuth';
import NotificationsScreen from './screens/NotificationsScreen';
import MenteeDetailsView from './screens/MenteeDetailsView';
import MenteesListView from './screens/MenteesListView';
import registerForNotifications from './services/pushNotifications';

export default class App extends React.Component {
  render() {
    const MainNavigator = StackNavigator({
      home: { screen: HomeAuth },
      notifications: { screen: NotificationsScreen },
      menteeListView: { screen: MenteesListView },
      menteeDetails: { screen: MenteeDetailsView }
    });
    return <MainNavigator />;
  }
}
