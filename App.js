import React from 'react';
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import { AppLoading } from 'expo';
import { Root } from 'native-base';
import Roboto from 'native-base/Fonts/Roboto.ttf';
import RobotoMedium from 'native-base/Fonts/Roboto_medium.ttf';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import store from './store';
import HomeAuth from './screens/HomeAuth';
import NotificationsScreen from './screens/NotificationsScreen';
import MenteeDetailsView from './screens/MenteeDetailsView';
import MenteesListView from './screens/MenteesListView';
import Settings from './screens/Settings';
import ChatScreen from './screens/ChatScreen';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto,
      Roboto_medium: RobotoMedium,
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    const MainNavigator = StackNavigator({
      home: { screen: HomeAuth },
      notifications: { screen: NotificationsScreen },
      menteeListView: { screen: MenteesListView },
      menteeDetails: { screen: MenteeDetailsView },
      settings: { screen: Settings },
      chat: { screen: ChatScreen },
    });

    return (
      <Root>
        <Provider store={store}>
          <MainNavigator />
        </Provider>
      </Root>
    );
  }
}
