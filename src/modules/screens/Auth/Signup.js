import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import {
  HeaderShape,
  Text,
  ContentContainer,
  Input,
  Theme,
  HorizontalContainer,
  Button,
  NewSignupModal,
  toast,
} from '../../components';

import { setI18nConfig, translate } from '../../../utils/localize';
import Geolocation from '@react-native-community/geolocation';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

import { Icon, CheckBox, ListItem, Body, Toast } from 'native-base';

import { inject, observer } from 'mobx-react';

@inject('userStore', 'mainStore')
export default class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    number: '',
    confirmPassword: '',
    loading: false,
    referral: false,
    referralCode: '',
    onBoardingModal: false,
  };
  async signup() {
    const {
      name,
      email,
      number,
      password,
      confirmPassword,
      referral,
      referralCode,
    } = this.state;

    if (name === '') {
      toast(translate('name_error'));
    } else {
      // if(email === ""){
      //     toast(translate('email_error') )
      // }else{
      if (number === '') {
        toast(translate('number_error'));
      } else {
        if (password === '') {
          toast(translate('password_error'));
        } else {
          if (confirmPassword === '') {
            toast(translate('confirm_password_error'));
          } else {
            if (password !== confirmPassword) {
              toast(translate('password_match_error'));
            } else {
              if (referral && referralCode === '') {
                toast(translate('referral_error'));
              } else {
                let data = {
                  fullName: name,
                  newPassword: password,
                  confirmNewPassword: confirmPassword,
                  phone: number,
                  userType: 'Student',
                };
                if (email) {
                  data.email = email;
                }
                if (referral) {
                  data.referredByCode = referralCode;
                }
                this.setState({ loading: true });
                let res = await this.props.userStore.register(data);

                if (res && res.error) {
                  toast(res.message);
                }
                if (!res.error) {
                  console.log('SIGNUP RES : ', res);
                  this.props.userStore.setUserData(res.data.data);
                  let loginRes = await this.props.userStore.login({
                    phone: number,
                    password,
                  });
                  this.setState({ loading: false });

                  if (!loginRes.error) {
                    this.props.userStore.setUserToken(
                      loginRes.data.accessToken,
                    );
                    this.props.userStore.setUserProfiles([
                      {
                        ...res.data.data,
                        accessToken: loginRes.data.accessToken,
                        selected: true,
                      },
                    ]);

                    this.setState({ onBoardingModal: true });
                    this.props.mainStore.getAllGrades(data);
                  } else {
                    toast(translate('signup_problem'));
                    this.props.navigation.navigate('Login');
                  }
                }
                this.setState({ loading: false });
              }
            }
          }
        }
      }
      // }
    }
  }

  componentDidMount() {
    Geolocation.getCurrentPosition(info => console.log("info", info));
  }



  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <HeaderShape />
          <ContentContainer>
            <Text large bold>
              {translate('sign_up')}
            </Text>
            <View style={{ marginTop: Theme.spacing.sectionVerticalSpacing }}>
              <Input
                type="Feather"
                icon="user"
                placeholder={translate('name_placeholder')}
                onChange={(value) => this.setState({ name: value })}
                value={this.state.name}
              />
              {/* <Input
                                type="Fontisto"
                                icon="email"
                                placeholder={translate('email_placeholder')}
                                onChange={(value)=> this.setState({ email: value }) }
                                value={this.state.email}
                            /> */}
              <Input
                maxChar={11}
                type="AntDesign"
                icon="phone"
                placeholder={translate('number_placeholder')}
                onChange={(value) => this.setState({ number: value })}
                value={this.state.number}
              />
              <Input
                type="Feather"
                icon="lock"
                placeholder={translate('password_placeholder')}
                onChange={(value) => this.setState({ password: value })}
                secureTextEntry
                value={this.state.password}
              />
              <Input
                type="Feather"
                icon="lock"
                placeholder={translate('confirm_password_placeholder')}
                onChange={(value) => this.setState({ confirmPassword: value })}
                secureTextEntry
                value={this.state.confirmPassword}
              />
              <HorizontalContainer noSpaceBetween>
                <CheckBox
                  checked={this.state.referral}
                  onPress={() =>
                    this.setState({ referral: !this.state.referral })
                  }
                  style={{ marginRight: 20 }}
                  color={Theme.palette.primaryDark}
                />
                <Text> {translate('have_referral')} </Text>
              </HorizontalContainer>

              {this.state.referral && (
                <Input
                  type="MaterialIcons"
                  icon="confirmation-number"
                  placeholder={translate('referral_placeholder')}
                  onChange={(value) => this.setState({ referralCode: value })}
                />
              )}

              <HorizontalContainer>
                <View></View>
                <Button
                  gradient
                  text={translate('sign_up')}
                  arrow
                  loading={this.state.loading}
                  onPress={() => {
                    this.signup();
                  }}
                />
              </HorizontalContainer>
            </View>
            <HorizontalContainer>
              <Text> {translate('already_have_account')} </Text>
              <Button
                text={translate('login')}
                textButton
                onPress={() => {
                  this.props.navigation.navigate('Login');
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
                    this.forceUpdate();
                    this.props.mainStore.saveLanguage('ta');
                  }}
                />
              </HorizontalContainer>
            </View>
          </ContentContainer>

          <NewSignupModal
            visible={this.state.onBoardingModal}
            navigation={this.props.navigation}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});
