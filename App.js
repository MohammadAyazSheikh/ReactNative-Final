import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
//----persist step 2  ------
import { PersistGate } from 'redux-persist/es/integration/react'
import { Loading } from './components/LoadingComponent';


//----persist step 3  ------
const { persistor, store } = ConfigureStore();

export default class App extends React.Component {
  render() {
    return (
      //----persist final step 
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}> 
          <Main />
        </PersistGate>
      </Provider>
    );
  }
}