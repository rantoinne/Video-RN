import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo';
const moment = require('moment');
import realm from '../realm';
import * as SessionService from '../services/Session';
import ShowToast from '../services/DisplayToast';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const { width, height } = Dimensions.get('window');

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const visaImage = require('../assets/images/profileImg.png');
const mastercardImage = require('../assets/images/mastercard.png');

class AllSessions extends Component {

  constructor(props) {
    super(props);
    this.user = realm.objects('User')[0];
    this.sourceLang = this.user.defaultLanguage == "ZH" ? ZH : EN;
    this.state = {
      addCardBoolean: false,
      loader: false,
      allSessions: [],
      refreshing: false
    };
  }

  async fetchAllSessions() {
    this.setState({
      loader: true
    });
    var response = await SessionService.getAllSessions()
    console.log(response)
    this.setState({
      allSessions: response.sessions,
      loader: false
    });
  }

  componentDidMount = async () => {

    const didFocusSubscription = this.props.navigation.addListener(
      'willFocus',
        payload => {
          this.fetchAllSessions();
    });

    const didBlurSubscription = this.props.navigation.addListener(
      'didBlur',
        payload => {
          this.setState({
            addCardBoolean: false,
            loader: false,
            allSessions: [],
            refreshing: false
          });
    });
  }

  componentWillUnmount() {
    didBlurSubscription.remove();
    didFocusSubscription.remove();
  }

  sessionTypeReturn(type) {
    if (type === "casualTalk") {
      return "Casual Talk"
    }
    else {
      return "Tutoring"
    }
  }

  navigateToVideoCall(session) {
    this.props.navigation.navigate('VideoCall', { channelName: session });
  }

  renderAllStoredPayment(data) {
    if (data.length === 0) {
      return <Text style={[styles.cardSubDetail, { textAlign: 'center', alignSelf: 'center' }]}>{this.sourceLang.noSessionText}</Text>
    }
    else {
      return data.map((session, idx) => {
        if (session.status === "started" || session.status === "created") {
          return (
            <TouchableOpacity style={{ width: '100%' }} onPress={() => this.navigateToVideoCall(session._id)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#00E3AE', marginBottom: 0, borderTopWidth: 0.5, borderColor: 'black', borderRadius: 0, elevation: 1 }}>
                {
                  session.status === "started" ? (
                    <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <Image source={Object.keys(session.blabber).indexOf('profilePic') !== -1 && session.blabber.profilePic !== "" ? { uri: session.blabber.profilePic } : visaImage} style={{ width: 60, height: 60, borderRadius: 60 / 2 }} />
                      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                        <Text style={[styles.cardSubDetail, { color: 'white' }]}>{this.sourceLang.name}: {session.blabber.firstName}&nbsp;{session.blabber.lastName}</Text>
                        <Text style={[styles.cardSubDetail, { color: 'white' }]}>{this.sourceLang.type}: {this.sessionTypeReturn(session.type)}</Text>
                        <Text style={[styles.cardSubDetail, { color: 'white' }]}>{this.sourceLang.date}: {moment(session.startTime).format('YYYY/MM/DD HH:mm')}</Text>
                      </View>
                    </View>
                  ) : (
                      <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Image source={Object.keys(session.blabee).indexOf('profilePic') !== -1 && session.blabee.profilePic !== "" ? { uri: session.blabee.profilePic } : visaImage} style={{ width: 60, height: 60, borderRadius: 60 / 2 }} />
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                          <Text style={[styles.cardSubDetail, { color: 'white' }]}>{this.sourceLang.name}: {session.blabee.firstName}&nbsp;{session.blabee.lastName}</Text>
                          <Text style={[styles.cardSubDetail, { color: 'white' }]}>{this.sourceLang.type}: {this.sessionTypeReturn(session.type)}</Text>
                          <Text style={[styles.cardSubDetail, { color: 'white' }]}>{this.sourceLang.date}: {moment(session.startTime).format('YYYY/MM/DD HH:mm')}</Text>
                        </View>
                      </View>
                    )
                }
                <View style={{ justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>
                  <Text style={[styles.cardHeader, { color: 'white', fontSize: width / (width / 12) + 4 }]}>{session.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }
        else {
          return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 14, backgroundColor: 'white', marginBottom: 0, borderTopWidth: 0.5, borderColor: 'black', borderRadius: 0, elevation: 1 }}>
              {
                session.status === "ended" ? (
                  <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Image source={Object.keys(session.blabber).indexOf('profilePic') !== -1 && session.blabber.profilePic !== "" ? { uri: session.blabber.profilePic } : visaImage} style={{ width: 60, height: 60, borderRadius: 60 / 2 }} />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                      <Text style={[styles.cardSubDetail]}>{this.sourceLang.name}: {session.blabber.firstName}&nbsp;{session.blabber.lastName}</Text>
                      <Text style={[styles.cardSubDetail]}>{this.sourceLang.type}: {this.sessionTypeReturn(session.type)}</Text>
                      <Text style={[styles.cardSubDetail]}>{this.sourceLang.date}: {moment(session.startTime).format('YYYY/MM/DD HH:mm')}</Text>
                    </View>
                  </View>
                ) : (
                    <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <Image source={Object.keys(session.blabee).indexOf('profilePic') !== -1 && session.blabee.profilePic !== "" && session.blabee.profilePic !== "" ? { uri: session.blabee.profilePic } : visaImage} style={{ width: 60, height: 60, borderRadius: 60 / 2 }} />
                      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                        <Text style={[styles.cardSubDetail]}>{this.sourceLang.name}: {session.blabee.firstName}&nbsp;{session.blabee.lastName}</Text>
                        <Text style={[styles.cardSubDetail]}>{this.sourceLang.type}: {this.sessionTypeReturn(session.type)}</Text>
                        <Text style={[styles.cardSubDetail]}>{this.sourceLang.date}: {moment(session.startTime).format('YYYY/MM/DD HH:mm')}</Text>
                      </View>
                    </View>
                  )
              }
              <View style={{ justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>
                <Text style={styles.cardHeader}>{session.status}</Text>
              </View>
            </View>
          );
        }

      });
    }
  }

  onRefresh=async()=> {
    this.setState({
      refreshing: true
    });
    var response = await SessionService.getAllSessions()
    this.setState({
      allSessions: response.sessions,
      refreshing: false
    });
  }

  render() {
    if (this.state.loader) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={Platform.OS === "ios" ? 1 : 30} style={{ alignSelf: 'center' }} />
        </View>
      )
    }
    else {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

          <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={styles.header}>
              <Entypo name="chevron-left" onPress={() => this.props.navigation.goBack()} size={28} color="black" style={{ alignSelf: 'center' }} />
              <Text style={styles.headerTitle}>{this.sourceLang.mySessionTitle}</Text>
              <View style={{ width: width / 10 }}></View>
            </View>
            <ScrollView 
              refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={()=> this.onRefresh()}
                    title="Loading..."
                    />
                }
              contentContainerStyle={{ width, marginBottom: 10, alignItems: 'center', justifyContent: 'flex-start', marginTop: 20 }} showsVerticalScrollIndicator={false}>
              {this.renderAllStoredPayment(this.state.allSessions)}
            </ScrollView>
            <View style={{ width, height: 10 }}>

            </View>

          </SafeAreaView>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  cardHeader: {
    fontSize: width / (width / 12) + 2,
    alignSelf: 'flex-start',
    color: "#0c2461",
    ...Platform.select({
      ios: {
        fontFamily: "Montserrat",
        fontWeight: '700',
      },
      android: {
        fontFamily: "Montserrat-SemiBold",
      }
    })
  },
  label: {
    color: "black",
    fontSize: width / (width / 12) + 4,
  },
  input: {
    fontSize: width / (width / 12) + 4,
    color: "black",
  },
  cardSubDetail: {
    fontSize: width / (width / 12) + 2,
    color: "#7f8fa6",
    alignSelf: 'flex-start',
    ...Platform.select({
      ios: {
        fontFamily: "Montserrat",
      },
      android: {
        fontFamily: "Montserrat-Regular",
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
  addLabel: {
    fontSize: width / (width / 12) + 4,
    color: 'black',
    ...Platform.select({
      ios: {
        fontFamily: "Montserrat",
        fontWeight: '600',
      },
      android: {
        fontFamily: "Montserrat-SemiBold",
      }
    })
  }
})

export default AllSessions;
