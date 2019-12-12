import React, { Component } from 'react'
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native'

export default class HamburgerIcon extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)} >
          <Image
            source={require('../assets/icons/menu.png')}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  image: {
    height: 20,
    width: 28,
    marginLeft: 5
  },
});