import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  ScrollView,
  ImageBackground
} from 'react-native';
import StatusBar from '../components/StatusBar';
import firstImg from '../assets/images/slide_2.jpeg';
import secondImg from '../assets/images/slide_1.jpeg';
import thirdImg from '../assets/images/slide_3.jpeg';
import ButtonBottom from "../components/ButtonBottom";
import realm from '../realm';

const EN = require('../i8L/en.json');
const ZH = require('../i8L/zh.json');

const { width, height } = Dimensions.get('window');

class SliderScreen extends Component {
  constructor(props) {
    super(props);
    this.user = realm.objects('User')[0];
    this.sourceLang = EN;
    this.state = {
      idx: 0
    };

    this.landingAssets = [
      {
        source: firstImg, text1: this.sourceLang.sliderCaption1Line1, text2: this.sourceLang.sliderCaption1Line2, text3: this.sourceLang.sliderCaption1Line3, text4: ""
      },
      {
        source: secondImg, text1: this.sourceLang.sliderCaption2Line1, text2: this.sourceLang.sliderCaption2Line2, text3: this.sourceLang.sliderCaption2Line3, text4: ""
      },
      {
        source: thirdImg, text1: this.sourceLang.sliderCaption3Line1, text2: this.sourceLang.sliderCaption3Line2, text3: this.sourceLang.sliderCaption3Line3, text4: this.sourceLang.sliderCaption3Line4
      }
    ];
  }


  nextScreen() {
    this.props.navigation.replace('Login')
  }

  renderLandingSlides() {
    return this.landingAssets.map((slide, idx) => {

      return (
        <ImageBackground source={slide.source} resizeMode="cover" style={{ height: height, width: width }}>
          <View style={{ left: 20, position: "absolute", top: 130 }}>
            <Text style={idx === 1 ? styles.textForCenter : styles.text}>{slide.text1}</Text>
            <Text style={idx === 1 ? styles.textForCenter : styles.text}>{slide.text2}</Text>
            <Text style={idx === 1 ? styles.textForCenter : styles.text}>{slide.text3}</Text>
            <Text style={idx === 1 ? styles.textForCenter : styles.text}>{slide.text4}</Text>
          </View>
          {
            idx === 2 ? (
              <View style={{ width: width, justifyContent: "center", alignItems: "center", position: "absolute", bottom: 45 }}>
                <ButtonBottom onPress={() => this.nextScreen()} title= {this.sourceLang.letsBlabButton} />
              </View>
            ) : null
          }
        </ImageBackground>
      )
    })
  }

  scrollEventCapture = (event) => {
    event.persist();
    if (Math.trunc(event.nativeEvent.contentOffset.x) === Math.trunc(width)) {
      this.setState({
        idx: 1
      });
    }

    else if (Math.trunc(event.nativeEvent.contentOffset.x) === Math.trunc(width * 2)) {
      this.setState({
        idx: 2
      });
    }
    else {
      this.setState({
        idx: 0
      });
    }
  }

  render() {
    var { idx } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar />
        <ScrollView onMomentumScrollEnd={this.scrollEventCapture} horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {
            this.renderLandingSlides()
          }
        </ScrollView>
        <View style={{ flexDirection: 'row',alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 30 }}>
          <View style={[idx === 0 ? styles.dotActive : styles.dot, ]}></View>
          <View style={[idx === 1 ? styles.dotActive : styles.dot, { marginLeft: 8 }]}></View>
          <View style={[idx === 2 ? styles.dotActive : styles.dot, { marginLeft: 8 }]}></View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    height: height,
    width: width,
  },
  text: {
    fontSize: (width / (width / 12)) + 20,
    color: Colors.black,
    paddingRight: 20,
    lineHeight: 60,
    ...Platform.select({
      ios: {
        fontFamily: "OpenSans-Regular", //for ios replace with OpenSans
      },
      android: {
        fontFamily: "OpenSans-Regular",
      }
    })
  },
  textForCenter: {
    fontSize: (width / (width / 12)) + 20,
    color: "white",
    paddingRight: 20,
    lineHeight: 60,
    ...Platform.select({
      ios: {
        fontFamily: "OpenSans-Regular", //for ios replace with OpenSans
      },
      android: {
        fontFamily: "OpenSans-Regular",
      }
    })
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6c5ce7',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  skip: {
    textAlign: "center",
    fontSize: 18,
    color: "purple"
  },
  nextStyle: {
    justifyContent: "center",
    flexDirection: 'row',
    alignItems: "center",
    height: 35,
    padding: 5,
    paddingRight: 10,
    width: 100,
    bottom: 0,
    top: 20,
    left: width / 1.2,
    right: 0,
    position: "absolute",
  },
})

export default SliderScreen;