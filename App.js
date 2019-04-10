import React from 'react';
import { StackNavigator } from 'react-navigation';
import HomeAuth from './screens/HomeAuth';
import NotificationsScreen from './screens/NotificationsScreen';
import MenteeDetailsView from './screens/MenteeDetailsView';
import MenteesListView from './screens/MenteesListView';
import Settings from './screens/Settings';
import ChatScreen from './screens/ChatScreen';

import { Sentry } from 'react-native-sentry';
export default class App extends React.Component {
  render() {
    const MainNavigator = StackNavigator({
      home: { screen: HomeAuth },
      notifications: { screen: NotificationsScreen },
      menteeListView: { screen: MenteesListView },
      menteeDetails: { screen: MenteeDetailsView },
      settings: { screen: Settings },
      chat: { screen: ChatScreen },
    });
    return <MainNavigator />;
  }
}
