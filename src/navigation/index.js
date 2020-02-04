import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeAuth from '../screens/HomeAuth';
import NotificationsScreen from '../screens/NotificationsScreen';
import MenteeDetailsView from '../screens/MenteeDetailsView';
import MenteesListView from '../screens/MenteesListView';
import Settings from '../screens/Settings';
import ChatScreen from '../screens/ChatScreen';

import { Routes } from '../constants';

const MainNavigator = createStackNavigator({
  [Routes.HOME]: { screen: HomeAuth },
  [Routes.NOTIFICATIONS]: { screen: NotificationsScreen },
  [Routes.MENTEE_LIST_VIEW]: { screen: MenteesListView },
  [Routes.MENTEE_DETAILS]: { screen: MenteeDetailsView },
  [Routes.SETTINGS]: { screen: Settings },
  [Routes.CHAT]: { screen: ChatScreen }
});

const AppContainer = createAppContainer(MainNavigator);

export default AppContainer;
