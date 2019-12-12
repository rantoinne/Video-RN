import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Switch, Animated, Platform, Modal, TouchableWithoutFeedback, Picker, ScrollView, Keyboard, UIManager, TouchableOpacity, Dimensions, ListView, Image } from "react-native";
import Colors from '../assets/styles/Colors'
import { Card } from 'react-native-material-cards'
import ImagePicker from 'react-native-image-picker';
import commonStyles from '../assets/styles/CommonStyles'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ModalDropdown from 'react-native-modal-dropdown';
import * as UserService from '../services/User';
import { SafeAreaView } from "react-navigation";
import ButtonBottom from "../components/ButtonBottom";
import ShowToast from "../services/DisplayToast";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import realm from '../realm';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const screen = Dimensions.get('window')
const { width, height } = Dimensions.get('window')
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const options = ['French', 'German'];

const { State: TextInputState } = TextInput;

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.user = realm.objects('User')[0];
    this.sourceLang = this.user.defaultLanguage == "ZH" ? ZH : EN;
    this.state = {
      id: 0,
      filePath: {},
      loaded: false,
      showModalForPrimaryDegree: false,
      index: 0,
      token: '',
      shift: new Animated.Value(0),
      userInfoStored: {},
      visibleLanguageText: this.sourceLang.nativeLanguage,
      addOnTopics: "",
      otherNewDegree: false,
      value: true,
      showModalForOtherDegree: false,
      bools: [
        { d: false, val: this.sourceLang.sports },
        { d: false, val: this.sourceLang.garden },
        { d: false, val: this.sourceLang.wildLife },
        { d: false, val: this.sourceLang.music },
        { d: false, val: this.sourceLang.food },
        { d: false, val: this.sourceLang.travel },
        { d: false, val: this.sourceLang.language },
        { d: false, val: this.sourceLang.technology },
        { d: false, val: this.sourceLang.space },
        { d: false, val: this.sourceLang.cinema },
        { d: false, val: this.sourceLang.tour },
        { d: false, val: this.sourceLang.elections }
      ],
      aboutMe: "",
      language: '',
      newDegree: false,
      institution: '',
      language1: '',
      institution1: '',
      setUserType: '',
      selected: [],
      institution2: '',
      profilePic: "",
      nativeLanguage2: '',
      dataSource: [
        { id: 0, text: this.sourceLang.language, },
        { id: 1, text: this.sourceLang.educationTabTitle, },
        { id: 2, text: this.sourceLang.topics, },
        { id: 3, text: this.sourceLang.photosTabTitle, },
        { id: 4, text: this.sourceLang.aboutMeTabTitle, },
      ],
    };
  }

  async onUpdate() {

    var request = {};
    request["isEnglishNativeLanguage"] = this.state.userInfoStored.isEnglishNativeLanguage;

    request["topics"] = this.state.selected;

    request["aboutMe"] = (this.state.aboutMe !== this.state.userInfoStored.aboutMe && this.state.aboutMe !== "") ? this.state.aboutMe : this.state.userInfoStored.aboutMe;

    request["primaryDegree"] = (this.state.language !== this.state.userInfoStored.primaryDegree && this.state.language !== "") ? this.state.language : this.state.userInfoStored.primaryDegree;

    request["primaryInstitution"] = (this.state.institution !== this.state.userInfoStored.primaryInstitution && this.state.institution !== "") ? this.state.institution : this.state.userInfoStored.primaryInstitution;

    request["otherDegree"] = (this.state.language1 !== this.state.userInfoStored.otherDegree && this.state.language1 !== "") ? this.state.language1 : this.state.userInfoStored.otherDegree;

    request["otherInstitution"] = (this.state.institution1 !== this.state.userInfoStored.otherInstitution && this.state.institution1 !== "") ? this.state.institution1 : this.state.userInfoStored.otherInstitution;

    request["otherLanguage"] = (this.state.nativeLanguage2 !== this.state.userInfoStored.otherLanguage && this.state.nativeLanguage2 !== "") ? this.state.nativeLanguage2 : this.state.userInfoStored.otherLanguage;

    request["profilePic"] = this.state.loaded ? this.state.profilePic : this.state.userInfoStored.profilePic;

    try {
      const data = await UserService.updateProfile(request)
      console.warn(data)
      realm.write(() => {
        this.user.profilePic = data.user.profilePic
      });
      console.warn("data", realm.objects('User'));
      ShowToast(this.sourceLang.profileUpdateToast);
    }
    catch (error) {
      ShowToast(error.message || this.sourceLang.errProfileUpdateToast);
    }
  }

  componentWillUnmount () {
    didBlurSubscription.remove();
    didFocusSubscription.remove();
  }

  toggleSwitch(value) {
    if (!value) {
      this.setState({
        visibleLanguageText: this.sourceLang.languageInactiveSwitch
      });
    } else {
      this.setState({
        visibleLanguageText: this.sourceLang.nativeLanguage
      });
    }

    var clone = Object.assign(this.state.userInfoStored)
    clone.isEnglishNativeLanguage = value
    this.setState({
      userInfoStored: clone
    });
  }

  langSelect(index) {
    this.setState({
      index: index
    })
  }

  choseTab(item, i) {
    this.setState({
      id: item.id
    })
  }

  renderListViewItem = (item, sec, index) => {
    return (
      <TouchableOpacity onPress={this.choseTab.bind(this, item, index)} style={{ paddingHorizontal: 16 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={this.state.id === item.id ? styles.selectText : styles.normalText}>{item.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  selectThisTopic(item, index) {
    var copySelected = Object.assign(this.state.selected);

    var indexInArray = -1;
    indexInArray = copySelected.indexOf(item.val);

    if (indexInArray === -1) {
      copySelected.push(item.val);
    }

    else {
      copySelected.splice(indexInArray, 1)
    }

    this.setState({
      selected: copySelected,
      reload: !this.state.reload
    });

    var a = Object.assign(this.state.bools)
    a[index].d = !a[index].d
    this.setState({
      bools: a
    });

  }

  componentDidMount() {
    const didFocusSubscription = this.props.navigation.addListener(
      'willFocus',
        payload => {
          this.populateUserProfile();
    });
  }
  
  async componentWillMount() {
    this.populateUserProfile();
  }

  populateUserProfile=async()=> {
    try {
      var response = await UserService.userMe()
      this.populateTopics(response.user.topics);
      console.warn("response", response)
      this.setState({
        userInfoStored: response.user,
        aboutMe: response.user.aboutMe,
        institution: response.user.primaryInstitution,
        institution1: response.user.otherInstitution,
        primaryDegree: response.user.primaryDegree,
        otherDegree: response.user.otherDegree,
        selected: response.user.topics
      });
    }
    catch (error) {
      console.log(error)
      ShowToast(error.message || "Error fetching your profile");
    }
  }

  populateTopics(data) {
    var bools = Object.assign(this.state.bools);
    var count = 0;
    data.map((topic, idx) => {
      bools.map((bool, idx) => {
        if (bool.val === topic) {
          bool.d = !bool.d
          count = 1;
        }
      });
      if (count === 0) {
        bools.push({ d: true, val: topic });
      }
      count = 0;
    });

    this.setState({
      bools
    });
    bools = [];
  }

  chooseImage() {
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: false,
        path: 'images',
      },
      mediaType: 'photo',
      quality: .3,
      allowsEditing: true,
      maxWidth: 200,
      maxHeight: 200
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = response;
        this.setState({
          filePath: source,
          loaded: true,
          profilePic: "data:image/jpeg;base64," + response.data
        });
      }
    });
  }

  addNewTopics() {
    if (this.state.addOnTopics !== "") {
      var cloned = Object.assign(this.state.bools);
      var clonedSelected = Object.assign(this.state.selected);
      let newData = {
        d: true,
        val: this.state.addOnTopics
      };
      cloned.push(newData);
      clonedSelected.push(this.state.addOnTopics);
      this.setState({
        bools: cloned,
        selected: clonedSelected
      });
    }
  }

  selectFromDropdown(data) {
    this.setState({
      nativeLanguage2: options[data]
    });
  }

  selectPrimaryDegree(value) {
      this.setState({
        language: value,
        showModalForPrimaryDegree: false,
        newDegree: true
    });
  }

  selectOtherDegree(value) {
      this.setState({
        language1: value,
        showModalForOtherDegree: false,
        otherNewDegree: true
    });
  }

  selectPrimaryDegreeFromModal() {
    this.setState({
      showModalForPrimaryDegree: true,
      // newDegree: false
    });
  }

  selectOtherDegreeFromModal() {
    this.setState({
      showModalForOtherDegree: true,
    });
  }

  goBack() {
    this.setState({
      id: 0,
      index: 0,
    });
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <DismissKeyboardView>
          <SafeAreaView style={{ flex: 1, width, height }}>
            <View style={styles.header}>
              <Entypo name="chevron-left" onPress={() => this.goBack()} size={28} color="black" style={{ alignSelf: 'flex-start' }} />
              <Text style={styles.headerTitle}>{this.sourceLang.profileScreenTitle}</Text>
              <View style={{ width: width / 10 }}></View>
            </View>
            <View style={styles.headerScrollBar}>
              <Card style={{ width: screen.width, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: "#727272" }}>
                <ListView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  dataSource={ds.cloneWithRows(this.state.dataSource)}
                  renderRow={this.renderListViewItem}
                />
              </Card>
            </View>

            <ScrollView contentContainerStyle={{ width }}>

              <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                {this.state.id === 0 ? (
                  <View style={{ padding: 15, alignItems: "center", justifyContent: 'flex-start' }}>
                    <Text style={[styles.contentSecond, { marginTop: 20 }]}>
                      {this.state.visibleLanguageText}
                    </Text>
                    <View style={{ paddingTop: 10 }}>

                      <Switch
                        thumbColor={{ false: 'red', true: 'white' }}
                        style={{ alignSelf: 'center', marginTop: 10 }}
                        trackColor={{ false: '#d63031', true: "#00E3AE" }}
                        value={this.state.userInfoStored.hasOwnProperty("isEnglishNativeLanguage") ? this.state.userInfoStored.isEnglishNativeLanguage : this.state.value} onValueChange={this.toggleSwitch.bind(this)} />
                    </View>

                    <View style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center', width: '100%', paddingVertical: 10 }}>
                      <Text style={{ fontSize: width / (width / 12) + 4, textAlign: 'center', alignSelf: 'center', color: 'black', fontFamily: Platform.OS === 'ios' ? "Montserrat" : "Montserrat-Regular" }}>
                        {this.sourceLang.otherLangProfileText}
                      </Text>
                      <View style={{ width: '85%', height: height / 17, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, borderRadius: 50, borderWidth: 0.5, borderColor: "#d1ccc0", }}>

                        <ModalDropdown options={options}
                          style={{ width: '100%', height: null, borderWidth: 0 }}
                          dropdownStyle={{ width: '70%', height: height / 9, borderWidth: 1 }}
                          defaultValue={this.state.userInfoStored.otherLanguage === "" || !this.state.userInfoStored.hasOwnProperty("otherLanguage") ? "French" : this.state.userInfoStored.otherLanguage}
                          onSelect={(data) => this.selectFromDropdown(data)}
                          textStyle={{ fontSize: (width / (width / 12)) + 4, fontWeight: "500", fontFamily: Platform.OS === 'ios' ? "Montserrat" : "Montserrat-Regular" }}
                          dropdownTextStyle={{ fontSize: (width / (width / 12) + 2), fontWeight: "500", fontFamily: "Montserrat" }}
                        />

                      </View>
                    </View>
                  </View>
                ) : null}

                {this.state.id === 1 ? (
                  <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>

                    <View style={{ width: '85%', paddingHorizontal: 8, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 40, borderWidth: 0.5, marginTop: 24, borderColor: '#d1ccc0' }}>
                      <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }} onPress={() => this.selectPrimaryDegreeFromModal()}>

                        {
                          !this.state.newDegree ? (
                            <Text style={[styles.gridText, { textAlign: 'left', color: 'black' }]}>{this.state.userInfoStored.primaryDegree === "" || !this.state.userInfoStored.hasOwnProperty("primaryDegree") ? this.sourceLang.yourDegText : this.state.userInfoStored.primaryDegree}</Text>
                          ) : (
                              <Text style={[styles.gridText, { textAlign: 'left', color: 'black' }]}>{this.state.language}</Text>
                            )
                        }
                        <AntDesign name="caretdown" size={10} color="#95a5a6" />

                      </TouchableOpacity>
                    </View>

                    <Modal
                      animationType="slide"
                      transparent={true}
                      onRequestClose={() => this.setState({ showModalForPrimaryDegree: false })}
                      visible={this.state.showModalForPrimaryDegree}
                    >
                      <TouchableOpacity
                        onPress={() => this.setState({ showModalForPrimaryDegree: false })}
                        activeOpacity={1}
                      >
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width, height }}>
                          <View style={{ borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, width: '100%', height, backgroundColor: "#2f364010" }}>
                            <TouchableWithoutFeedback>
                              <View style={{ borderRadius: width / 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, width: '70%', height: (height / 2) - (height / 6), backgroundColor: "#fff", elevation: 4 }}>

                                <ScrollView contentContainerStyle={{ width }} showsVerticalScrollIndicator={false}>
                                  <TouchableOpacity onPress={() => this.selectPrimaryDegree("Graduate")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                    <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.graduate}</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.selectPrimaryDegree("Diploma")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                    <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.diploma}</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.selectPrimaryDegree("Post Graduate")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                    <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.postGrad}</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.selectPrimaryDegree("Doctorate")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                    <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.doctorate}</Text>
                                  </TouchableOpacity>
                                </ScrollView>

                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Modal>

                    <TextInput
                      value={this.state.institution}
                      onChangeText={(text) => this.setState({ institution: text })}
                      placeholderTextColor="#95a5a6"
                      style={styles.textInputEducation}
                      placeholder={this.state.userInfoStored.primaryInstitution === "" || !this.state.userInfoStored.hasOwnProperty("primaryInstitution") ? this.sourceLang.institutionTextInput : this.state.userInfoStored.primaryInstitution}
                    />

                    <Text style={{ alignSelf: 'center', fontSize: width / (width / 12) + 4, fontWeight: 'bold', marginTop: 30, fontFamily: "Montserrat" }}>
                      {this.sourceLang.otherEducationText}
                    </Text>

                    <View style={{ width: '85%', paddingHorizontal: 8, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 40, borderWidth: 0.5, marginTop: 24, borderColor: '#d1ccc0' }}>

                      <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }} onPress={() => this.selectOtherDegreeFromModal()}>

                        {
                          !this.state.otherNewDegree ? (
                            <Text style={[styles.gridText, { textAlign: 'left', color: 'black' }]}>{this.state.userInfoStored.otherDegree === "" || !this.state.userInfoStored.hasOwnProperty("otherDegree") ? this.sourceLang.yourDegText : this.state.userInfoStored.otherDegree}</Text>
                          ) : (
                              <Text style={[styles.gridText, { textAlign: 'left', color: 'black' }]}>{this.state.language1}</Text>
                            )
                        }
                        <AntDesign name="caretdown" size={10} color="#95a5a6" />

                      </TouchableOpacity>

                    </View>

                    <Modal
                      animationType="slide"
                      transparent={true}
                      onRequestClose={() => this.setState({ showModalForOtherDegree: false })}
                      visible={this.state.showModalForOtherDegree}
                    >
                      <TouchableOpacity
                        onPress={() => this.setState({ showModalForOtherDegree: false })}
                        activeOpacity={1}
                      >
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width, height }}>
                          <View style={{ borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, width: '100%', height, backgroundColor: "#2f364010" }}>
                            <TouchableWithoutFeedback>
                              <View style={{ borderRadius: width / 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, width: '70%', height: (height / 2) - (height / 6), backgroundColor: "#fff", elevation: 4 }}>

                                <ScrollView contentContainerStyle={{ width }} showsVerticalScrollIndicator={false}>
                                  <TouchableOpacity onPress={() => this.selectOtherDegree("Phd")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                    <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.phd}</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.selectOtherDegree("MBBS")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                    <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.mbbs}</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.selectOtherDegree("Btech")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                    <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.btech}</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => this.selectOtherDegree("BBA")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                    <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.bba}</Text>
                                  </TouchableOpacity>
                                </ScrollView>

                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Modal>

                    <TextInput
                      value={this.state.institution1}
                      onChangeText={(text) => this.setState({ institution1: text })}
                      placeholderTextColor="#95a5a6"
                      style={styles.textInputEducation}
                      placeholder={this.state.userInfoStored.otherInstitution === "" || !this.state.userInfoStored.hasOwnProperty("otherInstitution") ? this.sourceLang.institutionTextInput : this.state.userInfoStored.otherInstitution}
                    />

                  </View>
                ) : null}

                {this.state.id === 2 ? (
                  <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: (height / 100) * 55 }}>
                    <KeyboardAwareScrollView>
                      <ScrollView contentContainerStyle={{ width, justifyContent: 'center', alignItems: 'center', paddingVertical: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width }}>
                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[0], 0)}>
                            <View style={this.state.bools[0].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[0].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[0].val}</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[1], 1)}>
                            <View style={this.state.bools[1].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[1].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[1].val}</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[2], 2)}>
                            <View style={this.state.bools[2].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[2].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[2].val}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', width }}>
                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[3], 3)}>
                            <View style={this.state.bools[3].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[3].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[3].val}</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[4], 4)}>
                            <View style={this.state.bools[4].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[4].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[4].val}</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[5], 5)}>
                            <View style={this.state.bools[5].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[5].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[5].val}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', width }}>
                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[6], 6)}>
                            <View style={this.state.bools[6].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[6].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[6].val}</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[7], 7)}>
                            <View style={this.state.bools[7].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[7].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[7].val}</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[8], 8)}>
                            <View style={this.state.bools[8].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[8].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[8].val}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', width }}>
                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[9], 9)}>
                            <View style={this.state.bools[9].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[9].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[9].val}</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[10], 10)}>
                            <View style={this.state.bools[10].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[10].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[10].val}</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[11], 11)}>
                            <View style={this.state.bools[11].d ? styles.gridStyleActive : styles.gridStyle}>
                              <Text style={this.state.bools[11].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[11].val}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', width }}>
                          {
                            this.state.bools.length >= 13 ?
                              (<TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[12], 12)}>
                                <View style={this.state.bools[12].d ? styles.gridStyleActive : styles.gridStyle}>
                                  <Text style={this.state.bools[12].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[12].val}</Text>
                                </View>
                              </TouchableOpacity>) : null
                          }

                          {
                            this.state.bools.length >= 14 ?
                              (<TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[13], 13)}>
                                <View style={this.state.bools[13].d ? styles.gridStyleActive : styles.gridStyle}>
                                  <Text style={this.state.bools[13].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[13].val}</Text>
                                </View>
                              </TouchableOpacity>) : null
                          }

                          {
                            this.state.bools.length >= 15 ?
                              (<TouchableOpacity onPress={() => this.selectThisTopic(this.state.bools[14], 14)}>
                                <View style={this.state.bools[14].d ? styles.gridStyleActive : styles.gridStyle}>
                                  <Text style={this.state.bools[14].d ? styles.gridTextActive : styles.gridText}>{this.state.bools[14].val}</Text>
                                </View>
                              </TouchableOpacity>) : null
                          }
                        </View>

                      </ScrollView>
                      <TextInput
                        value={this.state.addOnTopics}
                        onSubmitEditing={() => this.addNewTopics()}
                        onChangeText={(text) => this.setState({ addOnTopics: text })}
                        placeholderTextColor="#95a5a6"
                        style={[commonStyles.textInput, { marginTop: 10, alignSelf: 'center' }]}
                        placeholder= {this.sourceLang.othersTextInput}
                      />
                    </KeyboardAwareScrollView>
                  </View>
                ) : null}

                {this.state.id === 3 ? (
                  <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>

                    {
                      !this.state.loaded ? (
                        this.state.userInfoStored.hasOwnProperty('profilePic') && this.state.userInfoStored.profilePic !== "" ? (
                          <TouchableOpacity onPress={() => this.chooseImage()}>
                            <Image
                              source={{ uri: this.state.userInfoStored.profilePic }}
                              style={{ width: 250, height: 250, marginTop: 20, borderRadius: 125 }}
                            />
                          </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => this.chooseImage()}>
                              <View
                                style={{ marginTop: 30, width: screen.width / 4, height: screen.width / 4, borderWidth: 0.5, borderColor: '#bdc3c7', borderRadius: screen.width / 8, justifyContent: 'center', alignItems: 'center' }}>
                                <Entypo name="plus" color="gray" size={60} style={{ alignSelf: 'center' }} />
                              </View>
                            </TouchableOpacity>
                          )
                      ) : (
                          <TouchableOpacity onPress={() => this.chooseImage()}>
                            <Image
                              source={{ uri: this.state.filePath.uri }}
                              style={{ width: 250, height: 250, marginTop: 20, borderRadius: 125 }}
                            />
                          </TouchableOpacity>
                        )
                    }

                    <Text style={styles.textPhoto}>{this.sourceLang.photoTitle}</Text>

                  </View>
                ) : null}

                {this.state.id === 4 ? (
                  <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TextInput
                      style={{ width: '85%', marginTop: 40, fontWeight: "400", fontFamily: "Montserrat", height: (screen.height / 100) * 25, borderWidth: 0.5, fontSize: 16, borderColor: '#bdc3c7', borderRadius: 20, textAlignVertical: 'top', paddingHorizontal: 18, paddingVertical: 12 }}
                      placeholder={this.state.userInfoStored.aboutMe === "" || !this.state.userInfoStored.hasOwnProperty("aboutMe") ? this.sourceLang.aboutMeTabTitle : this.state.userInfoStored.aboutMe}
                      placeholderTextColor="#bdc3c7"
                      value={this.state.aboutMe}
                      onChangeText={(text) => this.setState({ aboutMe: text })}
                      multiline={true}
                    />
                  </View>
                ) : null}
              </View>

            </ScrollView>
            <View style={{ alignSelf: 'center', bottom: 8 }}>

              <ButtonBottom
                onPress={this.onUpdate.bind(this)}
                title= {this.sourceLang.updateButtonTitle}
              />
            </View>
          </SafeAreaView>
        </DismissKeyboardView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  selectText: {
    textAlign: "center",
    color: Colors.activeBlue,
    fontSize: (screen.width / (screen.width / 12)) + 6,
    ...Platform.select({
      ios: {
        fontWeight: "bold",
        fontFamily: "Montserrat"
      },
      android: {
        fontSize: (screen.width / (screen.width / 12)) + 6,
        fontFamily: "Montserrat-Bold"
      }
    })
  },
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
  normalText: {
    textAlign: "center",
    color: Colors.black,
    fontSize: (screen.width / (screen.width / 12)) + 6,
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
  headerScrollBar: {
    marginTop: 20,
    ...Platform.select({
      ios: {
        height: '14%',
      },
      android: {
        height: '17%',
      }
    })
  },
  container: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  textNext: {
    textAlign: "center",
    color: Colors.white,
    fontSize: screen.width / (screen.width / 12) + 4,
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
    backgroundColor: Colors.purple,
    height: 40,
    width: screen.width - 30,
    borderRadius: 20,
    marginBottom: 10,
  },
  content: {
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 18,
  },
  contentSecond: {
    color: Colors.black,
    textAlign: "center",
    ...Platform.select({
      ios: {
        fontFamily: 'Montserrat',
        fontSize: screen.width / (screen.width / 12) + 4,
      },
      android: {
        fontFamily: 'Montserrat-Regular',
        fontSize: screen.width / (screen.width / 12) + 4,
      }
    })
  },
  gridText: {
    color: 'black',
    fontSize: 16,
    ...Platform.select({
      ios: {
        fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-Regular"
      }
    })
  },
  gridTextActive: {
    color: 'white',
    fontSize: 16,
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
  gridStyle: {
    width: (screen.width / 3),
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#bdc3c7'
  },
  gridStyleActive: {
    width: (screen.width / 3),
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#bdc3c7',
    backgroundColor: '#00E3AE'
  },
  textInputEducation: {
    width: '85%',
    marginTop: 30,
    paddingHorizontal: 18,
    fontSize: width / (width / 12) + 2,
    paddingVertical: height / 70,
    borderWidth: 0.5,
    borderRadius: 40,
    borderColor: '#d1ccc0',
    ...Platform.select({
      ios: {
        fontWeight: "400", fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-Regular"
      }
    })
  },
  textPhoto: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: width / (width / 12) + 6,
    marginTop: 40,
    ...Platform.select({
      ios: {
        fontWeight: "300", fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-Regular"
      }
    })
  }
});

export default ProfileScreen;