import React from 'react';
import {
    View, Text, Dimensions, ScrollView, Keyboard, StyleSheet, TouchableWithoutFeedback, Platform, TextInput, KeyboardAvoidingView
} from 'react-native';
import BottomButton from '../components/ButtonBottom';
import commonStyles from '../assets/styles/CommonStyles'
import { SafeAreaView } from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import ShowToast from '../services/DisplayToast';
import realm from '../realm';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const { width, height } = Dimensions.get('window');

const DismissKeyboardView = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class RequestApplicationStep2 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.user = realm.objects('User')[0];
        this.sourceLang = this.user.defaultLanguage == "ZH" ? ZH : EN;
        this.address = "";
        this.city = "";
        this.zip = "";
        this.country = "";
        this.countryCode ="";
    }

    processApplication() {
        var userDetails = {};
        userDetails["prevDetails"] = this.props.navigation.state.params.userDetails;
        userDetails["address"] = this.address;
        userDetails["city"] = this.city;
        userDetails["zip"] = this.zip;
        userDetails["country"] = this.country;
        userDetails["countryCode"] = this.countryCode;

        this.props.navigation.navigate('RequestApplicationStep3', { userDetails });
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <DismissKeyboardView>
                    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={styles.header}>
                            <Entypo name="chevron-left" onPress={() => this.props.navigation.navigate('RequestApplicationStep1')} size={28} color="black" style={{ alignSelf: 'center' }} />
                            <Text style={styles.headerTitle}>{this.sourceLang.applicationTitle}</Text>
                            <View style={{ width: width / 10 }}></View>
                        </View>

                        <KeyboardAvoidingView style={{ width, height: height - 200, justifyContent: 'center', alignItems: 'center' }} behavior="padding" enabled>
                        <ScrollView>
                        <View style={styles.textArea}>
                            <TextInput
                                style={[commonStyles.textInput, { color: 'black' }]}
                                keyboardType='email-address'
                                onChangeText={(text) => this.address = text}
                                placeholder= {this.sourceLang.addTextInput} />

                            <TextInput
                                style={[commonStyles.textInput, { color: 'black' }]}
                                onChangeText={(text) => this.city = text}
                                placeholder= {this.sourceLang.cityTextInput} />

                            <TextInput
                                style={[commonStyles.textInput, { color: 'black' }]}
                                onChangeText={(text) => this.zip = text}
                                placeholder= {this.sourceLang.zipTextInput} />

                            <TextInput
                                style={[commonStyles.textInput, { color: 'black' }]}
                                onChangeText={(text) => this.country = text}
                                placeholder= {this.sourceLang.countryTextInput} />

                            <TextInput
                                style={[commonStyles.textInput, { color: 'black' }]}
                                autoCapitalize='none'
                                keyboardType="numeric"
                                onChangeText={(text) => this.countryCode = text}
                                placeholder= {this.sourceLang.countryCodeTextInput} />
                        </View>
                        </ScrollView>
                        </KeyboardAvoidingView>

                        <View style={{ marginTop: 20 }}>
                            <BottomButton
                                title= {this.sourceLang.nextButtonTitle}
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

export default RequestApplicationStep2;