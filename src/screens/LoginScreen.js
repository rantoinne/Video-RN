import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Platform, Keyboard, BackHandler, Dimensions, TouchableWithoutFeedback, ScrollView } from "react-native";
import commonStyles from '../assets/styles/CommonStyles'
import Colors from '../assets/styles/Colors'
const screen = Dimensions.get('window')
import * as UserService from '../services/User';
import Mixpanel from '../services/Mixpanel';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-navigation';
import ShowToast from '../services/DisplayToast';
import ButtonBottom from "../components/ButtonBottom";
import realm from '../realm';
import { Switch } from 'react-native-switch';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const { width, height } = Dimensions.get('window');

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.sourceLang = EN;
    this.state = {
      isKeyboardShow: true,
      isEnglishNative: true,
      disableButton: false
    };
    this.user = realm.objects('User')[0];
    this.email;
    this.password;
  }

  forgotPassword() {
    this.props.navigation.replace('ForgotPasswordScreen');
  }

  signUp() {
    this.props.navigation.replace('SignUp');
  }

  componentDidMount() {
    AsyncStorage.clear();
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => {
      return true;
    });
    this.email = "";
    this.password = "";
  }

  setEnglishAsDefault(value) {
    this.setState({ 
      isEnglishNative: value
    });
    this.sourceLang = value ? EN : ZH;
  }

  onLogin = async () => {
    AsyncStorage.clear();
    if (!this.email || !this.password) {
      ShowToast(this.sourceLang.credentialEmptyToast);
      return;
    }
    try {
      this.setState({
        disableButton: true
      });
      var response = await UserService.loginIn(this.email, this.password, this.state.isEnglishNative);
      const userType = await AsyncStorage.getItem('@user_Type');
      Mixpanel.regUniqueId(response._id);
      Mixpanel.setValue({ $email: this.email, $name: this.user.firstName + this.user.lastName, roleR: this.user.type });
      Mixpanel.trackEvent('Login');
      if (userType === 'blabee') {
        this.props.navigation.navigate('HomeforBlabee');
      }
      if (userType === 'blabber') {
        this.props.navigation.navigate('HomeforBlabber');
      }
      this.setState({
        disableButton: false
      });
    } catch (error) {
      this.setState({
        disableButton: false
      });
      ShowToast(error.message || this.sourceLang.somethingWentWrongToast);
    }
  }

  inActiveMethod() { }

  render() {
    return (
      <View style={styles.container}>
        <DismissKeyboardView>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{this.sourceLang.loginWelcomeTitle}</Text>
            </View>
            <View style={styles.textArea}>
              <TextInput
                style={commonStyles.textInput}
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={text => this.email = text}
                placeholder={this.sourceLang.emailTextInput} />

              <TextInput
                style={commonStyles.textInput}
                autoCapitalize='none'
                secureTextEntry={true}
                onChangeText={text => this.password = text}
                placeholder={this.sourceLang.passwordTextInput} />
            </View>
            <ScrollView contentContainerStyle={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              <View style={styles.miniContainer}>
                <View style={styles.firstContent}>
                  <TouchableOpacity onPress={this.forgotPassword.bind(this)}>
                    <Text style={styles.redirectText}>{this.sourceLang.forgotPasswordLink}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ width: screen.width, marginTop: 50 }}>
                  <View style={styles.textDetail}>
                    <Text style={styles.normalText}>{this.sourceLang.dontHaveAccount} </Text>
                    <TouchableOpacity onPress={this.signUp.bind(this)}>
                      <Text style={styles.redirectText}> {this.sourceLang.signUpLink}</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
            </ScrollView>

            <View style={{ marginTop: 20, width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style= {styles.textPlain}>
                {this.sourceLang.setEnglishDefault}
              </Text>
              <Switch
                value={this.state.isEnglishNative}
                onValueChange={(value) => this.setEnglishAsDefault(value)}
                activeText={this.sourceLang.switchActiveApplicationTitle}
                inActiveText={this.sourceLang.switchInactiveApplicationTitle}
                circleSize={width / 15}
                barHeight={width / 13}
                circleBorderInactiveColor="white"
                circleBorderWidth={0}
                activeTextStyle={{ color: 'white', fontSize: 15 }}
                inactiveTextStyle={{ color: 'white', fontSize: 15 }}
                backgroundActive={'#00E3AE'}
                backgroundInactive={'gray'}
                circleActiveColor={'white'}
                renderInsideCircle={() => <View style={{ backgroundColor: 'white', width: 20, height: 20, borderRadius: 10 }} />}
                changeValueImmediately={true}
                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                renderActiveText={true}
                renderInActiveText={true}
                switchWidthMultiplier={2.8}
                switchLeftPx={1.3}
                switchRightPx={1.1}
              />
            </View>

            <View style={{ width: screen.width, justifyContent: "center", alignItems: "center" }}>
              <ButtonBottom onPress={this.state.disableButton ? this.inActiveMethod : this.onLogin} title={this.sourceLang.loginButtonTitle} />
            </View>
          </SafeAreaView>
        </DismissKeyboardView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screen.height,
    width: screen.width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  miniContainer: {
    width: screen.width,
    height: screen.height - 300
  },
  main: {
    backgroundColor: Colors.white,
    height: screen.height,
    backgroundColor: Colors.white,
  },
  firstContent: {
    width: screen.width,
    justifyContent: 'center',
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 15,
  },
  textArea: {
    marginTop: screen.width / 6,
    width: screen.width,
    padding: 5,
    justifyContent: 'center',
    alignItems: "center"
  },
  textPlain: {
    marginRight: 10,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        fontWeight: "400",
        fontFamily: 'Montserrat'
      },
      android: {
        fontFamily: 'Montserrat-Regular'
      }
    })
  },
  textDetail: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10
  },
  nextButton: {
    justifyContent: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.purple,
    width: screen.width - 30,
    marginBottom: 10,
  },
  redirectText: {
    fontSize: width / (width / 12) + 4,
    color: Colors.blue,
    ...Platform.select({
      ios: {
        fontWeight: "bold",
        fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-Bold"
      }
    })
  },
  normalText: {
    fontSize: width / (width / 12) + 4,
    color: Colors.black,
    ...Platform.select({
      ios: {
        fontWeight: "bold",
        fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-Bold"
      }
    })
  },
  headerTitle: {
    fontSize: width / (width / 12) + 6,
    color: 'black',
    ...Platform.select({
      ios: {
        fontWeight: 'bold',
        fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-Bold"
      }
    })
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    width: screen.width,
    ...Platform.select({
      ios: {
        marginTop: 20,
      },
      android: {
        marginTop: 30,
      }
    })
  },
  normalTextSecond: {
    fontSize: width / (width / 12) + 4,
    textAlign: "center",
    color: Colors.black,
    padding: width / (width / 12) + 4,
    ...Platform.select({
      ios: {
        fontWeight: "bold",
        fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-Bold"
      }
    })
  },

});

export default LoginScreen;