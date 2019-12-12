import React, { Component } from 'react';
import { View, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class SplashScreen extends Component {

  componentDidMount = async () => {
    const bearerToken = await AsyncStorage.getItem('@auth_Token');
    const userType = await AsyncStorage.getItem('@user_Type');
    // alert(JSON.stringify([bearerToken, userType]));
    setTimeout(() => {
      if (!bearerToken || !userType) {
        this.props.navigation.replace('Slider');
      }
      if (userType === 'blabee') {
        this.props.navigation.navigate('HomeforBlabee');
      }
      if (userType === 'blabber') {
        this.props.navigation.navigate('HomeforBlabber');
      }
    }, 2000);
 
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <Image
          style={{ height: 70, width: 150 }}
          resizeMode="contain"
          source={require('../assets/images/splashLogo.png')} />
      </View>
    );
  }
}

export default SplashScreen;