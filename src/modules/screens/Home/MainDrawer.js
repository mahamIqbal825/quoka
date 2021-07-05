import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Text, SafeAreaView, Alert } from 'react-native';
import { Icon } from 'native-base';
import { Theme, Text as CText, HorizontalContainer } from '../../components'

import AsyncStorage from '@react-native-community/async-storage'

import {NavigationActions, StackActions} from 'react-navigation';

import { observer, inject } from 'mobx-react'
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { translate } from '../../../utils/localize';

@inject('userStore')
@observer

export default class MainDrawer extends Component {
    constructor() {
        super();
        this.items = [
            {

                name: translate('home'),
                screen: 'Home',
                type: 'Entypo',
                iconName: 'home'
            },
            {

                name: translate('notification'),
                screen: 'Notification',
                type: 'MaterialIcons',
                iconName: 'notifications'
            },
            {

                name: translate('setting'),
                screen: 'Setting',
                type: 'Ionicons',
                iconName: 'settings'
            },
            {

                name: translate('wallet'),
                screen: 'Wallet',
                type: 'Entypo',
                iconName: 'wallet'
            },
            {

                name: translate('logout'),
                screen: 'logout',
                type: 'MaterialIcons',
                iconName: 'logout'
            },
        ];
    }


    showLogoutAlert(){
        Alert.alert(  
            'Logout',  
            'Are you sure you want to logout?',  
            [  
                {  
                    text: 'Cancel',  
                    onPress: () => {

                    },  
                    style: 'cancel',  
                },  
                {
                    text: 'Yes', onPress: () => {
                        
                        this.props.userStore.logout(this.props.navigation)

                    }
                },  
            ]  
        );
        
    }

    resetNavigation(){
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Home'})],
            key: null,
          });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <SafeAreaView style={styles.sideMenuContainer}>
                <ScrollView>
                {/* <LinearGradient colors={['#FFCA1A', '#E29E00']} style={{ flex: 1 }}> */}

                <View style={{
                    marginTop: 50,
                    alignItems: 'center'
                }}>
                    <Image
                        source={require('../../../assets/images/user_placeholder.jpg')}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            marginBottom: 20
                        }}
                    />
                    <CText
                        style={{ color: "#fff" }}
                        bold
                    >
                        {
                            this.props.userStore.userData.fullName
                        }
                    </CText>
                    <CText
                        style={{ color: "#fff" }}
                        small
                    >
                        {
                            this.props.userStore.userData.email
                        }
                    </CText>

                </View>
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        right: 15,
                        top: 50,
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => { this.props.navigation.closeDrawer() }}
                >
                    <Icon
                        type="AntDesign"
                        name="arrowleft"
                        style={{
                            color: "#fff"
                        }}
                    />
                </TouchableOpacity>

                <View style={{
                    marginTop: Theme.spacing.sectionVerticalSpacing,
                    borderTopColor: "#fff",
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: "#fff",
                    width: "100%",
                    padding: Theme.spacing.containerSpacing
                }}>
                    {
                        this.props.userStore.userProfiles.map((profile) => (
                            <TouchableOpacity 
                                disabled={profile.selected}
                                onPress={async ()=>{

                                    console.log("SELECTED USER PROFILE : ", profile)
                                    await this.props.userStore.getProfile(profile.accessToken, true);

                                    var switchProfile = profile
                                    switchProfile.selected = true
                                    this.props.userStore.switchUserAccount(switchProfile)
                                    
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({routeName: 'Home'})],
                                        key: null,
                                      });
                                    this.props.navigation.dispatch(resetAction);
                                    
                                }}
                            >

                                <HorizontalContainer style={{ marginBottom: 10 }} noSpaceBetween>
                                    <Image
                                        source={require('../../../assets/images/user_placeholder.jpg')}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 50,
                                            marginRight: 20
                                        }}
                                    />
                                    <CText bold white small>
                                        {
                                            profile.fullName
                                        }
                                </CText>
                                {
                                    profile.selected && (
                                        <View style={{ marginLeft: 40 }}>
                                            <Icon
                                                type="AntDesign"
                                                name="checkcircle"
                                                style={{ color: "#fff", fontSize: 20 }}
                                            />
                                        </View>
                                    )
                                }
                                    
                                </HorizontalContainer>
                            </TouchableOpacity>
                        ))
                    }


                    <TouchableOpacity
                        onPress={()=>{
                            this.props.navigation.navigate("Login",{ addAccount: true })
                        }}
                    >
                        <HorizontalContainer style={{ marginBottom: 10 }} noSpaceBetween>
                            <View style={{ alignItems: 'center', justifyContent: 'center', width: 50, height: 50, marginRight: 20 }}>
                                <Icon
                                    type="Ionicons"
                                    name="ios-add"
                                    style={{
                                        color: "#fff",
                                        fontSize: 30,
                                    }}
                                />
                            </View>

                            <CText bold white small>
                                {
                                    translate('add_account')
                                }
                            </CText>
                        </HorizontalContainer>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%' }}>
                    {this.items.map((item, key) => (
                        <TouchableOpacity
                            onPress={async () => {
                                //console.log("asdsd")
                                this.props.navigation.closeDrawer()
                                global.currentScreenIndex = key;
                                if (item.screen === "logout") {

                                    this.showLogoutAlert()

                                    
                                } else {
                                    this.props.navigation.navigate(item.screen);
                                }
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingTop: 15,
                                    paddingBottom: 10,
                                    backgroundColor: global.currentScreenIndex === key ? "rgba(255,255,255,0.01)" : Theme.palette.primary,
                                }}
                                key={key}>
                                <View style={{ marginRight: 10, marginLeft: 20 }}>
                                    <View style={{
                                        backgroundColor: Theme.palette.primaryDark,
                                        width: 45,
                                        height: 45,
                                        borderRadius: 50,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon
                                            type={item.type}
                                            name={item.iconName}
                                            style={{
                                                color: "#fff",
                                                fontSize: 25
                                            }}
                                        />
                                    </View>
                                </View>
                                <Text
                                    white
                                    style={{
                                        fontSize: 15,
                                        color: global.currentScreenIndex === key ? '#fff' : '#fff',
                                        marginLeft: 25,
                                        // borderBottomWidth: 1,
                                        borderBottomColor: "rgba(255,255,255,0.4)",
                                        width: Dimensions.get('window').width - 185,
                                        paddingBottom: 7,
                                        fontWeight: 'bold'

                                    }}
                                >
                                    {item.name}
                                </Text>
                            </View>

                        </TouchableOpacity>
                    ))}
                </View>
                {/* </LinearGradient> */}
                </ScrollView>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: Theme.palette.primary,
        alignItems: 'center',
        paddingTop: 20,

    },
    sideMenuProfileIcon: {
        resizeMode: 'center',
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
    },
});