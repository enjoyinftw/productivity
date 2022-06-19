import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const authentication = async () => {
  try {
    const { data } = await axios.get(
      `${API_URL}/api/v1/accounts/authentication`,
      {
        withCredentials: true,
        credentials: 'include',
      }
    );
    return {
      isAuth: data.isAuthenticate,
      user: data.user,
    };
  } catch (error) {
    throw error;
  }
};

export default authentication;
