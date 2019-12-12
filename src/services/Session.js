import BlabServer from './BlabServer';
import AsyncStorage from '@react-native-community/async-storage';

export const bearerToken = async () => {
  const authToken = await AsyncStorage.getItem('@auth_Token');
  return 'Bearer ' + authToken;;
}

export const getSessions = async () => {


  try {
    const response = await BlabServer(
      {
        url: "/session",
        method: "GET",
        headers: { Authorization: await bearerToken() }
      }
    )
    return response.data;
  }
  catch (error) {
    throw Error(error)
  }
}

export const postSession = async (data) => {


  try {
    const response = await BlabServer(
      {
        url: "/session",
        method: "POST",
        headers: { Authorization: await bearerToken() },
        data
      }
    )
    console.log(await bearerToken())
    return response.data;
  }
  catch (error) {
    console.warn(error)
    throw Error(error)
  }
}

export const getAllSessions = async () => {

  try {
    const response = await BlabServer(
      {
        url: "/session/my",
        method: "GET",
        headers: { Authorization: await bearerToken() },
      }
    )
    console.warn(response)
    return response.data;
  }
  catch (error) {
    console.warn(error)
    throw Error(error)
  }
}

export const getSessionBalance = async () => {

  try {
    const response = await BlabServer(
      {
        url: "/session/getSessionBalance",
        method: "GET",
        headers: { Authorization: await bearerToken() },
      }
    )
    // console.warn("res", response);
    return response;
  }
  catch (error) {
    throw Error(error);
  }
}

export const acceptSession = async (id) => {

  try {
    const response = await BlabServer(
      {
        url: "/session/" + id + '/accept',
        method: "PUT",
        headers: { Authorization: await bearerToken() },
      }
    )
    return response;
  }
  catch (error) {
    throw Error(error)
  }
}

export const end = async (id) => {
  const response = await BlabServer(
    {
      url: "/session/" + id + '/end',
      method: "PUT",
      headers: { Authorization: await bearerToken() },
    }
  )
  return response;
}

export const cancel = async (id) => {

  try {
  const response = await BlabServer(
    {
      url: "/session/" + id + '/cancel',
      method: "PUT",
      headers: { Authorization: await bearerToken() },
    }
  )
  return response;
  }
  catch(error) {
    throw Error(error);
  }
}