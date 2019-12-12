import React from 'react';
import {
  View, Text, Dimensions, ScrollView, Keyboard, StyleSheet, TouchableWithoutFeedback, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, PickerIOS
} from 'react-native';
import BottomButton from '../components/ButtonBottom';
import commonStyles from '../assets/styles/CommonStyles'
import { SafeAreaView } from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import realm from '../realm';
import ShowToast from '../services/DisplayToast';
import DateTimePicker from 'react-native-modal-datetime-picker';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const { width, height } = Dimensions.get('window');

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class RequestApplicationStep1 extends React.Component {

  constructor(props) {
    super(props);
    this.user = realm.objects('User')[0];
    this.sourceLang = this.user.defaultLanguage == "ZH" ? ZH : EN;
    this.realmListner = () => this.forceUpdate();
    realm.addListener('change', this.realmListner);
    this.state = {
      value: "Male",
      option: [
        { gender: this.sourceLang.male },
        { gender: this.sourceLang.female }
      ],
      isDateTimePickerVisible: false,
      dob: "",
    };
    this.email = "";
    this.phone = "";

  }

  componentWillUnmount() {
    realm.removeListener('change', this.realmListner);
  }

  toggleUserGender(value) {
    this.setState({
      value: value.gender
    })
  }

  setDate(newDate) {
    console.warn(newDate)
    this.setState({
      dob: newDate
    })
  }

  selectGenderUI() {
    return this.state.option.map((item) => {
      return (
        <TouchableOpacity onPress={this.toggleUserGender.bind(this, item)} style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}>
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
              this.state.value === item.gender ?
                <FontAwesome name="circle" size={30} color="#964EF7" style={{ alignSelf: 'center' }} /> :
                <FontAwesome name="circle-thin" size={30} color="#964EF7" style={{ alignSelf: 'center' }} />
            }
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Text numberOfLines={2} style={styles.roleText}>{item.gender}</Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  processApplication() {
    var userDetails = {};
    userDetails["firstName"] = this.user.firstName;
    userDetails["lastName"] = this.user.lastName;
    userDetails["gender"] = this.state.value;
    userDetails["dob"] = this.state.dob;
    userDetails["email"] = this.email;
    userDetails["phone"] = this.phone;

    this.props.navigation.navigate('RequestApplicationStep2', { userDetails });
  }

  handleDatePicked = (date) => {
    var myDate = date;
    myDate = myDate.toString();
    let dateLength = myDate.length;
    this.setState({
      isDateTimePickerVisible: false,
      dob: myDate.substr(0, dateLength - 23)
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <DismissKeyboardView>
          <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={styles.header}>
              <Entypo name="chevron-left" onPress={() => this.props.navigation.goBack()} size={28} color="black" style={{ alignSelf: 'center' }} />
              <Text style={styles.headerTitle}>{this.sourceLang.applicationTitle}</Text>
              <View style={{ width: width / 10 }}></View>
            </View>

            <KeyboardAvoidingView style={{ width, height: height - 200, justifyContent: 'center', alignItems: 'center' }} behavior="padding" enabled>
              <ScrollView>
                <View style={styles.textArea}>
                  <TextInput
                    style={[commonStyles.textInput, { color: 'black' }]}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    editable={false}
                    value={this.user.firstName}
                    placeholder= {this.sourceLang.firstNameTextInput} />

                  <TextInput
                    style={[commonStyles.textInput, { color: 'black' }]}
                    autoCapitalize='none'
                    editable={false}
                    value={this.user.lastName}
                    placeholder= {this.sourceLang.lastNameTextInput} />

                  <View style={{ width, flexDirection: "row", marginBottom: 20, justifyContent: 'space-around' }}>
                    {
                      this.selectGenderUI()
                    }
                  </View>

                  <TouchableOpacity onPress={() => this.setState({ isDateTimePickerVisible: true })}>
                    <View style={{ width, flexDirection: "row", marginBottom: 20, justifyContent: 'space-around' }}>
                      <Text
                        style={{
                          ...commonStyles.textInput,
                          color: 'black',
                        }}
                      >{this.state.dob}</Text>
                      <DateTimePicker
                        mode="date"
                        is24Hour={false}
                        isVisible={this.state.isDateTimePickerVisible}
                        datePickerModeAndroid="spinner"
                        onConfirm={this.handleDatePicked}
                        onCancel={() => this.setState({ isDateTimePickerVisible: false })} />
                    </View>

                  </TouchableOpacity>

                  <TextInput
                    style={[commonStyles.textInput, { color: 'black' }]}
                    autoCapitalize='none'
                    onChangeText={(text) => this.email = text}
                    placeholder={this.sourceLang.emailTextInput} />

                  <TextInput
                    style={[commonStyles.textInput, { color: 'black' }]}
                    autoCapitalize='none'
                    keyboardType="number-pad"
                    onChangeText={(text) => this.phone = text}
                    placeholder={this.sourceLang.mobileTextInput} />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>

            <View style={{ marginTop: 20 }}>
              <BottomButton
                title={this.sourceLang.nextButtonTitle}
                onPress={this.processApplication.bind(this)}
              />
            </View>

          </SafeAreaView>
        </DismissKeyboardView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    width,
    ...Platform.select({
      ios: {
        marginTop: 20,
      },
      android: {
        marginTop: 30,
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
  textArea: {
    marginTop: width / 6,
    width,
    padding: 5,
    justifyContent: 'center',
    alignItems: "center"
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
})

export default RequestApplicationStep1;