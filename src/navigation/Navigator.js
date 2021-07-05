import React from 'react'
import { Dimensions } from 'react-native'
import {createStackNavigator} from 'react-navigation-stack'
import { createAppContainer,createSwitchNavigator} from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer'


import Login from '../modules/screens/Auth/Login'
import Signup from '../modules/screens/Auth/Signup'
import MainDrawer from '../modules/screens/Home/MainDrawer'

import Home from '../modules/screens/Home/Home/Home'
import ExamTypes from '../modules/screens/Home/Home/ExamTypes'
import Year from '../modules/screens/Home/Home/Year'
import ExamPart from '../modules/screens/Home/Home/ExamPart'
import Question from '../modules/screens/Home/Home/Question'
import Summary from '../modules/screens/Home/Home/Summary'
import Corrections from '../modules/screens/Home/Home/Corrections'

import Notification from '../modules/screens/Home/Notification/Notification'
import Wallet from '../modules/screens/Home/Wallet/Wallet'
import Practice from '../modules/screens/Home/Practice/Practice'
import Study from '../modules/screens/Home/Study/Study'
import StudyQuestion from '../modules/screens/Home/Study/StudyQuestion'

import Analytics from '../modules/screens/Home/Analytics/Analytics'
import AnalyticsDetail from '../modules/screens/Home/Analytics/AnalyticsDetail'

import Setting from '../modules/screens/Home/Setting/Setting'








const stackNavigatorOptions = {
    header:null,
    cardStyle:{
        backgroundColor:"#fff"
    }
}

const AuthStack = createStackNavigator({
     Login:{screen: Login},
     Signup:{screen: Signup}

    },
    {
        defaultNavigationOptions:stackNavigatorOptions
    }
)


const HomeStack = createStackNavigator({
    Home: { screen: Home },
    ExamTypes: { screen: ExamTypes },
    Year:{screen: Year},
    ExamPart:{screen: ExamPart},
    Question:{screen: Question},
    Summary:{screen: Summary},
    Corrections:{screen: Corrections},
    Notification:{screen: Notification},
    Wallet:{screen: Wallet},
    Practice:{screen: Practice},
    Study:{screen: Study},
    StudyQuestion: {screen: StudyQuestion},
    Analytics: {screen: Analytics},
    AnalyticsDetail: {screen: AnalyticsDetail},
    Setting: {screen: Setting},

    },
    {
        defaultNavigationOptions:stackNavigatorOptions
    }
)

const MainTabNavigator = createDrawerNavigator({
    Home : { screen : HomeStack }
    },{
        
        contentComponent:MainDrawer,
        drawerWidth: Dimensions.get('window').width - 80,
    }
)

const AuthNavigator = createAppContainer(
    createSwitchNavigator({
        Auth:{ screen: AuthStack},
        Home:{ screen: MainTabNavigator},
    })
)

const HomeNavigator = createAppContainer(
    createSwitchNavigator({
        Home:{ screen: MainTabNavigator},
        Auth:{ screen: AuthStack}
    })
)

export {AuthNavigator, HomeNavigator}
