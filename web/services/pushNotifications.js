import { Permissions, Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

//API notifications endpoint
const PUSH_ENDPOINT = '';

export default async () => {
  const previousToken = await AsyncStorage.getItem('pushToken');
  console.log(previousToken);
  if (previousToken) {
    return;
  }
  const { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

  if (status !== 'granted') {
    return;
  }

  const token = await Notifications.getExponentPushTokenAsync();
  await axios.post(PUSH_ENDPOINT, { token: { token } });
  AsyncStorage.setItem('pushToken', token);
};
