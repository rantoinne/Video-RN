import React, { Component } from 'react'
import { TouchableOpacity, View, Image,StyleSheet} from 'react-native'

export default class BackArrow extends Component {

    goBack(){
      if (this.props.moveToLogin !== undefined) {
        this.props.navigation.navigate("LoginScreen");
      } else {
        this.props.navigation.goBack(null);
      }

    }

    render() {
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={this.goBack.bind(this)} >
            <Image
              source={require('../assets/icons/arrow-left.png')}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container:{
      flexDirection: 'row',
      marginLeft: 10,
    },
    image:{
      height: 15,
      width:28,
      marginTop:5,
      marginLeft: 5
    },
  });