import BlabServer from './BlabServer';
import Constants from '../utils/Constants';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase'
import realm from "../realm/index";

export const bearerToken = async () => {
  const authToken = await AsyncStorage.getItem('@auth_Token');
  return 'Bearer ' + authToken;;
}

export const signUp = async (firstName, lastName, mobile, email, type, password) => {
  try {
    const response = await BlabServer(
      {
        url: "/user/signup",
        method: "POST",
        headers: { Authorization: Constants.basicAuthorization },
        data: {
          firstName,
          lastName,
          mobile,
          email,
          type,
          password
        }
      }
    )
    return response;
  }
  catch (error) {
    throw Error(error);
  }
}

export const submitApplication = async (data) => {
  try {
    const response = await BlabServer(
      {
        url: "/user/submitApplication",
        method: "POST",
        headers: { Authorization: await bearerToken() },
        data
      }
    )
    return response;
  }
  catch(error) {
    throw Error(error);
  }
}

export const loginIn = async (username, password, defaultEnglish) => {
  const response = await BlabServer(
    {
      url: "/user/login",
      method: "POST",
      headers: { Authorization: Constants.basicAuthorization },
      data: {
        grantType: "password",
        username,
        password,
      }
    }
  )
  console.log(response)
  await AsyncStorage.setItem('@auth_Token', response.data.accessToken);
  var userResponse = await userMe();
  let user = realm.objects('User')[0];
  realm.write(() => {
    if (!user) {
      realm.create('User', {
        defaultLanguage: defaultEnglish ? "EN" : "ZH",
        firstName: userResponse.user.firstName,
        lastName: userResponse.user.lastName,
        type: userResponse.user.type,
        profilePic: userResponse.user.profilePic,
        accessToken: response.data.accessToken
      });
    } else {
      user.defaultLanguage= defaultEnglish ? "EN" : "ZH",
      user.firstName = userResponse.user.firstName,
      user.lastName = userResponse.user.lastName,
      user.type = userResponse.user.type,
      user.profilePic = userResponse.user.profilePic,
      user.accessToken = response.data.accessToken
    }
  });

  console.warn("data", realm.objects('User'));
  await AsyncStorage.setItem('@user_Type', userResponse.user.type);
  await updateFcmToken();
  console.log(response)
  return userResponse;

}

export const logout = async () => {
  let accessToken = await bearerToken();
  const response = await BlabServer(
    {
      url: "/user/logout",
      method: "POST",
      headers: { Authorization: accessToken }
    }
  )
  return response.data;
}

export const userMe = async () => {
  let accessToken = await bearerToken();
  const response = await BlabServer(
    {
      url: "/user/me",
      method: "GET",
      headers: { Authorization: accessToken }
    }
  )
  return response.data;
}

export const updateRegistrationToken = async (registrationToken) => {
  try {
    const response = await BlabServer(
      {
        url: "/user/updateRegistrationToken",
        method: "PUT",
        headers: { Authorization: await bearerToken() },
        data: { registrationToken }
      }
    )
    return response;
  }
  catch (error) {
    throw Error(error);
  }
}

export const verifyOtp = async (mobile, otpCode) => {
  try {
    const response = await BlabServer(
      {
        url: '/user/verifyOtp',
        method: 'POST',
        headers: { Authorization: Constants.basicAuthorization },
        data: {
          mobile,
          otpCode
        }
      }
    )
    return response.data;
  }
  catch (error) {
    throw Error(error);
  }
}

export const resendOtp = async (mobile) => {
  try {
    const response = await BlabServer(
      {
        url: '/user/resendOtp',
        method: 'POST',
        headers: { Authorization: Constants.basicAuthorization },
        data: {
          mobile
        }
      }
    )
    return response.data;
  }
  catch (error) {
    throw Error(error);
  }
}

export const forgotPassword = async (mobile) => {
  try {
    const response = await BlabServer(
      {
        url: '/user/forgotPassword',
        method: 'POST',
        headers: { Authorization: Constants.basicAuthorization },
        data: {
          mobile
        }
      }
    )
    return response.data;
  }
  catch (error) {
    throw Error(error);
  }
}

export const resetPassword = async (mobile, otpCode, password) => {
  try {
    const response = await BlabServer(
      {
        url: '/user/resetPassword',
        method: 'POST',
        headers: { Authorization: Constants.basicAuthorization },
        data: {
          mobile,
          otpCode,
          password
        }
      }
    )
    return response.data;
  }
  catch (error) {
    throw Error(error);
  }
}

export const changeStatus = async (type, status) => {
  try {
    const response = await BlabServer(
      {
        url: '/user/changeStatus',
        method: 'PUT',
        headers: { Authorization: await bearerToken() },
        data: {
          type,
          status
        }
      }
    )
    return response;
  }
  catch (error) {
    throw Error(error)
  }
}

export const getPaymentSources = async () => {
  try {
    const response = await BlabServer(
      {
        url: '/user/getPaymentSources/',
        method: 'GET',
        headers: { Authorization: await bearerToken() },
      }
    )
    return response.data;
  }
  catch (error) {
    throw Error(error);
  }
}

export const updateProfile = async (data) => {
  try {
    const response = await BlabServer(
      {
        url: '/user/updateProfile',
        method: 'PUT',
        headers: { Authorization: await bearerToken() },
        data
      }
    )
    return response.data;
  }
  catch (error) {
    throw Error(error)
  }
}

export const addPaymentSource = async (sourceId, setDefault) => {
  try {
    var response = await BlabServer(
      {
        url: '/user/addPaymentSource',
        method: 'POST',
        headers: { Authorization: await bearerToken() },
        data: {
          sourceId,
          setDefault
        }
      }
    )
    return response;
  }
  catch (error) {
    throw Error(error)
  }
}

export const setDefaultPayment = async (sourceId) => {
  try {
    var response = await BlabServer(
      {
        url: '/user/setDefaultPaymentSource',
        method: 'PUT',
        headers: { Authorization: await bearerToken() },
        data: {
          sourceId
        }
      }
    )
    return response;
  }
  catch (error) {
    throw Error(error)
  }
}

export const updateFcmToken = async () => {
  try {
    const enabled = await firebase.messaging().hasPermission();
    if (!enabled) {
      await firebase.messaging().requestPermission();
    }
    const registrationToken = await firebase.messaging().getToken();
    if (!registrationToken) return;
    await BlabServer(
      {
        url: "/user/updateRegistrationToken",
        method: "PUT",
        headers: { Authorization: await bearerToken() },
        data: { registrationToken }
      }
    );
  } catch (error) { console.debug('Error updating FCM token - Skipping') }
};


export const getPaymentDetails = async () => {
  const response = await BlabServer(
    {
      url: "/user/paymentDetails",
      method: "GET",
      headers: { Authorization: await bearerToken() }
    }
  )
  return response.data;
}

export const putPaymentDetails = async (data) => {
  const response = await BlabServer(
    {
      url: "/user/paymentDetails",
      method: "PUT",
      headers: { Authorization: await bearerToken() },
      data
    }
  )
  return response.data;
}