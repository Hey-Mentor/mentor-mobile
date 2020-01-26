import React from 'react';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AppLoading } from 'expo';
import { Root } from 'native-base';
import Roboto from 'native-base/Fonts/Roboto.ttf';
import RobotoMedium from 'native-base/Fonts/Roboto_medium.ttf';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './store';
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

    return (
      <Root>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppContainer />
          </PersistGate>
        </Provider>
      </Root>
    );
  }
}

const MainNavigator = createStackNavigator({
  home: { screen: HomeAuth },
  notifications: { screen: NotificationsScreen },
  menteeListView: { screen: MenteesListView },
  menteeDetails: { screen: MenteeDetailsView },
  settings: { screen: Settings },
  chat: { screen: ChatScreen },
});

const AppContainer = createAppContainer(MainNavigator);