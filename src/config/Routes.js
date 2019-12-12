import { createSwitchNavigator, createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import React from 'react'
import { Dimensions } from 'react-native'
import SplashScreen from '../screens/SplashScreens';
import SignUpScreen from '../screens/SignUpScreen'
import VerificationScreen from '../screens/VerificationScreen'
import TermsAndConditionScreen from '../screens/TermsAndConditionScreen'
import SliderScreen from "../screens/SliderScreen";
import HamburgerIcon from '../components/HamburgerIcon'
import HomeforBlabee from '../screens/HomeforBlabee'
import HomeforBlabber from '../screens/HomeforBlabber'
import VideoCall from '../screens/VideoCall'
import RequestApplicationStep1 from '../screens/RequestApplicationStep1'
import RequestApplicationStep2 from '../screens/RequestApplicationStep2'
import RequestApplicationStep3 from '../screens/RequestApplicationStep3'
import Drawer from '../components/Drawer'
import LoginScreen from '../screens/LoginScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import ResetPassword from '../screens/ResetPassword'
import ProfileScreen from '../screens/ProfileScreen'
import AllSessions from '../screens/AllSessions'
import Payment from '../screens/Payments';
import WaitingScreen from '../screens/WaitingScreen';


const screen = Dimensions.get('window');

const SignUpStack = createStackNavigator({
  Splash: {
    screen: SplashScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  Slider: {
    screen: SliderScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  VerificationScreen: {
    screen: VerificationScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  TermsAndCondition: {
    screen: TermsAndConditionScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  ForgotPasswordScreen: {
    screen: ForgotPasswordScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  ResetPassword: {
    screen: ResetPassword,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
}, {
    initialRouteName: 'Splash',
  }
)
const HomeStack = createStackNavigator({
  SignUpStack: {
    screen: SignUpStack,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false,
    })
  },
  HomeforBlabee: {
    screen: HomeforBlabee,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerLeft: <HamburgerIcon navigationProps={navigation} />,
      gesturesEnabled: false,
    })
  },
  HomeforBlabber: {
    screen: HomeforBlabber,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerLeft: <HamburgerIcon navigationProps={navigation} />,
      gesturesEnabled: false,
    })
  },
  VideoCall: {
    screen: VideoCall,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerLeft: <HamburgerIcon navigationProps={navigation} />,
      gesturesEnabled: false,
    })
  },
},
  {
    // initialRouteName:'CheckAndRedirect',
  })

const MainStack = createDrawerNavigator({
  HomeStack,
  Payment: {
    screen: Payment,
    navigationOptions: ({ navigation }) => ({
      header: null,
      drawerLockMode: 'locked-closed',
    })
  },
  ProfileScreen: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      drawerLockMode: 'locked-closed',
    })
  },
  AllSessions: {
    screen: AllSessions,
    navigationOptions: ({ navigation }) => ({
      header: null,
      drawerLockMode: 'locked-closed',
    })
  },
  WaitingScreen: {
    screen: WaitingScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      drawerLockMode: 'locked-closed',
    })
  },
  RequestApplicationStep1: {
    screen: RequestApplicationStep1,
    navigationOptions: ({ navigation }) => ({
      header: null,
      drawerLockMode: 'locked-closed',
    })
  },
  RequestApplicationStep2: {
    screen: RequestApplicationStep2,
    navigationOptions: ({ navigation }) => ({
      header: null,
      drawerLockMode: 'locked-closed',
    })
  },
  RequestApplicationStep3: {
    screen: RequestApplicationStep3,
    navigationOptions: ({ navigation }) => ({
      header: null,
      drawerLockMode: 'locked-closed',
    })
  }
}, {
    initialRouteName: 'HomeStack', //change
    drawerWidth: screen.width * 3 / 4,
    contentComponent: Drawer,
  })

export default createAppContainer(
  createSwitchNavigator({
    SignUpStack,
    MainStack,
  })
)