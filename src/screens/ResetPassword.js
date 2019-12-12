import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Dimensions, Keyboard, Platform } from "react-native";
import commonStyles from '../assets/styles/CommonStyles'
import Colors from '../assets/styles/Colors'
const screen = Dimensions.get('window')
import Entypo from 'react-native-vector-icons/Entypo';
import * as UserService from '../services/User';
import { SafeAreaView } from "react-navigation";
import ButtonBottom from '../components/ButtonBottom';
import ShowToast from "../services/DisplayToast";
import realm from '../realm';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const { width, height } = Dimensions.get('window');
class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      password: "",
      confirmPassword: "",
      otp: "",
      isKeyboardShow: true,
    }
    this.user = realm.objects('User')[0];
    this.sourceLang = EN;
  }


  async resetPassword() {
    if (!this.otp) {
      ShowToast(this.sourceLang.enterOTPToast);
      return;
    }
    if (!this.password || this.password !== this.confirmPassword) {
      ShowToast(this.sourceLang.passNotMatchToast);
      return;
    }
    try {
      let response = await UserService.resetPassword(this.props.navigation.state.params.mobile, this.otp, this.password)
      ShowToast(response['message']);
      this.props.navigation.replace('Login');
    }
    catch (error) {
      ShowToast(this.sourceLang.unableResettingToast)
    }
  }

  async resendOtp() {
    try {
      await UserService.forgotPassword(this.props.navigation.state.params.mobile)
      ShowToast(this.sourceLang.sentOTPToast);
    }
    catch (error) {
      ShowToast(error.message || this.sourceLang.probSendingOTPToast);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <DismissKeyboardView>
          <SafeAreaView>
            <View style={styles.header}>
              <Entypo onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')} name="chevron-left" size={24} color="black" style={{ alignSelf: 'center' }} />
              <Text style={styles.headerTitle}>{this.sourceLang.resetTitleAndBtnTitle}</Text>
              <View style={{ width: screen.width / 10 }}></View>
            </View>

            <View style={styles.textArea}>
              <Text style={styles.inputLabel}>{this.sourceLang.resetSubTitle}</Text>
              <TextInput
                style={commonStyles.textInput}
                keyboardType='number-pad'
                autoCapitalize='none'
                onChangeText={text => this.otp = text}
                placeholder= {this.sourceLang.enterOTPTextInput} />

              <TextInput
                style={commonStyles.textInput}
                autoCapitalize='none'
                secureTextEntry={true}
                onChangeText={text => this.password = text}
                placeholder= {this.sourceLang.newPassTextInput} />

              <TextInput
                style={commonStyles.textInput}
                autoCapitalize='none'
                secureTextEntry={true}
                onChangeText={text => this.confirmPassword = text}
                placeholder= {this.sourceLang.confPasswordTextInput} />

              <Text
                onPress={() => this.resendOtp()}
                style={styles.resendButton}>{this.sourceLang.resendOTPLink}</Text>

            </View>

            <View style={{ width: screen.width, width: screen.width, bottom: 10, justifyContent: "center", alignItems: "center" }}>
              <ButtonBottom
                onPress={() => this.resetPassword()}
                title= {this.sourceLang.resetTitleAndBtnTitle}
              />
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
    width: screen.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        marginTop: 20,
      },
      android: {
        marginTop: 30,
      }
    })
  },
  inputLabel: {
    marginBottom: 20,
    color: 'black',
    fontSize: width / (width / 12) + 4,
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
  textArea: {
    flex: 1,
    flexDirection: 'column',
    width: screen.width,
    paddingTop: 30,
    justifyContent: 'flex-start',
    alignItems: "center"
  },
  resendButton: {
    fontSize: width / (width / 12) + 4,
    color: 'blue',
    ...Platform.select({
      ios: {
        fontWeight: 'bold',
        fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-SemiBold"
      }
    })
  },
});

export default ResetPassword;