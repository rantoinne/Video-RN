import React, { Component, PureComponent } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions, Modal, NativeModules, PermissionsAndroid, Keyboard, TouchableWithoutFeedback, BackHandler, TextInput, ActivityIndicator, ScrollView
} from 'react-native';
import { RtcEngine, AgoraView } from 'react-native-agora';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CountDown from 'react-native-countdown-component';
import AsyncStorage from '@react-native-community/async-storage'
import * as Session from '../services/Session';
import { Surface } from 'react-native-paper';
import ShowToast from '../services/DisplayToast';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const screen = Dimensions.get('window');
const { Agora } = NativeModules;

if (!Agora) {
  throw new Error("Agora load failed in react-native, please check ur compiler environments");
}

const {
  FPS30,
  FixedLandscape,
  AudioProfileDefault,
  AudioScenarioDefault,
  Host,
  Adaptative
} = Agora;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    justifyContent: 'flex-start',
  },
  userTypeChat: {
    width: (width / 100) * 22,
    textAlign: 'left',
    padding: 4,
    color: 'black',
    ...Platform.select({
      ios: {
        fontWeight: 'bold',
        fontFamily: 'Montserrat'
      },
      android: {
        fontFamily: 'Montserrat-Bold'
      }
    })
  },
  bottomChatView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 2,
    width,
    height: 50,
    borderBottomWidth: 0.5
  },
  videoView: {
    position: 'absolute',
    top: 200,
    padding: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    zIndex: 1000,
  },
  localView: {
    width,
    height: (height / 100) * 55
  },
  remoteView: {
    position: 'absolute',
    top: height / 7,
    zIndex: 1000,
    width: (screen.width / 100) * 30,
    height: (screen.width / 100) * 30,
  },
});

type Props = {
  channelProfile: Number,
  channelName: String,
  videoProfile: Number,
  clientRole: Number,
  onCancel: Function,
  uid: Number
};

async function requestCameraAndAudioPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
    }
  } catch (err) {
  }
}

class AgoraRTCView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      peerIds: [],
      chats: [
        {
          userType: 'blabber',
          content: 'My name is John Doe'
        },
        {
          userType: 'blabber',
          content: 'How are you'
        },
        {
          userType: 'blabee',
          content: 'Hi John, I am Jane'
        },
        {
          userType: 'blabee',
          content: 'I am good'
        },
        {
          userType: 'blabee',
          content: 'I was having a few doubts on Mechanics of automobile'
        },
        {
          userType: 'blabber',
          content: 'You are at right place to clear them all'
        },
        {
          userType: 'blabee',
          content: 'Oh! I am indeed'
        }
      ],
      joinSucceed: false,
      isMute: false,
      hideButton: false,
      visible: false,
      selectedUid: undefined,
      animating: true,
      running: true,
      showModal: false,
      showCountdown: false,
      addOnTime: 0,
      showNestedModal: false,
      userActive: false
    };

  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(_ => {

      });
    }

    const config = {
      appid: '7ce648a93aca433ab2d43adec731d852',
      channelProfile: this.props.channelProfile,
      videoProfile: this.props.videoProfile,
      clientRole: this.props.clientRole,
      videoEncoderConfig: {
        width: 360,
        height: 480,
        bitrate: 1,
        frameRate: FPS30,
        orientationMode: Adaptative,
      },
      audioProfile: AudioProfileDefault,
      audioScenario: AudioScenarioDefault
    }
    RtcEngine.on('videoSizeChanged', (data) => {
    })
    RtcEngine.on('firstRemoteVideoDecoded', (data) => {
    });
    RtcEngine.on('userJoined', (data) => {
      const { peerIds } = this.state;
      if (peerIds.indexOf(data.uid) === -1) {
        this.setState({
          peerIds: [...peerIds, data.uid],
          userActive: true
        })
      }
    });

    RtcEngine.on('userOffline', (data) => {
      this.setState({
        peerIds: this.state.peerIds.filter(uid => uid !== data.uid),
        userActive: false
      })
    });
    RtcEngine.on('joinChannelSuccess', (data) => {
      RtcEngine.startPreview();
      this.setState({
        joinSucceed: true,
        animating: false
      })
    });
    RtcEngine.on('audioVolumeIndication', (data) => {
    })
    RtcEngine.on('clientRoleChanged', (data) => {
    })
    RtcEngine.on('error', (data) => {
      if (data.error === 17) {
        RtcEngine.leaveChannel().then(_ => {
          this.setState({
            joinSucceed: false
          })
        });
      }
    });
    RtcEngine.init(config);
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
    });

    try {
      var value = await AsyncStorage.getItem('@user_Type')
      if (value === 'blabber') {
        this.setState({
          showCountdown: true
        });
      }
    }
    catch (e) {

    }

    RtcEngine.getSdkVersion((version) => {
    })
    RtcEngine.joinChannel(this.props.channelName, this.props.uid);
    RtcEngine.enableAudioVolumeIndication(500, 3);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
    });
    if (this.state.joinSucceed) {
      RtcEngine.leaveChannel().then(res => {
        RtcEngine.removeAllListeners();
        RtcEngine.destroy();
      }).catch(err => {
        RtcEngine.removeAllListeners();
        RtcEngine.destroy();
      })
    } else {
      RtcEngine.removeAllListeners();
      RtcEngine.destroy();
    }
  }

  async endOngoingCall() {
    this.setState({
      showModal: false
    });
    RtcEngine.leaveChannel().then(_ => {

      this.props.navigation.goBack();

    });
    var response = await Session.end(this.props.channelName)
  }


  agoraPeerViews = () => {
    return (!this.state.userActive ?
      <View style={styles.videoView} /> :
      <AgoraView style={styles.remoteView} showLocalVideo={true} />
    )
  }

  async cancelOngoingSession() {
    const type = await AsyncStorage.getItem('@user_Type');
    if (type === "blabee") {
      this.props.navigation.goBack();
      var response = await Session.cancel(this.props.channelName)
      // alert(JSON.stringify(response))
    }
    else {
      this.props.navigation.goBack();
    }
  }

  selectedView = ({ visible }) => {
    return (
      <Modal
        visible={visible}
        presentationStyle={'fullScreen'}
        animationType={'slide'}
        onRequestClose={() => { }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => this.setState({
            visible: false
          })} >
          <AgoraView
            style={{ flex: 1 }}
            zOrderMediaOverlay={true}
            remoteUid={this.state.selectedUid}
          />
        </TouchableOpacity>
      </Modal>)
  }

  timeRunningOut() {
    this.setState({
      showModal: true,
      running: false
    });
  }

  addTime() {
    if (arguments[0] === 1) {
      this.setState({
        showNestedModal: true,
        running: false,
        showModal: false
      });
    }
    else if (arguments[0] === 0) {
      this.setState({
        showModal: false,
        running: true
      });
    }

    else if (arguments[0] === 2) {
      this.setState({
        showModal: false,
        running: true,
        showNestedModal: false
      });
    }

    else {

    }
  }

  payVia() {
    this.setState({
      addOnTime: 1800,
      showNestedModal: false,
      running: true
    });
  }
  startVideo() {
    this.setState({
      showCountdown: false
    });
  }

  renderAllChatHistory() {
    return this.state.chats.map((chat, idx) => {
      return (
        <View style={{ width, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'white', marginBottom: 4, paddingHorizontal: 5, paddingVertical: 8 }}>
          <Text style={[styles.userTypeChat, {}]}>{chat.userType.charAt(0).toUpperCase() + chat.userType.slice(1)} :</Text>
          <Text style={[styles.userTypeChat, { color: '#7f8c8d', textAlign: 'left', width: (width / 100) * 70 }]}>{chat.content}</Text>
        </View>)
    })
  }

  render() {
    if (!this.state.joinSucceed) {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Video Call waiting</Text>
          <ActivityIndicator animating={this.state.animating} />
        </View>
      )
    }

    else {
      return (
        <View
          style={styles.container}
        >
          <View style={{ paddingHorizontal: 18, paddingVertical: 8, height: (height / 7), flexDirection: 'row', backgroundColor: 'white', width, justifyContent: 'flex-end', alignItems: 'center' }}>

            <View style={{ flexDirection: 'row', padding: 4, justifyContent: 'space-between', alignItems: 'center' }}>
              {
                this.state.userActive ?
                  <CountDown
                    until={60 * 30 + this.state.addOnTime}
                    size={22}
                    separatorStyle={{ color: 'black' }}
                    onFinish={() => this.timeRunningOut()}
                    onPress={() => this.setState({ showModal: true })}
                    running={this.state.running}
                    showSeparator
                    digitStyle={{ backgroundColor: '#fff' }}
                    digitTxtStyle={{ color: 'black' }}
                    timeToShow={['M', 'S']}
                    timeLabels={{ m: '', s: '' }}
                  /> : null
              }
              <AntDesign name="clockcircleo" size={18} color="#b2bec3" style={{ alignSelf: 'center', marginLeft: 4 }} />
            </View>
          </View>

          {
            this.state.userActive ? (
              <Surface
                activeOpacity={1}>
                <AgoraView
                  key={this.state.peerIds[0]}
                  style={styles.localView}
                  zOrderMediaOverlay={true}
                  remoteUid={this.state.peerIds[0]}
                />
                <AgoraView style={styles.remoteView} showLocalVideo={true} />
              </Surface>
            ) :
              (<AgoraView style={styles.localView} showLocalVideo={true} />)
          }

          <Modal
            animationType="slide"
            onBackButtonPress={() => this.addTime(2)}
            transparent={true}
            onRequestClose={() => this.setState({ showModal: false })}
            visible={this.state.showModal}
          >
            <TouchableOpacity
              activeOpacity={1}
            >
              <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' }}>
                <View style={{ borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, width: '100%', height, backgroundColor: "#2f364020" }}>
                  <TouchableWithoutFeedback>
                    <View style={{ borderRadius: width / 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2, width: '90%', height: (height / 2) - 150, backgroundColor: "#ecf0f1" }}>

                      <Text style={{ color: '#27345C', marginTop: (width / 10) - 10, fontWeight: '600', fontFamily: "Montserrat", fontSize: 18, alignSelf: 'center' }}>
                        Do you want to end call?
                        </Text>

                      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', height: 60, borderTopWidth: 0.5, borderColor: '#95a5a6' }}>
                        <TouchableOpacity
                          onPress={() => this.endOngoingCall()}
                          style={{ width: '50%', padding: 4, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5, height: 60, borderColor: '#95a5a6' }}>
                          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                            Yes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.setState({ showModal: false })}
                          style={{ width: '50%', padding: 4, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                            No
                            </Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Modal Nested two */}

          <Modal
            animationType="slide"
            onBackButtonPress={() => this.addTime(2)}
            transparent={true}
            onRequestClose={() => this.setState({ showNestedModal: false })}
            visible={this.state.showNestedModal}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressOut={() => this.addTime(2)}
            >
              <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' }}>
                <View style={{ borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, width: '100%', height, backgroundColor: "#2f364020" }}>
                  <TouchableWithoutFeedback>
                    <View style={{ borderRadius: width / 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2, width: '90%', backgroundColor: "#ecf0f1" }}>

                      <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20, marginBottom: 20 }}>I want to pay via:</Text>

                      <TouchableOpacity
                        onPress={() => this.payVia(0)}
                        style={{ width: '100%', padding: 4, justifyContent: 'center', alignItems: 'center', borderTopWidth: 0.5, height: 70 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                          Credit Card
                            </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => this.payVia(1)}
                        style={{ width: '100%', padding: 4, justifyContent: 'center', alignItems: 'center', borderTopWidth: 0.5, height: 70 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                          Ali Pay
                            </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => this.payVia(2)}
                        style={{ width: '100%', padding: 4, justifyContent: 'center', alignItems: 'center', borderTopWidth: 0.5, height: 70 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                          WeChat Pay
                            </Text>
                      </TouchableOpacity>

                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

          {this.selectedView(this.state)}

          {/* {this.toolBar()} */}

          {
            this.state.userActive ? null :
              (<TouchableOpacity style={{ position: 'absolute', top: screen.height / 18, left: 8 }} onPress={() => this.cancelOngoingSession()}>
                <Entypo name="chevron-left" size={28} color="black" style={{ alignSelf: 'center' }} />
              </TouchableOpacity>)
          }

          {
            !this.state.userActive ? null : (
              <AgoraView style={styles.remoteView} showLocalVideo={true} />
            )
          }
            <DismissKeyboardView>
          <View style={{ width, height: (height / 100) * 30, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'white', zIndex: 1000, position: 'absolute', bottom: 0 }}>
            <ScrollView showsVerticalScrollIndicator= {false} contentContainerStyle={{ width, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f2f6' }}>
              {
                this.renderAllChatHistory()
              }
            </ScrollView>

            <View style= {{ width, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'white', borderTopWidth: 3, borderColor: '#f1f2f6'}}>
              <TextInput
                style={{width: width - 80, fontFamily: 'Montserrat-Regular', backgroundColor: 'white'}}
                placeholderTextColor= "#bdc3c7"
                underlineColorAndroid= 'transparent'
                placeholder= "Type your message"
              />
              <FontAwesome name="send" size={30} color= "#00E3AE" style= {{position: 'absolute', right: 10}} />
            </View>
          </View>
            </DismissKeyboardView>

        </View>
      )
    }
  }
}

export default function AgoraRTCViewContainer(props) {
  const { navigation } = props;
  const channelProfile = navigation.getParam('channelProfile', 1);
  const clientRole = navigation.getParam('clientRole', Host);
  const channelName = navigation.getParam('channelName', 'Cakesoft');
  const uid = navigation.getParam('uid', Math.floor(Math.random() * 100));
  const onCancel = navigation.getParam('onCancel');

  return (<AgoraRTCView
    channelProfile={channelProfile}
    channelName={channelName}
    clientRole={clientRole}
    uid={uid}
    onCancel={onCancel}
    {...props}
  ></AgoraRTCView>);
}