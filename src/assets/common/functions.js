import React from "react";
import {
  Image,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import en from '../../i8L/en.json'
import chi from '../../i8L/chiniese.json'

export function LangChange(option) {
  var lang = null
  if (option === undefined) {
    lang = en
  } else if(option === "CHIN"){
    lang = chi
  }
  return lang
}