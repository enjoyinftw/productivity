import { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import authentication from './authentication';

const AuthContext = createContext([null, () => {}]);
const API_URL = process.env.REACT_APP_API_URL;

const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isUserAuthenticated = async () => {
      const { isAuth } = await authentication();
      setIsLogin(isAuth);
    };
    isUserAuthenticated();
  }, []);

  const handleLoginStatus = (state) => {
    setIsLogin(state);
    const origin = location.state?.from?.pathname || '/goals';
    navigate(origin);
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/accounts/logout`, {
        withCredentials: true,
        credentials: 'include',
      });
      setIsLogin(!data.isLogout);
      navigate('/', { replace: true });
    } catch (err) {
      throw err;
    }
  };

  const value = { isLogin, handleLoginStatus, handleLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
