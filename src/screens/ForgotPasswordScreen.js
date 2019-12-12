import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Dimensions, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import commonStyles from '../assets/styles/CommonStyles'
import Colors from '../assets/styles/Colors'
const screen = Dimensions.get('window')
import Entypo from 'react-native-vector-icons/Entypo';
import * as UserService from '../services/User';
import { SafeAreaView } from 'react-navigation';
import realm from '../realm';
import ButtonBottom from "../components/ButtonBottom";
import ShowToast from "../services/DisplayToast";

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const { width, height } = Dimensions.get('window');
class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      password: "",
      isKeyboardShow: true,
    };
    this.user = realm.objects('User')[0];
    this.sourceLang = EN;
  }


  signUp() {
    this.props.navigation.replace('SignUp');
  }

  async onLogin() {

    if (this.mobile === "") {
      ShowToast(this.sourceLang.enterRegMobileToast);
    }

    else {
      try {
        await UserService.forgotPassword(this.mobile)
        this.props.navigation.replace('ResetPassword', { mobile: this.mobile });
      }
      catch(error) {
        ShowToast(error.message || this.sourceLang.somethingWentWrongToast);
      }
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <DismissKeyboardView>
          <SafeAreaView>
            <View style={styles.header}>
              <Entypo name="chevron-left" onPress={() => this.props.navigation.replace('Login')} size={24} color="black" style={{ alignSelf: 'center' }} />
              <Text style={styles.headerTitle}>{this.sourceLang.forgotPassTitle}</Text>
              <View style={{ width: screen.width / 10 }}></View>
            </View>

            <View style={styles.textArea}>
              <Text style={styles.inputLabel}>{this.sourceLang.enterMobiletext}</Text>
              <TextInput
                style={commonStyles.textInput}
                keyboardType='number-pad'
                autoCapitalize='none'
                onChangeText={text => this.mobile= text }
                placeholder= {this.sourceLang.mobileTextInput} />
            </View>
            <View style={{ width: screen.width, width: screen.width, bottom: 10, justifyContent: "center", alignItems: "center" }}>
              <ButtonBottom
                onPress={()=> this.onLogin()}
                title= {this.sourceLang.sendOTPLink}
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
    flex:1,
    flexDirection:'column',
    width: screen.width,
    paddingTop: 30,
    justifyContent: 'flex-start',
    alignItems: "center"
  },
});

export default ForgotPasswordScreen;