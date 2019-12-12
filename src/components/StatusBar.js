import React from "react";
import {StatusBar} from "react-native";
import Colors from '../assets/styles/Colors';

export default(props)=>{
    return(
        <StatusBar
            translucent
            backgroundColor={Colors.statusBar}
            barStyle='dark-content'
        />
    )
}