import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity, ScrollView, Platform, BackHandler } from 'react-native';
import ShowToast from '../services/DisplayToast';
import HamburgerIcon from '../components/HamburgerIcon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Colors from '../assets/styles/Colors';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const sectionHeight = height - 200
import * as UserService from '../services/User';
import realm from '../realm';
import ButtonBottom from '../components/ButtonBottom';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

class HomeforBlabber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      currentSessionType: "casual",
      value: true,
      c: true,
      t: false,
      i: false,
      onlineCasual: true,
      onlineTutor: true,
      userLang: '',
      appState: '',
      availability: false,
      optionRadioTypes: [
        { label: 'casual', value: false },
        { label: 'tutoring', value: false }
      ],
      ongoingSession: false,
      sessionToken: '',
      availableSessions: []
    };
    this.user = realm.objects('User')[0];
    this.realmListner = () => this.forceUpdate();
    realm.addListener('change', this.realmListner);
  }

  toggleUserRole(value) {
    if (value.label === "casual") {
      let clone = Object.assign(this.state.optionRadioTypes)
      clone.value = !clone.value;
      this.setState({
        optionRadioTypes: clone
      });
    }
    else {
      let clone = Object.assign(this.state.optionRadioTypes)
      clone.value = !clone.value;
      this.setState({
        optionRadioTypes: clone
      });
    }
  }

  changeContent() {
    this.setState({
      currentSessionType: arguments[0]
    });
  }

  async componentDidMount() {
    this.setState({
      userLang: this.user.defaultLanguage == "ZH" ? ZH : EN
    });

    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    var defaultSource = await UserService.userMe();
    console.log(defaultSource);
    this.setState({
      onlineCasual: defaultSource.user.isOnlineCT,
      onlineTutor: defaultSource.user.isOnlineET
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => {
      return true;
    });
    realm.removeListener('change', this.realmListner);
  }

  toggleStatus = async (type) => {
    if (type === "casualTalk") {
      try {
        var res = await UserService.changeStatus(type, !this.state.onlineCasual)
        console.log(res);
        ShowToast(this.state.userLang.statusChangedToast);
        this.setState({
          onlineCasual: !this.state.onlineCasual
        });
      }
      catch (error) {
        ShowToast(error.message || this.state.userLang.statusChangeErrorToast);
      }
    }

    else {
      try {
        var res = await UserService.changeStatus(type, !this.state.onlineTutor)
        console.log(res);
        ShowToast(this.state.userLang.statusChangedToast);
        this.setState({
          onlineTutor: !this.state.onlineTutor
        });
      }
      catch (error) {
        ShowToast(error.message || this.state.userLang.statusChangeErrorToast);
      }
    }
  }

  ctiButton() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
        {
          this.state.currentSessionType === "casual" ?
            (<View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
              <Image style={styles.imageStyle} source={require('../assets/images/c.png')} />
            </View>) : (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.changeContent("casual")}>
                  <Image style={styles.imageStyleInactive} source={require('../assets/images/c_grey.png')} />
                </TouchableOpacity>
              </View>
            )
        }

        {
          this.state.currentSessionType === "tutoring" ?
            (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.imageStyle} source={require('../assets/images/t.png')} />
              </View>
            ) : (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.changeContent("tutoring")}>
                  <Image style={styles.imageStyleInactive} source={require('../assets/images/t_grey.png')} />
                </TouchableOpacity>
              </View>
            )
        }

        {
          this.state.currentSessionType === "intern" ?
            (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={styles.imageStyle} source={require('../assets/images/i.png')} />
              </View>
            ) : (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.changeContent("intern")}>
                  <Image style={styles.imageStyleInactive} source={require('../assets/images/i_grey.png')} />
                </TouchableOpacity>
              </View>
            )
        }
      </View>
    )
  }

  comingSoonEvent() {
    this.props.navigation.navigate('VideoCall', { channelName: 'MyDevelopmentChannel' })
  }

  ctiTitles() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
        {
          this.state.currentSessionType === "casual" ? (
            <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.topicActive}>{this.state.userLang.casualTextObjectTitle1}</Text>
              <Text style={styles.topicActive}>{this.state.userLang.casualTextObjectTitle2}</Text>
              <Text style={styles.rateActive}>{this.state.userLang.casualTextObjectRate}</Text>
            </View>
          ) : (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.changeContent("casual")} style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.topicInactive}>{this.state.userLang.casualTextObjectTitle1}</Text>
                  <Text style={styles.topicInactive}>{this.state.userLang.casualTextObjectTitle2}</Text>
                  <Text style={styles.rateInactive}>{this.state.userLang.casualTextObjectRate}</Text>
                </TouchableOpacity>
              </View>
            )
        }

        {
          this.state.currentSessionType === "tutoring" ? (
            <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.topicActive}>{this.state.userLang.tutoringTextObjectTitle1}</Text>
              <Text style={styles.topicActive}>{this.state.userLang.tutoringTextObjectTitle2}</Text>
              <Text style={[styles.rateActive]}>{this.state.userLang.tutoringTextObjectRate}</Text>
            </View>
          ) : (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.changeContent("tutoring")} style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.topicInactive}>{this.state.userLang.tutoringTextObjectTitle1}</Text>
                  <Text style={styles.topicInactive}>{this.state.userLang.tutoringTextObjectTitle2}</Text>
                  <Text style={[styles.rateInactive]}>{this.state.userLang.tutoringTextObjectRate}</Text>
                </TouchableOpacity>
              </View>
            )
        }

        {
          this.state.currentSessionType === "intern" ? (
            <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.topicActive}>{this.state.userLang.internTextObjectTitle1}</Text>
            </View>
          ) : (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.changeContent("intern")} style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.topicInactive}>{this.state.userLang.internTextObjectTitle1}</Text>
                </TouchableOpacity>
              </View>
            )
        }
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ position: 'absolute', zIndex: 1000, top: height / 16, left: 6 }}>
          <HamburgerIcon navigationProps={this.props.navigation} />
        </View>

        <View style={{ width: '100%', height: (height / 100) * 55, backgroundColor: '#FFC303', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
          {
            this.state.currentSessionType == "casual" ?
              (
                <TouchableOpacity
                  onPress={() => this.toggleStatus("casualTalk")}
                  style={{ width: '100%', height: '100%' }}>
                  <Image
                    source={require('../assets/images/casual+talk_blabber.png')} resizeMode="stretch" style={{ height: '100%', width: '100%' }} />
                </TouchableOpacity>
              ) : this.state.currentSessionType === "tutoring" ? (
                <TouchableOpacity
                  onPress={() => this.toggleStatus("tutoring")}
                  style={{ width: '100%', height: '100%' }}>
                  <Image source={require('../assets/images/English+tutoring_blabber.png')} resizeMode="stretch" style={{ height: '100%', width: '100%' }} />
                </TouchableOpacity>
              ) :
                (<Image source={require('../assets/images/Onboarding+studies_blabber.png')} resizeMode="stretch" style={{ height: '100%', width: '100%' }} />)
          }


          {
            this.state.currentSessionType === "casual" && this.state.onlineCasual ? (
              <TouchableOpacity onPress={() => this.toggleStatus("casualTalk")}
                style={{ position: 'absolute', right: (width / 10) - 28, bottom: 10, zIndex: 1000 }}>
                <FontAwesome
                  name="check" color="#8AC22F" size={(width / 2) - 40}></FontAwesome>
              </TouchableOpacity>
            ) :
              this.state.currentSessionType === "casual" ?
                (
                  <TouchableOpacity onPress={() => this.toggleStatus("casualTalk")}
                    style={{ position: 'absolute', right: (width / 10) - 28, bottom: 10, zIndex: 1000 }}>
                    <FontAwesome name="check" color="#F1B939" size={(width / 2) - 40} />
                  </TouchableOpacity>
                ) : null
          }


          {
            this.state.currentSessionType === "tutoring" && this.state.onlineTutor ? (
              <TouchableOpacity onPress={() => this.toggleStatus("tutoring")}
                style={{ position: 'absolute', right: (width / 10) - 28, bottom: 10, zIndex: 1000 }}>
                <FontAwesome
                  name="check" color="#8AC22F" size={(width / 2) - 40}></FontAwesome>
              </TouchableOpacity>
            ) :
              this.state.currentSessionType === "tutoring" ?
                (
                  <TouchableOpacity onPress={() => this.toggleStatus("tutoring")}
                    style={{ position: 'absolute', right: (width / 10) - 28, bottom: 10, zIndex: 1000 }}>
                    <FontAwesome name="check" color="#00000010" size={(width / 2) - 40} />
                  </TouchableOpacity>
                ) : null
          }

        </View>

        <ScrollView contentContainerStyle={{ width: '100%' }} showsVerticalScrollIndicator={false}>
          <View style={{
            flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%',
            backgroundColor: 'white', paddingVertical: height / 18
          }}>

            {
              this.ctiButton()
            }

            {
              this.ctiTitles()
            }

            {
              this.state.currentSessionType === "intern" ? (
                <ButtonBottom
                  title= {this.state.userLang.comingSoonButtonTitle}
                  onPress={this.comingSoonEvent.bind(this)}
                />
              ) :
                null
            }

            {
              this.state.currentSessionType !== "intern" ? (
                <View style={{ width, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 15 }}>
                  {
                    this.state.currentSessionType === "tutoring" ?

                      (<TouchableOpacity onPress={() => this.props.navigation.navigate('RequestApplicationStep1')}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: (width / 2) - 50, padding: 8, paddingVertical: 10, marginTop: 30, borderRadius: 20, backgroundColor: 'purple' }}>
                          <Text style={[styles.topicActive, { color: 'white' }]}>{this.state.userLang.applyNowButton}</Text>
                        </View>
                      </TouchableOpacity>)
                      : null
                  }

                </View>
              ) : null
            }

          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  homeText: {
    padding: 25,
    textAlign: "center",
    color: Colors.white,
    fontSize: 18
  },
  imageStyle: {
    width: (width / 100) * 24,
    height: (width / 100) * 24
  },
  homeTextContainer: {
    marginTop: sectionHeight - 150,
    position: "absolute",
    width: width,
    justifyContent: 'center',
  },
  imageStyleInactive: {
    width: (width / 100) * 24,
    height: (width / 100) * 24,
    opacity: 0.5
  },
  textNext: {
    color: Colors.white,
    fontSize: 18,
    // fontWeight: 'bold',
    fontWeight: 'bold',
    textAlign: "center",
  },
  nextButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.purple,
    height: 50,
    width: (width / 100) * 85,
    marginTop: 28,
    borderRadius: 30,
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
  },
  topicInactive: {
    fontSize: width / (width / 12) + 2,
    color: '#aaa69d',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: "600",
        fontFamily: "Montserrat",
      },
      android: {
        fontFamily: "Montserrat-Regular",
      }
    })
  },
  rateInactive: {
    fontSize: width / (width / 12) + 2,
    color: '#aaa69d',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: "200",
        fontFamily: "Montserrat",
      },
      android: {
        fontFamily: "Montserrat-Light",
      }
    })
  },
  topicActive: {
    fontSize: width / (width / 12) + 2,
    textAlign: 'center',
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
  rateActive: {
    fontSize: width / (width / 12) + 2,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: "Montserrat-Medium",
      },
      android: {
        fontFamily: "Montserrat-Medium",
      }
    })
  }
})

export default HomeforBlabber;