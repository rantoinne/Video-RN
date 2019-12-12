import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, Keyboard, TouchableWithoutFeedback } from "react-native";
import commonStyles from '../assets/styles/CommonStyles'
import Colors from '../assets/styles/Colors'
const screen = Dimensions.get('window')
import LinearGradient from 'react-native-linear-gradient'
import * as UserService from '../services/User';
import Entypo from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-navigation';
import realm from '../realm';
import ShowToast from "../services/DisplayToast";

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class VerificationScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.user = realm.objects('User')[0];
    this.sourceLang = EN;
    this.state = {
      verificationCode: ""
    }
  }

  componentWillMount = () => {
    try {
      UserService.resendOtp(this.props.navigation.state.params.mobile)
    }
    catch (error) {
      ShowToast(error.message || this.sourceLang.unableToSendOTPToast)
    }
  }

  async onVerifyCode() {

    if (this.verificationCode === "") {
      ShowToast(this.sourceLang.enterOTPToast)
    }

    else {
      Keyboard.dismiss();
      try {
        await UserService.verifyOtp(this.props.navigation.state.params.mobile, this.verificationCode)
        this.props.navigation.navigate('TermsAndCondition');
      }
      catch (error) {
        ShowToast(error.message || this.sourceLang.invalidOTPToast);
      }
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <DismissKeyboardView>
          <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'center', paddingHorizontal: 12, width: screen.width }}>
              <Entypo onPress={() => this.props.navigation.navigate('SignUp')} name="chevron-left" size={24} color="black" style={{ alignSelf: 'center' }} />
              <Text style={{ fontSize: 20, color: 'black', fontWeight: "bold", fontFamily: "Montserrat" }}>{this.sourceLang.verTitleAndTextInput}</Text>
              <View></View>
            </View>

            <View style={{ height: 40, marginTop: 50, marginBottom: 50 }}>
              <TextInput
                style={commonStyles.textInput}
                value={this.verificationCode}
                keyboardType='phone-pad'
                onChangeText={text => this.verificationCode = text}
                placeholder= {this.sourceLang.verTitleAndTextInput} />
            </View>
            <LinearGradient
              start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }}
              style={[styles.nextButton, { borderRadius: 30, height: 50 }]}
              colors={['#964EF7', '#745997']}>
              <TouchableOpacity onPress={this.onVerifyCode.bind(this)} style={{ width: screen.width - 30, height: 50, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={styles.textNext} >{this.sourceLang.nextButtonTitle}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </SafeAreaView>
        </DismissKeyboardView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // top:70,
    flex: 1,
    height: screen.height,
    width: screen.width,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textNext: {
    color: Colors.white,
    fontSize: 18,
    // fontWeight: 'bold',
    fontWeight: "bold",
    fontFamily: "Montserrat",
    textAlign: "center",
  },
  nextButton: {
    // justifyContent: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.purple,
    height: 50,
    width: screen.width - 30,
    borderRadius: 30,
    marginBottom: 10
  },

});

export default VerificationScreen;