const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/.env' });
const User = require('./user.model.js');
const { setUp, dropCollections, dropDatabase } = require('../setup/db.js');

const userData = {
  username: '342in',
  email: 'enterteyin@gmerteil.com',
  password: 'lolrofl1234',
};

beforeAll(async () => {
  await setUp();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDatabase();
});

describe('User model', () => {
  it('creates and saves user successfully', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    const isMatch = savedUser.matchPassword(userData.password);
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.username).toBe(userData.username);
    expect(isMatch).toBeTruthy();
  });

  it('inserts user successfully, but the field not defined in schema should be undefined', async () => {
    const userWithInvalidField = new User({
      ...userData,
      nickname: 'kekw',
    });
    const savedUserWithInvalidField = await userWithInvalidField.save();
    const isMatch = savedUserWithInvalidField.matchPassword(userData.password);
    expect(savedUserWithInvalidField._id).toBeDefined();
    expect(savedUserWithInvalidField._nickname).toBeUndefined();
    expect(isMatch).toBeTruthy();
  });

  it('creates user without required field should fail', async () => {
    const userWithoutRequiredField = new User({ username: 'king' });
    let err;
    try {
      const savedUserWithoutRequiredField =
        await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it('pre save encrypts passwords', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();

    expect(savedUser.password).not.toEqual(userData.password);
  });

  it('generateAuthToken', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    const token = await savedUser.generateAuthToken();
    const verifyAuthToken = jwt.verify(token, process.env.SECRET_KEY);
    expect(token).toBeDefined;
    expect(savedUser._id.toString()).toBe(verifyAuthToken._id);
  });

  it('matchPassword correct password successfully', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();

    const isMatch = savedUser.matchPassword(userData.password);
    expect(isMatch).toBeTruthy;
  });
  it('matchPassword wrong password unsuccessfully', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();

    const isMatch = savedUser.matchPassword('wrongpassword');
    expect(isMatch).toBeFalsy;
  });
});
