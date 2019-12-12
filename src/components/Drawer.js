import React, { Component } from 'react'
import { Text, Dimensions, View, Image, Platform, StyleSheet, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native'
import StatusBar from '../components/StatusBar';
import { NavigationActions } from 'react-navigation';
import { DrawerActions, withNavigation } from 'react-navigation';
import realm from '../realm';
const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const screen = Dimensions.get('window')
const { width } = Dimensions.get('window');
const defaultImgPlaceholder = require('../assets/images/profileImg.png');

class Drawer extends Component {
  constructor(props) {
    super(props);
    this.user = realm.objects('User')[0];
    this.realmListner = () => this.forceUpdate();
    realm.addListener('change', this.realmListner);
    this.sourceText = this.user.defaultLanguage == "ZH" ? ZH : EN;
  }

  componentWillUnmount() {
    realm.removeListener('change', this.realmListner);
  }
  navigateToScreen = (route) => () => {

    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
    this.props.navigation.dispatch(DrawerActions.closeDrawer())
  }

  navigateToLogin = async () => {
    this.props.navigation.navigate('SignUpStack', {}, NavigationActions.navigate({ routeName: 'Login' }))
  }

  render() {
    return (
      <View style={{ marginTop: 10 }}>
        <StatusBar />
        <View style={styles.profileContainer}>
          <Image source={this.user.profilePic ? { uri: this.user.profilePic } : defaultImgPlaceholder}
            style={styles.image} />
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text numberOfLines={2} style={styles.textUserName}>{this.user.firstName ? this.user.firstName : ""}&nbsp;{this.user.lastName ? this.user.lastName : ""}</Text>
            <Text numberOfLines={2} style={styles.userType}>({this.user.type ? this.user.type : ""})</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ width: '100%' }} showsVerticalScrollIndicator={false}>
          <View>
            <TouchableHighlight
              onPress={this.navigateToScreen('AllSessions')}
            >
              <Text style={styles.textMenu}>{this.sourceText.mySessionTitle}</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.navigateToScreen('Payment')}
            >
              <Text numberOfLines={1} style={styles.textMenu}>{this.sourceText.payment}</Text>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={this.navigateToScreen('ProfileScreen')}
            >
              <Text numberOfLines={1} style={styles.textMenu}>{this.sourceText.editProfile}</Text>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() => {
                this.navigateToLogin()
              }}
            >
              <Text numberOfLines={2} style={styles.textMenu}>{this.sourceText.logOut}</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2
  },
  textUserName: {
    width: screen.width - 200,
    fontSize: width / (width / 12) + 4,
    marginLeft: 20,
    ...Platform.select({
      ios: {
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
      },
      android: {
        fontFamily: "Montserrat-Bold",
      }
    })
  },
  textMenu: {
    fontSize: width / (width / 12) + 6,
    padding: 15,
    ...Platform.select({
      ios: {
        fontWeight: '600',
        fontFamily: "Montserrat",
      },
      android: {
        fontFamily: "Montserrat-SemiBold",
      }
    })
  },
  profileContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  userType: {
    color: "#636e72",
    fontSize: width / (width / 12) + 2,
    textTransform: 'capitalize',
    width: screen.width - 200,
    marginLeft: 20,
    ...Platform.select({
      ios: {
        fontWeight: 'normal',
        fontFamily: 'Montserrat',
      },
      android: {
        fontFamily: "Montserrat-Regular",
      }
    })
  }
});

export default withNavigation(Drawer);
