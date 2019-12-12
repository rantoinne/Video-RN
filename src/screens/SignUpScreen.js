import React, { Component } from "react";
import { Dimensions, StyleSheet, View, Text, TextInput, Platform, StatusBar, Keyboard, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import commonStyles from '../assets/styles/CommonStyles';
import BackArrow from '../components/BackArrow';
import Colors from '../assets/styles/Colors';
import Constants from '../utils/Constants';
import * as UserService from '../services/User';
import Mixpanel from '../services/Mixpanel';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { SafeAreaView } from "react-navigation";
import Toast from 'react-native-root-toast';
import ButtonBottom from "../components/ButtonBottom";
import ShowToast from "../services/DisplayToast";
import realm from '../realm';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const { width, height } = Dimensions.get('window');
const screen = Dimensions.get('window');

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class SignUpScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: "Sign Up",
    headerLeft: <BackArrow navigation={navigation} />,
    headerTransparent: true,
    headerStyle: {
      backgroundColor: Colors.transparent,
      paddingTop: Constants.STATUS_BAR_HEIGHT,
      height: Constants.TOOLBAR_HEIGHT
    },
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
      marginLeft: -50,
      fontSize: width / (width / 12) + 2
    }
  });

  constructor(props) {
    super(props);
    this.sourceLang =  EN; 
    this.state = {
      isKeyboardShow: false,
      value: 0,
      option: [
        { label: this.sourceLang.blabber, value: 0, subtext: this.sourceLang.blabberSubText },
        { label: this.sourceLang.blabee, value: 1, subtext: this.sourceLang.blabeeSubText }
      ],
    };
    this.user = realm.objects('User')[0];
  };

  nextToVerificationScreen = async () => {
    if (this.password !== this.confirmPassword) {
      ShowToast(this.sourceLang.passNotMatchToast);
      return;
    }
    let profession = this.state.value === 0 ? this.sourceLang.blabber : this.sourceLang.blabee;
    Keyboard.dismiss();
    try {
      var res = await UserService.signUp(this.firstName, this.lastName, this.mobileNumber, this.email, profession, this.password);
      // AnalyticsManager.regUniqueId(response._id);
      Mixpanel.setValue({$email: this.email});
      Mixpanel.trackEvent('SignUp');
      this.props.navigation.replace('VerificationScreen', { mobile: this.mobileNumber });
    } catch (error) {
      Toast.show(this.sourceLang.signUpCatchBlockToast, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        animation: true,
      });
    }
  }
  toggleUserRole(value) {
    this.setState({
      value: value.value
    })
  }

  async saveLocalVars(profession) {
    try {
      await AsyncStorage.setItem('@storage_Key', profession)
    } catch (e) {
    }
  }

  render() {
    var radioButton = this.state.option.map((item, index) => {
      return (
        <TouchableOpacity onPress={this.toggleUserRole.bind(this, item)} style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}>
          <View style={{
            marginRight: 15,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
            borderWidth: 0.1,
            borderColor: "#727272",
            height: 40,
            width: 40,
            borderRadius: 20,
          }}>
            {
              this.state.value === item.value ?
                <FontAwesome name="circle" size={30} color={Colors.purple} style={{ alignSelf: 'center' }} /> :
                <FontAwesome name="circle-thin" size={30} color={Colors.purple} style={{ alignSelf: 'center' }} />
            }
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Text numberOfLines={2} style={styles.roleText}>{item.label}</Text>
            <Text numberOfLines={2} style={styles.roleText}>({item.subtext})</Text>
          </View>
        </TouchableOpacity>
      )
    })
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <DismissKeyboardView>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
              <Entypo name="chevron-left" onPress={() => this.props.navigation.replace('Login')} size={28} color="black" style={{ alignSelf: 'center' }} />
              <Text style={styles.headerTitle}>{this.sourceLang.signUpTitle}</Text>
              <View style={{ width: screen.width / 10 }}></View>
            </View>

            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[commonStyles.container]}>
              <View style={{ width: screen.width, marginTop: 20, padding: 8, justifyContent: 'center', alignItems: "center", backgroundColor: Colors.white, }}>
                <TextInput
                  style={commonStyles.textInput}
                  onChangeText={text => this.firstName = text}
                  placeholder= {this.sourceLang.firstNameTextInput} />

                <TextInput
                  style={commonStyles.textInput}
                  keyboardType='email-address'
                  onChangeText={text => this.lastName = text}
                  placeholder= {this.sourceLang.lastNameTextInput} />

                <TextInput
                  style={commonStyles.textInput}
                  keyboardType='phone-pad'
                  onChangeText={text => this.mobileNumber = text}
                  placeholder= {this.sourceLang.mobileTextInput} />

                <TextInput
                  style={commonStyles.textInput}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  onChangeText={text => this.email = text}
                  placeholder= {this.sourceLang.emailTextInput} />

                <TextInput
                  style={commonStyles.textInput}
                  autoCapitalize='none'
                  secureTextEntry={true}
                  onChangeText={text => this.password = text}
                  placeholder= {this.sourceLang.passwordTextInput} />

                <TextInput
                  style={commonStyles.textInput}
                  autoCapitalize='none'
                  secureTextEntry={true}
                  onChangeText={text => this.confirmPassword = text}
                  placeholder= {this.sourceLang.conPasswordTextInput} />

              </View>
              <View style={{ width: screen.width, flexDirection: "row", paddingLeft: 35 }}>
                {radioButton}
              </View>
              <View style={{ width: screen.width, marginTop: 20, justifyContent: "center", alignItems: "center" }}>


                <ButtonBottom
                  onPress={this.nextToVerificationScreen.bind(this)}
                  title= {this.sourceLang.nextButtonTitle}
                />
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </DismissKeyboardView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
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
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notSelected: {
    textAlign: "center",
    height: 25,
    width: 25,
    backgroundColor: Colors.white,
    borderRadius: 12.5,
    ...Platform.select({
      ios: {
        fontWeight: "600",
        fontFamily: "Montserrat",
      },
      android: {
        fontFamily: "Montserrat-SemiBold",
      }
    })
  },
  roleText: {
    color: Colors.grey,
    fontSize: width / (width / 12) + 6,
    ...Platform.select({
      ios: {
        fontWeight: '200'
      },
      android: {
        fontFamily: 'Montserrat-Regular'
      }
    })
  },
  selected: {
    textAlign: "center",
    height: 25,
    width: 25,
    borderRadius: 12.5,
    backgroundColor: Colors.purple,
    ...Platform.select({
      ios: {
        fontWeight: "600",
        fontFamily: "Montserrat",
      },
      android: {
        fontFamily: "Montserrat-Bold",
      }
    })
  },
  textNext: {
    color: Colors.white,
    fontSize: width / (width / 12) + 4,
    textAlign: "center",
    ...Platform.select({
      ios: {
        fontWeight: 'bold',
        fontFamily: "Montserrat",
      },
      android: {
        fontFamily: "Montserrat-Bold",
      }
    })
  },
  nextButton: {
    justifyContent: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:Colors.purple,
    height: 50,
    width: screen.width - 30,
    borderRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default SignUpScreen;
