import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, Platform, Dimensions, Image, StyleSheet, Alert
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import CountDown from 'react-native-countdown-component';
import ButtonBottom from '../components/ButtonBottom';

import realm from '../realm';
const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const { width, height } = Dimensions.get('window');

class WaitingScreen extends Component {

    constructor(props) {
        super(props);
        this.user = realm.objects('User')[0];
        this.sourceLang = this.user.defaultLanguage === "ZH" ? ZH : EN;
        this.state = {
            
        };
    }

    componentMountStartRTCEngine() {

    }

    cancelOnIntroScreen() {
        Alert.alert(
            this.sourceLang.cancelSession,
            this.sourceLang.cancelDescription,
            [
                { text: this.sourceLang.switchActiveApplicationTitle, onPress: () => this.props.navigation.goBack() },
                {
                    text: this.sourceLang.switchInactiveApplicationTitle,
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center' }}>

                <View style={{ width, marginTop: 18, padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.cancelOnIntroScreen()}>
                        <Entypo name="chevron-left" size={28} color="black" style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={styles.plainTextStyle}>John Doe</Text>
                    <CountDown
                        until={15}
                        size={20}
                        separatorStyle={{ color: 'black' }}
                        onFinish={() => this.componentMountStartRTCEngine()}
                        running={true}
                        digitStyle={{ backgroundColor: '#fff' }}
                        digitTxtStyle={{ color: '#00E3AE' }}
                        timeToShow={['S']}
                        timeLabels={{ s: '' }}
                    />
                </View>

                <Image source={require('../assets/images/profileImg.png')}
                    style={{ width: width / 2, borderRadius: width / 4, marginTop: 40 }} />
                <Text style={[styles.plainTextStyle, { marginTop: 30 }]}>Los Angeles / 28 years</Text>
                <Text style={styles.plainTextStyle}>Master's Degree</Text>

                <View style={{ width, flexDirection: 'row', padding: 4, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.plainTextStyle}>Is English your native language?</Text>
                    <Text style={[styles.plainTextStyle, { color: '#00E3AE' }]}>Yes</Text>
                </View>

                <View style={{ width, flexDirection: 'row', padding: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.plainTextStyle}>Do you have teaching experience?</Text>
                    <Text style={[styles.plainTextStyle, { color: '#00E3AE' }]}>Yes</Text>
                </View>

                <View style={{ width, flexDirection: 'row', padding: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.plainTextStyle}>Other fluent languages?</Text>
                    <Text style={[styles.plainTextStyle, { color: '#00E3AE' }]}>German</Text>
                </View>

                <View style={{ position: 'absolute', bottom: 10 }}>
                    <ButtonBottom
                        title="Connect"
                        onPress={() => this.componentMountStartRTCEngine()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    plainTextStyle: {
        fontSize: 16,
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
})

export default WaitingScreen;