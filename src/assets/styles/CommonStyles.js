import { StyleSheet, Dimensions,Platform } from 'react-native';
import Colors from './Colors';
import Constants from './../../utils/Constants';

const screen=Dimensions.get('window');

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer : {
    marginBottom: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    width: screen.width-50,
    borderRadius:25,
    borderWidth:0.2,
    borderColor: "#727272",
    flex:0,
    height: 40,
  },
  textInput: {
    width: screen.width-40,
    marginBottom: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    width: screen.width-50,
    borderRadius:25,
    borderWidth:0.4,
    borderColor: "#727272",
    flex:0,
    height: 50,
    elevation: 1,
    fontSize:screen.width / (screen.width / 12) + 2,
    backgroundColor:Colors.white,
    ...Platform.select({
      ios: {
        fontFamily: "Montserrat",
      },
      android: {
        fontFamily: "Montserrat-Regular",
      }
    })
  },
  imageBack:{
    height:'100%',
    width:'100%'
  },
  textTitle1:{
    justifyContent: 'center',
    color: Colors.textOrange,
    textAlign: 'center',
    fontSize: 30,
    width: 300,
    marginTop: 30,
    fontWeight:'bold'
  },
   textTitle2: {
    justifyContent: 'center',
    fontSize: 30,
    textAlign: 'center',
    width: 300,
    marginTop: 10,
    fontWeight:'bold',
    color:Colors.white
  },
  textTitle3: {
    justifyContent: 'center',
    fontSize: 60,
    textAlign: 'center',
    fontWeight: '500',
    width: 300,
    marginTop: 10,
    color:Colors.white
  },
  divider:{
    flexDirection:'row',
    height:0.2,
    backgroundColor:Colors.grey
  },
  imageBackgroundContainer:{
    height:screen.height,
    width:screen.width,
    resizeMode: 'cover',
    paddingTop:Constants.STATUS_BAR_HEIGHT+Constants.TOOLBAR_HEIGHT
  },
  toolbar :{
    backgroundColor: Colors.white,
    paddingTop: 5,
    justifyContent: 'center',
    width: screen.width,

  },
  headerStyle: {
    color: Colors.black,
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
  },
});