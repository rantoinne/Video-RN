import React from 'react';
import {
    View, Text, Dimensions, ScrollView, Keyboard, StyleSheet, TouchableWithoutFeedback, Platform, Modal, TouchableOpacity, KeyboardAvoidingView
} from 'react-native';
import BottomButton from '../components/ButtonBottom';
import { SafeAreaView } from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Switch } from 'react-native-switch';
import * as User from '../services/User';
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

class RequestApplicationStep3 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: false,
            highestDegree: '',
            selectDegreeModal: false,
            selectLanguageModal: false,
            languageSelected: '',
            experience: true,
            submitApplication: false,
            legal: true,
            isEnglishNative: true,
            fluency: false
        };
        this.user = realm.objects('User')[0];
        this.sourceLang = this.user.defaultLanguage == "ZH" ? ZH : EN;
    }

    finish() {
        this.setState({
            submitApplication: false
        });
        this.props.navigation.goBack();
    }

    renderSwitch(controller) {
        switch (controller) {
            case "language":
                return (
                    <Switch
                        value={this.state.isEnglishNative}
                        onValueChange={(value) => this.setState({ isEnglishNative: value })}
                        activeText={this.sourceLang.switchActiveApplicationTitle}
                        inActiveText={this.sourceLang.switchInactiveApplicationTitle}
                        circleSize={width / 15}
                        barHeight={width / 13}
                        circleBorderInactiveColor="white"
                        containerStyle={{ marginTop: 20 }}
                        circleBorderWidth={0}
                        activeTextStyle={{ color: 'white', fontSize: 15 }}
                        inactiveTextStyle={{ color: 'white', fontSize: 15 }}
                        backgroundActive={'#00E3AE'}
                        backgroundInactive={'gray'}
                        circleActiveColor={'white'}
                        renderInsideCircle={() => <View style={{ backgroundColor: 'white', width: 20, height: 20, borderRadius: 10 }} />}
                        changeValueImmediately={true}
                        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                        renderActiveText={true}
                        renderInActiveText={true}
                        switchWidthMultiplier={2.8}
                        switchLeftPx={1.3}
                        switchRightPx={1.1}
                    />)
                break;
            case "experience":
                return (
                    <Switch
                        value={this.state.experience}
                        onValueChange={(value) => this.setState({ experience: value })}
                        activeText={this.sourceLang.switchActiveApplicationTitle}
                        inActiveText={this.sourceLang.switchInactiveApplicationTitle}
                        circleSize={width / 15}
                        barHeight={width / 13}
                        circleBorderInactiveColor="white"
                        containerStyle={{ marginTop: 20 }}
                        circleBorderWidth={0}
                        activeTextStyle={{ color: 'white', fontSize: 15 }}
                        inactiveTextStyle={{ color: 'white', fontSize: 15 }}
                        backgroundActive={'#00E3AE'}
                        backgroundInactive={'gray'}
                        circleActiveColor={'white'}
                        renderInsideCircle={() => <View style={{ backgroundColor: 'white', width: 20, height: 20, borderRadius: 10 }} />}
                        changeValueImmediately={true}
                        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                        renderActiveText={true}
                        renderInActiveText={true}
                        switchWidthMultiplier={2.8}
                        switchLeftPx={1.3}
                        switchRightPx={1.1}
                    />)
                break;
            case "fluency":
                return (
                    <Switch
                        value={this.state.fluency}
                        onValueChange={(value) => this.setState({ fluency: value })}
                        activeText={this.sourceLang.switchActiveApplicationTitle}
                        inActiveText={this.sourceLang.switchInactiveApplicationTitle}
                        circleSize={width / 15}
                        barHeight={width / 13}
                        circleBorderInactiveColor="white"
                        containerStyle={{ marginTop: 20 }}
                        circleBorderWidth={0}
                        activeTextStyle={{ color: 'white', fontSize: 15 }}
                        inactiveTextStyle={{ color: 'white', fontSize: 15 }}
                        backgroundActive={'#00E3AE'}
                        backgroundInactive={'gray'}
                        circleActiveColor={'white'}
                        changeValueImmediately={true}
                        renderInsideCircle={() => <View style={{ backgroundColor: 'white', width: 20, height: 20, borderRadius: 10 }} />}
                        changeValueImmediately={true}
                        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                        renderActiveText={true}
                        renderInActiveText={true}
                        switchWidthMultiplier={2.8}
                        switchLeftPx={1.3}
                        switchRightPx={1.1}
                    />)
                break;
            case "legal":
                return (
                    <Switch
                        value={this.state.legal}
                        onValueChange={(value) => this.setState({ legal: value })}
                        disabled={false}
                        activeText={this.sourceLang.switchActiveApplicationTitle}
                        inActiveText={this.sourceLang.switchInactiveApplicationTitle}
                        circleSize={width / 15}
                        barHeight={width / 13}
                        circleBorderInactiveColor="white"
                        containerStyle={{ marginTop: 20 }}
                        circleBorderWidth={0}
                        activeTextStyle={{ color: 'white', fontSize: 15 }}
                        inactiveTextStyle={{ color: 'white', fontSize: 15 }}
                        backgroundActive={'#00E3AE'}
                        backgroundInactive={'gray'}
                        circleActiveColor={'white'}
                        changeValueImmediately={true}
                        renderInsideCircle={() => <View style={{ backgroundColor: 'white', width: 20, height: 20, borderRadius: 10 }} />}
                        changeValueImmediately={true}
                        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                        renderActiveText={true}
                        renderInActiveText={true}
                        switchWidthMultiplier={2.8}
                        switchLeftPx={1.3}
                        switchRightPx={1.1}
                    />)
                break;
        }
    }

    selectLanguage(value) {
        this.setState({
            languageSelected: value,
            selectLanguageModal: false
        });
    }

    componentDidMount() {
        // alert(JSON.stringify(this.props.navigation.state.params.userDetails))
    }

    async processApplication() {
        const dataCaptured = this.props.navigation.state.params.userDetails;
        var request = {};
        request["isEnglishNativeLanguage"] = this.state.isEnglishNative;
        request["teachingExperience"] = this.state.experience;
        request["canSpeakOtherLanguage"] = this.state.fluency;
        request["otherLanguage"] = this.state.languageSelected;
        request["eligibleToFileTaxes"] = this.state.legal;
        request["address"] = dataCaptured.address;
        request["city"] = dataCaptured.city;
        request["zip"] = dataCaptured.zip;
        request["country"] = dataCaptured.country;
        request["countryCode"] = dataCaptured.countryCode;
        request["firstName"] = dataCaptured.prevDetails.firstName;
        request["lastName"] = dataCaptured.prevDetails.lastName;
        // request["gender"] = dataCaptured.prevDetails.gender;
        request["documentLink"] = "www.url.co";
        request["dob"] = dataCaptured.prevDetails.dob;
        request["email"] = dataCaptured.prevDetails.email;
        request["phone"] = dataCaptured.prevDetails.phone;

        try {
            var response = await User.submitApplication(request)
            this.setState({
                submitApplication: true
            });
        }
        catch (error) {
            ShowToast(error.message || this.sourceLang.applicationToast);
        }

        // this.setState({
        //     submitApplication: true
        // });
    }

    selectDegree(val) {
        this.setState({
            highestDegree: val,
            selectDegreeModal: false
        });
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <DismissKeyboardView>
                    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={styles.header}>
                            <Entypo name="chevron-left" onPress={() => this.props.navigation.navigate('RequestApplicationStep2')} size={28} color="black" style={{ alignSelf: 'center' }} />
                            <Text style={styles.headerTitle}>{this.sourceLang.applicationTitle}</Text>
                            <View style={{ width: width / 10 }}></View>
                        </View>

                        <KeyboardAvoidingView style={{ width, height: height - 200, justifyContent: 'center', alignItems: 'center' }} behavior="padding" enabled>
                            <ScrollView contentContainerStyle={{ width, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: '85%', paddingHorizontal: 8, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 40, borderWidth: 0.5, marginTop: 40, borderColor: '#d1ccc0' }}>
                                    <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }} onPress={() => this.setState({ selectDegreeModal: true })}>

                                        {
                                            this.state.highestDegree === "" ? (
                                                <Text style={[styles.gridText, { textAlign: 'left', color: '#535c68' }]}>{this.sourceLang.highestDegreeText}</Text>
                                            ) : (
                                                    <Text style={[styles.gridText, { textAlign: 'left', color: 'black' }]}>{this.state.highestDegree}</Text>
                                                )
                                        }
                                        <AntDesign name="caretdown" size={10} color="#95a5a6" />

                                    </TouchableOpacity>
                                </View>

                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    onRequestClose={() => this.setState({ selectDegreeModal: false })}
                                    visible={this.state.selectDegreeModal}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.setState({ selectDegreeModal: false })}
                                        activeOpacity={1}
                                    >
                                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width, height }}>
                                            <View style={{ borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, width: '100%', height, backgroundColor: "#2f364010" }}>
                                                <TouchableWithoutFeedback>
                                                    <View style={{ borderRadius: width / 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, width: '70%', height: (height / 2) - (height / 6), backgroundColor: "#fff", elevation: 4 }}>

                                                        <ScrollView contentContainerStyle={{ width }} showsVerticalScrollIndicator={false}>
                                                            <TouchableOpacity onPress={() => this.selectDegree("Graduate")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                                                <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.graduate}</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => this.selectDegree("Diploma")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                                                <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.diploma}</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => this.selectDegree("Post Graduate")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                                                <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.postGrad}</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => this.selectDegree("Doctorate")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                                                <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.doctorate}</Text>
                                                            </TouchableOpacity>
                                                        </ScrollView>

                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Modal>

                                <Text style={[styles.gridText, { marginTop: 30, textAlign: 'center' }]}>{this.sourceLang.nativeLangSwitch}</Text>
                                {this.renderSwitch("language")}

                                <Text style={[styles.gridText, { marginTop: 30, textAlign: 'center' }]}>{this.sourceLang.teachExpText}</Text>
                                {this.renderSwitch("experience")}

                                <Text style={[styles.gridText, { marginTop: 30, textAlign: 'center' }]}>{this.sourceLang.otherLangSwitch}</Text>
                                {this.renderSwitch("fluency")}

                                {
                                    this.state.fluency ? (
                                        <View style={{ width: '85%', paddingHorizontal: 8, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 40, borderWidth: 0.5, marginTop: 30, borderColor: '#d1ccc0' }}>
                                            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }} onPress={() => this.setState({ selectLanguageModal: true })}>

                                                {
                                                    this.state.languageSelected === '' ? (
                                                        <Text style={[styles.gridText, { textAlign: 'left', color: '#535c68' }]}>{this.sourceLang.selectLangText}</Text>
                                                    ) : (
                                                            <Text style={[styles.gridText, { textAlign: 'left', color: 'black' }]}>{this.state.languageSelected}</Text>
                                                        )
                                                }
                                                <AntDesign name="caretdown" size={10} color="#95a5a6" />

                                            </TouchableOpacity>
                                        </View>
                                    ) : null
                                }

                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    onRequestClose={() => this.setState({ selectLanguageModal: false })}
                                    visible={this.state.selectLanguageModal}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.setState({ selectLanguageModal: false })}
                                        activeOpacity={1}
                                    >
                                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width, height }}>
                                            <View style={{ borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, width: '100%', height, backgroundColor: "#2f364010" }}>
                                                <TouchableWithoutFeedback>
                                                    <View style={{ borderRadius: width / 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, width: '70%', height: (height / 2) - (height / 6), backgroundColor: "#fff", elevation: 4 }}>

                                                        <ScrollView contentContainerStyle={{ width }} showsVerticalScrollIndicator={false}>
                                                            <TouchableOpacity onPress={() => this.selectLanguage("German")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                                                <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.german}</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => this.selectLanguage("Dutch")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                                                <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.dutch}</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => this.selectLanguage("Portuguese")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                                                <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.portuguese}</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => this.selectLanguage("Chinese")} style={{ width: '80%', padding: 16, borderTopWidth: 0, borderColor: 'gray' }}>
                                                                <Text style={[styles.gridText, { textAlign: 'left' }]}>{this.sourceLang.chinese}</Text>
                                                            </TouchableOpacity>
                                                        </ScrollView>

                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Modal>

                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    onRequestClose={() => this.setState({ submitApplication: false })}
                                    visible={this.state.submitApplication}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.setState({ submitApplication: false })}
                                        activeOpacity={1}
                                    >
                                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width, height }}>
                                            <View style={{ borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, width: '100%', height, backgroundColor: "#2f364040" }}>
                                                <TouchableWithoutFeedback>
                                                    <View style={{ borderRadius: width / 14, flexDirection: 'column', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center', paddingVertical: 4, width: '90%', height: (height / 2) - (height / 3.5), backgroundColor: "#fff", elevation: 4 }}>

                                                        <Text style={[styles.gridText, { textAlign: 'center', color: '#a4b0be', fontSize: 15, marginTop: 15 }]}>{this.sourceLang.goToDocsScreenText}</Text>

                                                        <TouchableOpacity onPress={() => this.finish()} style={{ width: '99%', borderTopWidth: 1, padding: 16, borderColor: '#bdc3c7' }}>
                                                            <Text style={[styles.gridText, { textAlign: 'center', fontSize: 18 }]}>{this.sourceLang.okButtonModal}</Text>
                                                        </TouchableOpacity>

                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Modal>

                                <Text style={[styles.gridText, { marginTop: 30, textAlign: 'center' }]}>{this.sourceLang.legalSwitch}</Text>
                                {this.renderSwitch("legal")}
                            </ScrollView>
                        </KeyboardAvoidingView>

                        <View style={{ position: 'absolute', bottom: 10 }}>
                            <BottomButton
                                title={this.sourceLang.submitButtonTitle}
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
})

export default RequestApplicationStep3;