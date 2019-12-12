import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from "react-native";
import Colors from '../assets/styles/Colors'
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
const screen = Dimensions.get('window');
import realm from '../realm';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

class TermsAndConditionScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.user = realm.objects('User')[0];
    this.sourceLang = EN;
  }

  onAgreeTerms() {
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={styles.container}>

        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'center', paddingHorizontal: 12, width: screen.width }}>
            <Entypo onPress={() => this.props.navigation.navigate('VerificationScreen')} name="chevron-left" size={24} color="black" style={{ alignSelf: 'center' }} />
            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', fontFamily: "Montserrat" }}>{this.sourceLang.termCond}</Text>
            <View></View>
          </View>

          <View>
            <Text style={styles.content}>{this.sourceLang.termCondSubTitle}</Text>
            <Text style={[styles.content, { marginTop: 0 }]}>{this.sourceLang.doc}</Text>
          </View>
          <View style={{ padding: 10 }}>
            <Text style={styles.contentSecond}>
              {this.sourceLang.termsConditionDescription}
            </Text>
          </View>

          <View style={{ width: screen.width, width: screen.width, position: 'absolute', bottom: 10, justifyContent: "center", alignItems: "center" }}>
            <LinearGradient
              start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 1 }}
              style={[styles.nextButton, { borderRadius: 30, height: 50 }]}
              colors={['#964EF7', '#745997']}>
              <TouchableOpacity onPress={()=> this.onAgreeTerms()} style={{ width: screen.width - 30, height: 50, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={styles.textNext}>{this.sourceLang.agreeButtonTitle}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screen.height,
    width: screen.width,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textNext: {
    color: Colors.white,
    fontSize: 18,
    textAlign: "center",
    ...Platform.select({
      ios: {
        fontWeight: "bold",
        fontFamily: "Montserrat",
      },
      android: {
        fontFamily: "Montserrat-Bold",
      }
    })
  },
  nextButton: {
    justifyContent: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.purple,
    height: 40,
    width: screen.width - 30,
    borderRadius: 20,
    marginBottom: 10,
  },
  content: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 18,
    ...Platform.select({
      ios: {
        fontWeight: "bold",
        fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-Bold"
      }
    })
  },
  contentSecond: {
    textAlign: "center",
    fontSize: 16,
    ...Platform.select({
      ios: {
        fontFamily: "Montserrat"
      },
      android: {
        fontFamily: "Montserrat-Regular"
      }
    })
  }
});

export default TermsAndConditionScreen;