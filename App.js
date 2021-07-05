/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import * as Sentry from "@sentry/react-native";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  I18nManager
} from 'react-native';
import i18n from "i18n-js";

import { AuthNavigator, HomeNavigator } from './src/navigation/Navigator'


import * as RNLocalize from "react-native-localize";

import { stores } from './src/mobx';
import { Provider, observer, inject } from "mobx-react";

import AsyncStorage from '@react-native-community/async-storage';


import { setI18nConfig } from './src/utils/localize'

import { Root, StyleProvider, Toast } from "native-base";
import { create } from 'mobx-persist'


const hydrate = create({
  storage: AsyncStorage,
  jsonify: true
})

@observer
class App extends Component {

  state = {
    loginReady: false,
    loggedIn: false
  }

  constructor(props) {
    super(props)


      Promise.all([
        hydrate('user', stores.userStore)
      ])
      .then(() => { 
        this.setState({ loginReady: true })
        this.checkUserLogin() 
      });

      Promise.all([
        hydrate('mainStore', stores.mainStore)
      ])
      .then(() => { 
      });
  }

  async setLanguage(){
    var selectedLanguage = await stores.mainStore.getSavedLanguage()
    console.log("SELECTED LANGUAGE : ", selectedLanguage)

    setI18nConfig(selectedLanguage)
    this.forceUpdate()

  }

  componentWillMount(){
    Sentry.init({
      dsn: "https://9fb8df49d5f24101ac47878e83515110@o683694.ingest.sentry.io/5771282",
    });
  }

  componentDidMount() {
    


    this.setLanguage()

    RNLocalize.addEventListener("change", this.handleLocalizationChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
  };

  checkUserLogin(){

      if (stores.userStore.userToken) {
        this.setState({ loginReady: true, loggedIn: true })
      } else {
        this.setState({ loginReady: true, loggedIn: false })
      }
    
  }

  async componentWillMount() {

    //console.log("ACCESS TOKEN : ", stores.userStore.userToken)

    

  }

  render() {

    const { loggedIn, loginReady } = this.state

    return (


      loginReady ? (
        loggedIn ? (
          <Provider {...stores}>
            <Root>
              <HomeNavigator />
            </Root>
          </Provider>
        ) : (
            <Provider {...stores}>
              <Root>
                <AuthNavigator />
              </Root>
            </Provider>
          )
      ) : (null)


    )

  }

}


export default App;
