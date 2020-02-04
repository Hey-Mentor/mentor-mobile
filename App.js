import React from 'react';
import { Provider } from 'react-redux';

import { AppLoading } from 'expo';
import { Root } from 'native-base';

import * as Font from 'expo-font';

import { PersistGate } from 'redux-persist/integration/react';
import AppContainer from './src/navigation';
import { fonts } from './src/theme';
import store, { persistor } from './src/redux/store';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync(fonts.type);
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
