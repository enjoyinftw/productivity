import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from '../component/authentication/auth';
import { useAuthContext } from '../component/authentication/AuthProvider';
import authentication from '../component/authentication/authentication';

const SignUp = () => {
  const [submitCount, setSubmitCount] = useState(0);

  const [userInput, setUserInput] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
  });

  const [errorMsg, setErrorMsg] = useState({
    username: '',
    email: '',
    password: '',
  });

  const API_URL = process.env.REACT_APP_API_URL;
  const initial = useRef(true);
  const navigate = useNavigate();
  const { handleLoginStatus } = useAuthContext();

  useEffect(() => {
    if (initial.current === true) {
      initial.current = false;
    } else {
      let formError = false;
      const errorValues = Object.values(errors);
      errorValues.forEach((value) => {
        if (value) {
          formError = true;
        }
      });
      if (!formError) {
        completeSignup();
      }
    }
  }, [submitCount]);

  const submitForm = (event) => {
    event.preventDefault();
    const validatedUsername = validateUsername(userInput.username);
    const validatedEmail = validateEmail(userInput.email);
    const validatedPassword = validatePassword(userInput.password);

    setErrorMsg({
      username: validatedUsername.errorMsg,
      email: validatedEmail.errorMsg,
      password: validatedPassword.errorMsg,
    });
    setErrors({
      username: validatedUsername.isError,
      email: validatedEmail.isError,
      password: validatedPassword.isError,
    });
    setSubmitCount((cnt) => cnt + 1);
  };

  const completeSignup = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/accounts/signup`,
        {
          ...userInput,
        },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );

      const { isAuth } = await authentication();
      handleLoginStatus(isAuth);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  const handleInput = (event) => {
    setUserInput({ ...userInput, [event.target.name]: event.target.value });
  };

  return (
    <Box
      sx={{
        marginTop: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      component='form'
      noValidate>
      <Typography variant='h2' component='h1' sx={{ paddingBottom: 2 }}>
        Sign Up
      </Typography>
      <TextField
        error={errors.username}
        id={
          errors.username
            ? 'username-input-field-error'
            : 'username-input-field'
        }
        label='Enter username'
        name='username'
        value={userInput.username}
        onChange={handleInput}
        helperText={errorMsg.username ? errorMsg.username : ' '}
      />
      <TextField
        error={errors.email}
        id={errors.username ? 'email-input-field-error' : 'email-input-field'}
        label='Enter email'
        name='email'
        value={userInput.email}
        onChange={handleInput}
        helperText={errorMsg.email ? errorMsg.email : ' '}
      />
      <TextField
        type='password'
        error={errors.password}
        id={
          errors.username
            ? 'password-input-field-error'
            : 'password-input-field'
        }
        label='Enter password'
        name='password'
        value={userInput.password}
        onChange={handleInput}
        helperText={errorMsg.password ? errorMsg.password : ' '}
      />
      <Button variant='contained' onClick={submitForm}>
        Sign Up
      </Button>
    </Box>
  );
};

export default SignUp;
