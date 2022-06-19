const regName = /^[a-zA-Z0-9]+$/;
const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,20}$/;
const regEmail =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const validateUsername = (name) => {
  if (name === '') {
    return {
      isError: true,
      errorMsg: 'Username can not be empty.',
    };
  } else if (name.length < 3) {
    return {
      isError: true,
      errorMsg: 'Minimum 3 characters required.',
    };
  } else if (name.length > 20) {
    return {
      isError: true,
      errorMsg: 'Maximum 20 characters allowed.',
    };
  } else if (!regName.test(name)) {
    return {
      isError: true,
      errorMsg: 'Invalid username.',
    };
  } else {
    return {
      isError: false,
      errorMsg: '',
    };
  }
};

const validatePassword = (pass) => {
  if (pass === '') {
    return {
      isError: true,
      errorMsg: 'password can not be empty.',
    };
  } else if (pass.length < 6) {
    return {
      isError: true,
      errorMsg: 'Minimum 6 characters required.',
    };
  } else if (pass.length > 20) {
    return {
      isError: true,
      errorMsg: 'Maximum 20 characters allowed.',
    };
  } else if (!regPassword.test(pass)) {
    return {
      isError: true,
      errorMsg: 'Please use a stronger password!',
    };
  } else {
    return {
      isError: false,
      errorMsg: '',
    };
  }
};

//missing duplicate email check api call
const validateEmail = (email) => {
  if (!regEmail.test(email)) {
    return {
      isError: true,
      errorMsg: 'Invalid Email',
    };
  } else {
    return {
      isError: false,
      errorMsg: '',
    };
  }
};

export { validateEmail, validatePassword, validateUsername };
