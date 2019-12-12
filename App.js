import React, { Component } from 'react';
import AppContainer from './src/config/Routes';
import { Platform, Modal, Text, TouchableWithoutFeedback, TouchableOpacity, View, Dimensions } from 'react-native';
import NavigationService from './src/services/NavigationService';
import firebase from 'react-native-firebase';
import * as Session from './src/services/Session';
import ShowToast from './src/services/DisplayToast';
import AsyncStorage from '@react-native-community/async-storage';
import Mixpanel from './src/services/Mixpanel';
const EN = require('./src/i8L/en.json');
const ZH = require('./src/i8L/zh.json');

console.disableYellowBox = true;

var sessionId, data;
const { width, height } = Dimensions.get('window');
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSessionRequestModal: false,
      role: ''
    };
  }

  async componentDidMount() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.unsubscribeFromNotificationListener = firebase.
      notifications().
      onNotification((notification) => {
        if (Platform.OS === 'android') {
          const localNotification = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
          })
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setSubtitle(notification.subtitle)
            .setBody(notification.body)
            .setData(notification.data)
            .android.setChannelId('1')
            .android.setColor('#000000')
            .android.setPriority(firebase.notifications.Android.Priority.High);

          firebase.notifications().displayNotification(localNotification)
            .catch(err => console.error(err));

        } else if (Platform.OS === 'ios') {

          const localNotification = new firebase.notifications.Notification()
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setSubtitle(notification.subtitle)
            .setBody(notification.body)
            .setData(notification.data)
            .ios.setBadge(notification.ios.badge);

          firebase.notifications()
            .displayNotification(localNotification)
            .catch(e => console.error(e));
        }
      });

    this.notificationListener = await firebase.
      notifications().
      onNotification((notification) => {
        sessionId = JSON.parse(notification.data.param).sessionId
        data = JSON.parse(notification.data.param)
        if(data) {
          console.log(data)
          this.startVideoCall(sessionId, 1);
        }
        console.log('notificationListener ' + notification.data);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = await firebase.
      notifications().
      onNotificationOpened((notificationOpen) => {
        const action = notificationOpen.action;
        const notification = notificationOpen.notification;
        console.log("data", JSON.parse(notification.data.param))
        sessionId = JSON.parse(notification.data.param).sessionId
        data = JSON.parse(notification.data.param)
        if(data) {
          console.log(data)
          this.startVideoCall(sessionId);
        }
        console.log('notificationOpenedListener ' + notification.data);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    firebase.notifications().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          const action = notificationOpen.action;
          const notification = notificationOpen.notification;
          console.log('getInitialNotification ' + notification);
        }
      });

    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
    });

    try {
      const type = await AsyncStorage.getItem('@user_Type')
      this.setState({
        role: type
      });
    }
    catch(error) {

    }
    
  }

  async accept() {
    try {
      var response = await Session.acceptSession(sessionId)
      console.log(response)
      this.setState({
        showSessionRequestModal: false
      });
      Mixpanel.trackEvent('AcceptSession');
      NavigationService.navigate('WaitingScreen', { data, sessionId });

    }
    catch (error) {
      ShowToast(error.message || "Error accepting session")
    }

  }

  reject() {
    this.setState({
      showSessionRequestModal: false
    })
  }

  async startVideoCall() {
    if (arguments.length > 1) {
      this.setState({
        showSessionRequestModal: true
      })
    }

    else {
      Mixpanel.trackEvent('AcceptSession');
      NavigationService.navigate('WaitingScreen', { data, sessionId });
      try {
        await Session.acceptSession(sessionId);
      }
      catch (error) {
        ShowToast(error.message || "Something went wrong");
      }
    }
  }

  componentWillUnmount() {
    this.unsubscribeFromNotificationListener();
    this.notificationListener();
    this.notificationOpenedListener();
  }

  render() {
    return (
      <>
        <AppContainer ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }} />
        {
          this.state.role === "blabber" ? (
            <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => this.reject()}
          visible={this.state.showSessionRequestModal}
        >
          <TouchableOpacity
            onPress={() => this.reject()}
            activeOpacity={1}
          >
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' }}>
              <View style={{ borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, width: '100%', height, backgroundColor: "#2f364020" }}>
                <TouchableWithoutFeedback>
                  <View style={{ borderRadius: width / 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2, width: '90%', height: (height / 2) - 100, backgroundColor: "#ecf0f1" }}>
                    <Text style={{ color: '#27345C', marginTop: (width / 10) - 10, fontWeight: '600', fontFamily: "Montserrat", fontSize: 18, alignSelf: 'center' }}>
                      You have a session request</Text>
                    <Text style={{ color: '#95a5a6', fontSize: 15, textAlign: 'center', fontWeight: '100', fontFamily: "Montserrat", }}>
                      Would you like to join</Text>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', height: 60, borderTopWidth: 0.5, borderColor: '#95a5a6' }}>
                      <TouchableOpacity onPress={() => this.accept()}
                        style={{ width: '50%', padding: 4, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5, height: 60, borderColor: '#95a5a6' }}>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.reject()}
                        style={{ width: '50%', padding: 4, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>No</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
          ) : null
        }
      </>
    );
  }
}

export default App;
