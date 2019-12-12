import axios from 'axios';
import Constants from '../utils/Constants';

export default async (options, header) => {
  try {
    const response = await axios.create({
      baseURL: Constants.baseUrl,
      headers: header
    })(options);
    return response;
  } catch (error) {
    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      // console.warn('Status:', error.response.status);
      // console.warn('Data:', error.response.data);
      // console.warn('Headers:', error.response.headers);
      if (error.response.data && error.response.data.message) {
        throw Error(error.response.data.message);
      }
    } else {
      // Something else happened while setting up the request
      // triggered the error
    }
    // alert(JSON.stringify(error))
    // console.debug(error)
    throw Error(error._response || error.message || 'Error occurred.');
  }
}