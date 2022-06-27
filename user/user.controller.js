const User = require('./user.model');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    res.cookie('auth_token', token, {
      maxAge: 604800000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.status(201).json({ code: 201, isRegistered: true });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      code: 400,
      isRegistered: false,
      msg: 'invalid data or invalid syntax',
    });
  }
};

const authentication = async (req, res) => {
  console.log(req.cookies.auth_token);
  try {
    const token = req.cookies.auth_token;
    if (token) {
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
      const userInfo = await User.findOne(
        {
          _id: verifyToken._id,
        },
        {
          password: 0,
          email: 0,
        }
      );
      const user = userInfo._doc;

      res.status(200).json({
        code: 200,
        isAuthenticate: true,
        user: {
          ...user,
          _id: user._id.toString(),
        },
      });
    } else {
      res.status(401).json({
        code: 401,
        isAuthenticate: false,
        msg: 'invalid token test',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({
      code: 401,
      isAuthenticate: false,
      msg: 'invalid token',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userLogin = await User.findOne({ email: email });

    if (!userLogin) {
      return res.status(401).json({
        code: 401,
        isLogin: false,
        msg: 'invalid email or password1',
      });
    }
    const isMatch = await userLogin.matchPassword(password);
    if (isMatch) {
      const token = await userLogin.generateAuthToken();
      res.cookie('auth_token', token, {
        maxAge: 604800000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.status(200).json({
        code: 200,
        isLogin: true,
      });
    } else {
      res.status(401).json({
        code: 401,
        isLogin: false,
        msg: 'invalid email or password2',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      isLogin: false,
      msg: 'internal error',
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (token) {
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
      if (verifyToken) {
        res.clearCookie('auth_token', { path: '/' });
        res.status(200).json({ code: 200, isLogout: true });
      } else {
        res.status(401).json({
          code: 401,
          isLogout: false,
          msg: 'invalid token',
        });
      }
    } else {
      res.status(401).json({
        code: 401,
        isLogout: false,
        msg: 'invalid token',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      isLogout: false,
      msg: 'internal error',
    });
  }
};

module.exports = {
  signup,
  authentication,
  login,
  logout,
};
