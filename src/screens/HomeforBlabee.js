import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions, BackHandler, TouchableOpacity, Image, ListView, Platform } from 'react-native';
import HamburgerIcon from '../components/HamburgerIcon';
import Colors from '../assets/styles/Colors';
import * as Session from '../services/Session';
import ModalDropdown from 'react-native-modal-dropdown';
import * as UserService from '../services/User';
import ButtonBottom from '../components/ButtonBottom';
import ShowToast from '../services/DisplayToast';
import Mixpanel from '../services/Mixpanel';
import realm from '../realm';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const sectionHeight = height - 200

class HomeforBlabee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      currentSessionType: "casual",
      paymentSources: [],
      paymentSourcesForPayment: [],
      selectedPaymentMode: "",
    };
    this.user = realm.objects('User')[0];
    this.sourceLang = this.user.defaultLanguage == "ZH" ? ZH : EN;
  }

  comingSoon() {
    this.props.navigation.navigate('VideoCall');
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => {
      return true;
    });
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    try {
      var response = await UserService.getPaymentSources();
      var defaultSource = await UserService.userMe();
        this.setState({
          selectedPaymentMode: defaultSource.user.defaultSourceId
        });
      var cards = []
      response.paymentSources.forEach(card => {
        let c = `${card.card.brand} ${card.card.last4}`
        cards.push(c);
      });
      this.setState({
        paymentSources: cards,
        paymentSourcesForPayment: response.paymentSources,
      });
      console.log(this.state.paymentSourcesForPayment)
    }
    catch (error) {
      ShowToast(error.message || "Error fetching profile");
    }
  }

  changeContent() {
    this.setState({
      currentSessionType: arguments[0]
    });
  }

  paymentMethodSelected(idx, value) {
    // alert(idx)
    var card = Object.assign(this.state.paymentSourcesForPayment);
    card = card[idx];

    this.setState({
      selectedPaymentMode: card.id
    });
  }

  createSession = async () => {
    if (this.state.currentSessionType === "casual") {

      try {
        var request = {};
        request["type"] = "casualTalk";
        request['stripeSourceId'] = this.state.selectedPaymentMode;
        var response = await Session.postSession(request)
        Mixpanel.trackEvent('RequestSession');
        this.props.navigation.navigate('VideoCall', { channelName: response.sessionId })
        // this.props.navigation.navigate('VideoCall', { channelName: "MyDevelopmentChannel" });
      }
      catch (error) {
        ShowToast(error.message || "Error creating session");
      }
    }
    else if (this.state.currentSessionType === "tutoring") {
      var request = {};
      request["type"] = "tutoring";
      request['stripeSourceId'] = this.state.selectedPaymentMode;

      var response = await Session.postSession(request)
      this.props.navigation.navigate('VideoCall', { channelName: response.sessionId })

    }

    else {

    }
    // this.props.navigation.navigate('VideoCall')
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

  ctiTitles() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
        {
          this.state.currentSessionType === "casual" ? (
            <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.topicActive}>{this.sourceLang.casualTextObjectTitle1}</Text>
              <Text style={styles.topicActive}>{this.sourceLang.casualTextObjectTitle2}</Text>
              <Text style={styles.rateActive}>{this.sourceLang.casualTextObjectRate}</Text>
            </View>
          ) : (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.changeContent("casual")} style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.topicInactive}>{this.sourceLang.casualTextObjectTitle1}</Text>
                  <Text style={styles.topicInactive}>{this.sourceLang.casualTextObjectTitle2}</Text>
                  <Text style={styles.rateInactive}>{this.sourceLang.casualTextObjectRate}</Text>
                </TouchableOpacity>
              </View>
            )
        }

        {
          this.state.currentSessionType === "tutoring" ? (
            <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.topicActive}>{this.sourceLang.tutoringTextObjectTitle1}</Text>
              <Text style={styles.topicActive}>{this.sourceLang.tutoringTextObjectTitle2}</Text>
              <Text style={[styles.rateActive]}>{this.sourceLang.tutoringTextObjectRate}</Text>
            </View>
          ) : (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.changeContent("tutoring")} style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.topicInactive}>{this.sourceLang.tutoringTextObjectTitle1}</Text>
                  <Text style={styles.topicInactive}>{this.sourceLang.tutoringTextObjectTitle2}</Text>
                  <Text style={[styles.rateInactive]}>{this.sourceLang.tutoringTextObjectRate}</Text>
                </TouchableOpacity>
              </View>
            )
        }

        {
          this.state.currentSessionType === "intern" ? (
            <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.topicActive}>{this.sourceLang.internTextObjectTitle1}</Text>
            </View>
          ) : (
              <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.changeContent("intern")} style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.topicInactive}>{this.sourceLang.internTextObjectTitle1}</Text>
                </TouchableOpacity>
              </View>
            )
        }
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <View style={{ position: 'absolute', zIndex: 1000, top: height / 16, left: 6 }}>
          <HamburgerIcon navigationProps={this.props.navigation} />
        </View>

        <View style={{ width: '100%', height: (height / 100) * 55, backgroundColor: '#FFF', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
          {
            this.state.currentSessionType == "casual" ?
              (
                <Image source={require('../assets/images/casual+talk.png')} resizeMode="stretch" style={{ height: '100%', width: '100%' }} />
              ) : this.state.currentSessionType === "tutoring" ? (
                <Image source={require('../assets/images/English+tutoring.png')} resizeMode="stretch" style={{ height: '100%', width: '100%' }} />
              ) :
                (<Image source={require('../assets/images/Onboarding+studies.png')} resizeMode="stretch" style={{ height: '100%', width: '100%' }} />)
          }
        </View>

        <ScrollView contentContainerStyle={{ width: '100%' }} showsVerticalScrollIndicator={false}>
          <View style={{
            flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%',
            backgroundColor: 'white', paddingVertical: 12
          }}>

            {
              this.ctiButton()
            }

            {
              this.ctiTitles()
            }



            {
              this.state.currentSessionType === "intern" ? null : (
                <View style={{ width: '85%', height: height / 17, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, borderRadius: 50, borderWidth: 0.5, borderColor: "#d1ccc0", }}>
                  <Image source={require('../assets/images/visa.png')} style={{ width: 24, height: 24, marginRight: 20 }} resizeMode="contain" />

                  <ModalDropdown options={this.state.paymentSources}
                    style={{ width: '100%', height: null, borderWidth: 0 }}
                    dropdownStyle={{ width: '65%', height: height / 10, borderWidth: 0 }}
                    defaultValue={this.state.paymentSources[0]}
                    textStyle={styles.modalTextStyle}
                    showsVerticalScrollIndicator={false}
                    onSelect={(idx, value) => this.paymentMethodSelected(idx, value)}
                    dropdownTextStyle={styles.modalTextStyle}
                  />

                </View>
              )
            }

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>


              {
                this.state.currentSessionType === "intern" ? (
                  <ButtonBottom
                    onPress={this.comingSoon.bind(this)}
                    title= {this.sourceLang.comingSoonButtonTitle}
                  />
                ) : (
                    <ButtonBottom
                      onPress={this.createSession.bind(this)}
                      title= {this.sourceLang.letsBlabButton}
                    />
                  )
              }
            </View>

          </View>
        </ScrollView>
        {/* </SafeAreaView> */}
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
    opacity: 0.3
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.purple,
    height: 50,
    width: (width / 100) * 85,
    marginTop: 28,
    borderRadius: 30,
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
  modalTextStyle: {
    fontSize: (width / (width / 12)) + 4,
    ...Platform.select({
      ios: {
        fontWeight: "500",
        fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-SemiBold"
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

export default HomeforBlabee;