import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';
import Colors from '../assets/styles/Colors';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

class ButtonBottom extends Component {
    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }}
                style={[styles.nextButton, { borderRadius: 30, height: 50, marginTop: 20 }]}
                colors={['#745997', '#964EF7']}>
                <TouchableOpacity onPress={() => this.props.onPress()} style={{ width: width - 30, height: 50, justifyContent: 'center', alignItems: 'center' }} >
                    <Text style={styles.textNext} >{this.props.title}</Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    textNext: {
        color: Colors.white,
        textAlign: "center",
        fontFamily: "Montserrat",
        fontSize: width / (width / 12) + 4,
        ...Platform.select({
            ios: {
                fontWeight: 'bold',
            },
            android: {
                fontFamily: "Montserrat-Bold"
            }
        })
    },
    nextButton: {
        justifyContent: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.purple,
        width: width - 30,
        marginBottom: 10,
    },
})

export default ButtonBottom;