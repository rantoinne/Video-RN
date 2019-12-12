import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import commonStyles from '../assets/styles/CommonStyles';
import { CreditCardInput } from "react-native-credit-card-input";
import AsyncStorage from '@react-native-community/async-storage';
import * as UserService from '../services/User';
import * as SessionService from '../services/Session';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ShowToast from '../services/DisplayToast';
import stripe from 'tipsi-stripe';
import realm from '../realm';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

stripe.setOptions({
  publishableKey: 'pk_test_E7nUiIqmPipJ56YzeFp6LGqg00Fburxzs7',
});

const { width, height } = Dimensions.get('window');

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const visaImage = require('../assets/images/visa.png');

class Payment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addCardBoolean: false,
      setDefault: false,
      dontSetDefault: true,
      showModalForDefault: false,
      role: '',
      sourceId: '',
      paymentSources: [],
      paymentCheck: false,
      paymentDetailsStored: {},
      loader: false,
      defaultSourceId: "",
      sessionBalance: '',
      activityLoader: false,
      paymentDetails: {
        bankName: '',
        accountOwnerName: '',
        accountNumber: '',
        routingNumber: '',
        payPalEmail: '',
        payPalMobileNumber: ''
      },
    };
    this.user = realm.objects('User')[0];
    this.sourceLang = this.user.defaultLanguage == "ZH" ? ZH : EN;
  }

  componentWillUnmount() {
    didBlurSubscription.remove();
    didFocusSubscription.remove();
  }

  componentDidMount = async () => {
    
    this.getAllPaymentProps();

    const didFocusSubscription = this.props.navigation.addListener(
      'willFocus',
        payload => {
          this.getAllPaymentProps();
    });

    const didBlurSubscription = this.props.navigation.addListener(
      'didBlur',
        payload => {
          this.setState({
            addCardBoolean: false,
            setDefault: false,
            dontSetDefault: true,
            showModalForDefault: false,
            role: '',
            sourceId: '',
            paymentSources: [],
            paymentCheck: false,
            paymentDetailsStored: {},
            loader: false,
            defaultSourceId: "",
            sessionBalance: '',
            activityLoader: false,
            paymentDetails: {
              bankName: '',
              accountOwnerName: '',
              accountNumber: '',
              routingNumber: '',
              payPalEmail: '',
              payPalMobileNumber: ''
            }
          });
    });

  }

  async addMoreCards() {
    if (arguments.length === 1) {
      this.setState({
        addCardBoolean: false
      });
    } else {
      this.setState({
        addCardBoolean: true
      });
    }
  }

  getAllPaymentProps=async()=> {
    try {
      this.setState({
        loader: true
      });
      const role = await AsyncStorage.getItem('@user_Type')
      if (role !== null) {
        this.setState({ role });
        if (role === "blabee") {
          var response = await UserService.getPaymentSources();
          this.setState({
            paymentSources: response.paymentSources
          });

          var response = await UserService.userMe();
          this.setState({
            defaultSourceId: response.user.defaultSourceId
          });

          var balance = await SessionService.getSessionBalance();
          this.setState({
            sessionBalance: balance.data.sessionBalance
          });
        } else {
          var paymentDetails = await UserService.getPaymentDetails();
          const paymentCheck = paymentDetails.bankName === "" ? false : true;
          this.setState({
            paymentDetailsStored: paymentDetails.paymentDetails,
            paymentCheck
          });
        }
      }
      this.setState({
        loader: false
      });
    } catch (e) {
      ShowToast('Problem fetching payment details');
    }
  }

  checkActiveRadio() {
    if (arguments[0] === 1) {
      this.setState({
        setDefault: true,
        dontSetDefault: false,
      });
    }
    else {
      this.setState({
        setDefault: false,
        dontSetDefault: true,
      });
    }
  }

  async setAsDefaultPayment(id) {
    await UserService.setDefaultPayment(id)
    var payments = await UserService.getPaymentSources();
    var response = await UserService.userMe();
    this.setState({
      defaultSourceId: response.user.defaultSourceId,
      paymentSources: []
    });
    this.setState({
      paymentSources: payments.paymentSources
    });
    ShowToast('Card set as default')
  }

  async updatePaymentDetails() {
    var { paymentDetails, paymentDetailsStored, paymentCheck } = this.state;

    if (!paymentCheck && (paymentDetails.accountNumber === '' || paymentDetails.accountOwnerName === '' || paymentDetails.bankName === '' || paymentDetails.payPalEmail === '' || paymentDetails.payPalMobileNumber === '' || paymentDetails.routingNumber === '')) {
      ShowToast('Please enter all the details');
    }

    else {

      var request = {};

      request["type"] = "bank";
      request["bankName"] = (paymentDetails.bankName !== paymentDetailsStored.bankName && paymentDetails.bankName !== "") ? paymentDetails.bankName : paymentDetailsStored.bankName;
      request["accountNumber"] = (paymentDetails.accountNumber !== paymentDetailsStored.accountNumber && paymentDetails.accountNumber !== "") ? paymentDetails.accountNumber : paymentDetailsStored.accountNumber;
      request["accountOwnerName"] = (paymentDetails.accountOwnerName !== paymentDetailsStored.accountOwnerName && paymentDetails.accountOwnerName !== "") ? paymentDetails.accountOwnerName : paymentDetailsStored.accountOwnerName;
      request["payPalEmail"] = (paymentDetails.payPalEmail !== paymentDetailsStored.payPalEmail && paymentDetails.payPalEmail !== "") ? paymentDetails.payPalEmail : paymentDetailsStored.payPalEmail;
      request["routingNumber"] = (paymentDetails.routingNumber !== paymentDetailsStored.routingNumber && paymentDetails.routingNumber !== "") ? paymentDetails.routingNumber : paymentDetailsStored.routingNumber;
      request["payPalMobileNumber"] = (paymentDetails.payPalMobileNumber !== paymentDetailsStored.payPalMobileNumber && paymentDetails.payPalMobileNumber !== "") ? paymentDetails.payPalMobileNumber : paymentDetailsStored.payPalMobileNumber;

      try {
        var response = await UserService.putPaymentDetails(request)
        ShowToast('Payment add successfully');
      }
      catch (error) {
        ShowToast(error.message || "Error updating payment method");
      }
    }
  }

  renderAllStoredPayment(data) {
    return data.map(card => {
      if (card.id === this.state.defaultSourceId) {
        return (
          <TouchableOpacity style={{ width: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 14, backgroundColor: 'white', marginBottom: 10, borderWidth: 0.5, borderColor: '#00E3AE', borderRadius: 8, elevation: 1 }}>
              <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Image source={visaImage} style={{ width: width / 7, height: width / 7 }} resizeMode="contain" />
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                  <Text style={styles.cardHeader}>{card.card.brand}</Text>
                  <Text style={styles.cardSubDetail}>{this.sourceLang.AccEndingText} {card.card.last4}</Text>
                  <Text style={styles.cardSubDetail}>{this.sourceLang.expMonthText} {card.card.exp_month}</Text>
                  <Text style={styles.cardSubDetail}>{this.sourceLang.expYearText} {card.card.exp_year}</Text>
                </View>
              </View>
              <View style={{ justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>
                <Ionicons name="md-checkmark-circle-outline" size={30} color="#00E3AE" />
              </View>
            </View>
          </TouchableOpacity>
        );
      }

      else {
        return (
          <TouchableOpacity onPress={() => this.setAsDefaultPayment(card.id)} style={{ width: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 14, backgroundColor: 'white', marginBottom: 10, borderWidth: 0.5, borderColor: '#b2bec3', borderRadius: 8, elevation: 1 }}>
              <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Image source={visaImage} style={{ width: width / 7, height: width / 7 }} resizeMode="contain" />
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                  <Text style={styles.cardHeader}>{card.card.brand}</Text>
                  <Text style={styles.cardSubDetail}>{this.sourceLang.AccEndingText} {card.card.last4}</Text>
                  <Text style={styles.cardSubDetail}>{this.sourceLang.expMonthText} {card.card.exp_month}</Text>
                  <Text style={styles.cardSubDetail}>{this.sourceLang.expYearText} {card.card.exp_year}</Text>
                </View>
              </View>
              <View style={{ justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>
                <Ionicons name="ios-radio-button-off" size={30} color="#b2bec3" />
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    });
  }

  _onChange = async (formData) => {
    if (formData.status.number !== "incomplete" && formData.status.expiry !== "incomplete" && formData.status.cvc !== "incomplete") {
      this.setState({
        loader: true,
        addCardBoolean: false,
      });
      let exp = formData.values.expiry.split('/');
      let last4 = formData.values.number.slice(Math.max(formData.values.number.length - 4, 1))
      const params = {
        type: 'card',
        number: formData.values.number,
        expMonth: parseInt(exp[0]),
        expYear: parseInt(exp[1]),
        cvc: formData.values.cvv
      };
      const stripeToken = await stripe.createSourceWithParams(params);
      this.setState({
        sourceId: stripeToken.sourceId
      });

      this.setState({
        loader: false,
        showModalForDefault: true
      });
    }
  }

  async addPayment() {
    this.setState({
      showModalForDefault: false,
      loader: true
    });

    const setDefault = this.state.setDefault ? true : false;

    try {
      var response = await UserService.addPaymentSource(this.state.sourceId, setDefault)
      var defaults = await UserService.userMe();
      this.setState({
        defaultSourceId: defaults.user.defaultSourceId
      });
    }
    catch (error) {
      ShowToast('Error adding new card');
    }

    this.setState({
      paymentSources: []
    });

    try {
      var response = await UserService.getPaymentSources();
      this.setState({
        paymentSources: response.paymentSources
      });
    }
    catch (error) {
      ShowToast(error.message || "Something went wrong");
    }

    this.setState({
      loader: false
    });


  }

  render() {
    if (this.state.role === "blabee") {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
          <DismissKeyboardView>
            <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
              {
                this.state.loader ? (
                  <View style={{ flex: 1, width, height, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={Platform.OS === 'ios' ? 1 : 30} />
                  </View>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                      <View style={styles.header}>
                        <Entypo name="chevron-left" onPress={() => this.props.navigation.goBack()} size={28} color="black" style={{ alignSelf: 'center' }} />
                        <Text style={styles.headerTitle}>{this.sourceLang.paymentTitle}</Text>
                        <View style={{ width: width / 10 }}></View>
                      </View>

                      {
                        this.state.addCardBoolean ? (
                          <TouchableOpacity onPress={() => this.addMoreCards(1)}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, alignItems: 'center', width: (width / 100) * 60, elevation: 1, borderWidth: 0.5, borderColor: "#bdc3c7", borderRadius: 40, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white' }}>
                              <Text style={[styles.addLabel, { color: 'red' }]}>
                                {this.sourceLang.cancelButtonTitle}</Text>
                            </View>
                          </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => this.addMoreCards()}>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, alignItems: 'center', width: (width / 100) * 60, elevation: 1, borderWidth: 0.5, borderColor: "#bdc3c7", borderRadius: 40, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'white' }}>
                                <Text style={styles.addLabel}>
                                  {this.sourceLang.addMoreButtonTitle}</Text>
                                <Entypo name="plus" size={34} color="#34495e" style={{ alignSelf: 'center' }} />
                              </View>
                            </TouchableOpacity>
                          )
                      }

                      <View style={{ width, borderBottomWidth: 0.5, borderColor: 'black', marginTop: 30 }}></View>

                      <ScrollView contentContainerStyle={{ width, height, marginTop: 4, justifyContent: 'flex-start', alignItems: 'center' }} >
                        {
                          this.state.paymentSources.length === 0 ?
                            (<Text style={[styles.cardSubDetail, { textAlign: 'center', alignSelf: 'center', marginTop: 20 }]}>{this.sourceLang.noPaymentsText}</Text>)
                            :
                            this.renderAllStoredPayment(this.state.paymentSources)
                        }
                      </ScrollView>

                      {
                        this.state.addCardBoolean ? (

                          <CreditCardInput
                            autoFocus
                            requiresCVC
                            labelStyle={styles.label}
                            inputStyle={styles.input}
                            validColor={"black"}
                            invalidColor={"red"}
                            placeholderColor={"darkgray"}
                            onChange={this._onChange} >
                          </CreditCardInput>
                        ) : null
                      }
                    </View>
                  )
              }

              <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => this.setState({ showModalForDefault: false })}
                visible={this.state.showModalForDefault}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ showModalForDefault: false })}
                  activeOpacity={1}
                >
                  <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' }}>
                    <View style={{ borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, width: '100%', height, backgroundColor: "#2f364020" }}>
                      <TouchableWithoutFeedback>
                        <View style={{ borderRadius: width / 10, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 2, width: '90%', height: (height / 2) - (height / 5), backgroundColor: "#ecf0f1" }}>

                          <Text style={styles.addLabel}>{this.sourceLang.setCardAsDefaultTextModal}</Text>

                          <View style={{ flexDirection: 'row', width: '100%', padding: 4, justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '45%', padding: 4, justifyContent: 'space-around', alignItems: 'center' }}>
                              {
                                !this.state.setDefault ? (<Entypo name="circle" color="#535c68" size={26} onPress={() => this.checkActiveRadio(1)}
                                  style={{ alignSelf: 'center', marginRight: 8 }} />) :
                                  (<FontAwesome name="dot-circle-o" color="#e84393" size={27} onPress={() => this.checkActiveRadio(1)}
                                    style={{ alignSelf: 'center', marginRight: 8 }} />)
                              }
                              <Text style={styles.addLabel}>{this.sourceLang.switchActiveApplicationTitle}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', width: '45%', padding: 4, justifyContent: 'space-around', alignItems: 'center' }}>
                              {
                                !this.state.dontSetDefault ? (<Entypo name="circle" color="#535c68" size={26} onPress={() => this.checkActiveRadio(2)}
                                  style={{ alignSelf: 'center', marginRight: 8 }} />) :
                                  (<FontAwesome name="dot-circle-o" color="#e84393" size={27} onPress={() => this.checkActiveRadio(2)}
                                    style={{ alignSelf: 'center', marginRight: 8 }} />)
                              }
                              <Text style={styles.addLabel}>{this.sourceLang.switchInactiveApplicationTitle}</Text>
                            </View>
                          </View>
                          <TouchableOpacity style={{ width: "50%", paddingVertical: 8, paddingHorizontal: 4, backgroundColor: '#00E3AE', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.addPayment()}>
                            <Text style={[styles.addLabel, { color: 'white', textAlign: 'center' }]}>{this.sourceLang.addPaymentButtonTitle}</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>

            </SafeAreaView>
          </DismissKeyboardView>
        </View>
      );
    }

    else if (this.state.activityLoader) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={Platform.OS === "ios" ? 1 : 30} style={{ alignSelf: 'center' }} />
        </View>
      )
    }

    else {
      return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
          <DismissKeyboardView>
            <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

              <View style={styles.header}>
                <Entypo name="chevron-left" onPress={() => this.props.navigation.goBack()} size={28} color="black" style={{ alignSelf: 'center' }} />
                <Text style={styles.headerTitle}>{this.sourceLang.paymentTitle}</Text>
                <View style={{ width: width / 10 }}></View>
              </View>

              <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[commonStyles.container]}>
                <Text style={[styles.addLabel, { marginTop: 0, color: "#74b9ff" }]}>{this.sourceLang.enterBankDetailsTitle}</Text>
                <View style={{ flexDirection: 'column', marginTop: height / 25, justifyContent: 'space-around', alignItems: 'center' }}>
                  <TextInput
                    style={commonStyles.textInput}
                    placeholder={this.state.paymentDetailsStored.bankName === "" || !this.state.paymentDetailsStored.hasOwnProperty("bankName") ? this.sourceLang.bankNameTextInput : this.state.paymentDetailsStored.bankName}
                    onChangeText={(text) => this.setState(prevState => ({
                      paymentDetails: {
                        ...prevState.paymentDetails,
                        bankName: text
                      }
                    }))}
                    value={this.state.paymentDetails.bankName}
                  />

                  <TextInput
                    style={commonStyles.textInput}
                    placeholder={this.state.paymentDetailsStored.accountOwnerName === "" || !this.state.paymentDetailsStored.hasOwnProperty("accountOwnerName") ? this.sourceLang.accOwnerNameTextInput : this.state.paymentDetailsStored.accountOwnerName}
                    onChangeText={(text) => this.setState(prevState => ({
                      paymentDetails: {
                        ...prevState.paymentDetails,
                        accountOwnerName: text
                      }
                    }))}
                    value={this.state.paymentDetails.accountOwnerName}
                  />

                  <TextInput
                    style={commonStyles.textInput}
                    onChangeText={(text) => this.setState(prevState => ({
                      paymentDetails: {
                        ...prevState.paymentDetails,
                        accountNumber: text
                      }
                    }))}
                    placeholder={this.state.paymentDetailsStored.accountNumber === "" || !this.state.paymentDetailsStored.hasOwnProperty("accountNumber") ? this.sourceLang.accNumberTextInput : this.state.paymentDetailsStored.accountNumber}
                    value={this.state.paymentDetails.accountNumber}
                  />

                  <TextInput
                    style={commonStyles.textInput}
                    placeholder={this.state.paymentDetailsStored.routingNumber === "" || !this.state.paymentDetailsStored.hasOwnProperty("routingNumber") ? this.sourceLang.routingNoTextInput : this.state.paymentDetailsStored.routingNumber}
                    onChangeText={(text) => this.setState(prevState => ({
                      paymentDetails: {
                        ...prevState.paymentDetails,
                        routingNumber: text
                      }
                    }))}
                    value={this.state.paymentDetails.routingNumber}
                  />

                  <Text style={[styles.addLabel, { marginTop: 10, color: "#74b9ff" }]}>{this.sourceLang.paypalTextTitle}</Text>
                  <View style={{ flexDirection: 'column', marginTop: height / 25, justifyContent: 'space-around', alignItems: 'center' }}>
                    <TextInput
                      style={commonStyles.textInput}
                      onChangeText={(text) => this.setState(prevState => ({
                        paymentDetails: {
                          ...prevState.paymentDetails,
                          payPalEmail: text
                        }
                      }))}
                      placeholder={this.state.paymentDetailsStored.payPalEmail === "" || !this.state.paymentDetailsStored.hasOwnProperty("payPalEmail") ? this.sourceLang.paypalEmailTextInput : this.state.paymentDetailsStored.payPalEmail}
                      value={this.state.paymentDetails.payPalEmail}
                    />

                    <TextInput
                      style={commonStyles.textInput}
                      onChangeText={(text) => this.setState(prevState => ({
                        paymentDetails: {
                          ...prevState.paymentDetails,
                          payPalMobileNumber: text
                        }
                      }))}
                      placeholder={this.state.paymentDetailsStored.payPalMobileNumber === "" || !this.state.paymentDetailsStored.hasOwnProperty("payPalMobileNumber") ? this.sourceLang.paypalNumberTextInput : this.state.paymentDetailsStored.payPalMobileNumber}
                      value={this.state.paymentDetails.payPalMobileNumber}
                    />
                    <TouchableOpacity onPress={() => this.updatePaymentDetails()}>
                      <View style={{ width: (width / 100) * 50, marginTop: 10, borderRadius: 40, padding: 14, backgroundColor: '#735997', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[styles.addLabel, { color: 'white' }]}>{!this.state.paymentCheck ? this.sourceLang.addButtonTitle : this.sourceLang.updateButtonTitle}</Text>
                      </View>
                    </TouchableOpacity>

                  </View>
                </View>
              </KeyboardAwareScrollView>

            </SafeAreaView>
          </DismissKeyboardView>
        </View>
      );
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

export default Payment;
