import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import {
  HeaderShape,
  Text,
  ContentContainer,
  Input,
  Theme,
  HorizontalContainer,
  Button,
  AbsoluteContainer,
  toast,
} from '../../components';

import {setI18nConfig, translate} from '../../../utils/localize';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import {Icon} from 'native-base';
import {inject, observer} from 'mobx-react';

@inject('userStore', 'mainStore')
export default class Login extends Component {
  state = {
    phone: '',
    password: '',
    error: null,
    loading: false,
  };

  async componentWillMount() {
    this.props.mainStore.getSavedLanguage().then((selectedLanguage) => {
      setI18nConfig(selectedLanguage);
      this.forceUpdate();
    });
  }

  async login() {
    this.setState({error: null});
    const {phone, password} = this.state;

    if (phone === '') {
      toast(translate('phone_error'));
    } else {
      if (password === '') {
        toast(translate('password_error'));
      } else {
        this.setState({loading: true});

        let res = await this.props.userStore.login({phone, password});

        this.setState({loading: false});

        //console.log("login res : ", res)
        if (res && res.error) {
          toast(res.message);
        }
        if (!res.error) {
          if (
            this.props.navigation.state.params &&
            this.props.navigation.state.params.addAccount
          ) {
            let newUserData = await this.props.userStore.getProfile(
              res.data.accessToken,
            );
            //console.log("new user data : ", newUserData)
            if (newUserData && !newUserData.error) {
              // this.props.userStore.setUserData(newUserData.data)
              this.props.userStore.setUserProfiles([
                ...this.props.userStore.userProfiles,
                {
                  ...newUserData.data,
                  selected: false,
                  accessToken: res.data.accessToken,
                },
              ]);
              toast(translate('account_added'));
              this.props.navigation.navigate('Home');
            }
          } else {
            let newUserData = await this.props.userStore.getProfile(
              res.data.accessToken,
            );
            if (newUserData && !newUserData.error) {
              this.props.userStore.setUserData(newUserData.data);
              this.props.userStore.setUserToken(res.data.accessToken);

              this.props.userStore.setUserProfiles([
                {
                  ...newUserData.data,
                  selected: true,
                  accessToken: res.data.accessToken,
                },
              ]);
              this.props.navigation.navigate('Home');
            }
          }
        }

        // if (!res.error) {
        //     this.props.navigation.navigate("Home")
        // } else {
        //     this.setState({ error: res.message })
        // }
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAwareScrollView style={{flex: 1}}>
          <HeaderShape />
          <ContentContainer>
            <Text large bold>
              {translate('login')}
            </Text>

            <Text>
              {this.props.navigation.state.params &&
              this.props.navigation.state.params.addAccount
                ? translate('signin_addaccount')
                : translate('signin_continue')}
            </Text>
            <View style={{marginTop: Theme.spacing.sectionVerticalSpacing}}>
              <Input
                maxChar={11}
                type="AntDesign"
                icon="phone"
                placeholder={translate('phone_placeholder')}
                onChange={(value) => this.setState({phone: value})}
                value={this.state.phone}
              />
              <Input
                type="Feather"
                icon="lock"
                placeholder={translate('password_placeholder')}
                secureTextEntry
                onChange={(value) => this.setState({password: value})}
                value={this.state.password}
              />

              <HorizontalContainer style={{}}>
                {this.props.navigation.state.params &&
                this.props.navigation.state.params.addAccount ? null : (
                  <Button
                    text={translate('forgot_password')}
                    textButton
                    width="50%"
                    onPress={() => {}}
                  />
                )}

                <Button
                  gradient
                  text={
                    this.props.navigation.state.params &&
                    this.props.navigation.state.params.addAccount
                      ? translate('add_account')
                      : translate('login')
                  }
                  arrow
                  loading={this.state.loading}
                  onPress={() => {
                    this.login();
                  }}
                />
              </HorizontalContainer>
            </View>
            {this.props.navigation.state.params &&
            this.props.navigation.state.params.addAccount ? (
              <HorizontalContainer noSpaceBetween>
                <Text> {translate('back_to')} </Text>
                <Button
                  text={translate('home')}
                  textButton
                  onPress={() => {
                    this.props.navigation.state.params &&
                    this.props.navigation.state.params.addAccount
                      ? this.props.navigation.navigate('Home')
                      : this.props.navigation.navigate('Signup');
                  }}
                />
              </HorizontalContainer>
            ) : (
              <View>
                <HorizontalContainer>
                  <Text> {translate('no_account')} </Text>
                  <Button
                    text={translate('signup')}
                    textButton
                    onPress={() => {
                      this.props.navigation.navigate('Signup');
                    }}
                  />
                </HorizontalContainer>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text> {translate('change_language')} </Text>

                  <HorizontalContainer>
                    <Button
                      text={translate('english')}
                      textButton
                      onPress={() => {
                        setI18nConfig('en');
                        this.forceUpdate();
                        this.props.mainStore.saveLanguage('en');
                      }}
                    />
                    <Button
                      text={translate('tamil')}
                      textButton
                      onPress={() => {
                        setI18nConfig('ta');
                        this.props.mainStore.saveLanguage('ta');
                        this.forceUpdate();
                      }}
                    />
                  </HorizontalContainer>
                </View>
              </View>
            )}
          </ContentContainer>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});
