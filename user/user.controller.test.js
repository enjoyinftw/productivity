const app = require('../server');
const request = require('supertest');
require('dotenv').config({ path: './config/.env' });
const User = require('../user/user.model');

const { setUp, dropCollections, dropDatabase } = require('../setup/db.js');

const userData = {
  username: '342in',
  email: 'enterteyin@gmerteil.com',
  password: 'lolrofl1234',
};
const userLogin = {
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

describe('User controller', () => {
  it('sign up creates user successfuly', async () => {
    const response = await request(app)
      .post('/api/v1/accounts/signup')
      .send(userData);
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.status).toEqual(201);
    expect(response.body.code).toEqual(201);
    expect(response.body.isRegistered).toBeTruthy();
  });

  it('log in succesfully', async () => {
    const newUser = await request(app)
      .post('/api/v1/accounts/signup')
      .send(userData);
    const response = await request(app)
      .post('/api/v1/accounts/login')
      .send(userLogin);

    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual(200);
    expect(response.body.isLogin).toBeTruthy();
  });

  it('log in with not existing user should fail', async () => {
    const invalidLogin = {
      email: 'a@a.a',
      password: 'ffdsfsfsf',
    };
    const response = await request(app)
      .post('/api/v1/accounts/login')
      .send(invalidLogin);

    expect(response.headers['set-cookie']).toBeUndefined();
    expect(response.status).toEqual(401);
    expect(response.body.code).toEqual(401);
    expect(response.body.msg).toEqual('invalid email or password1');
    expect(response.body.isLogin).toBeFalsy();
  });
  it('log in with wrong password should fail', async () => {
    const invalidLoginWrongPW = {
      email: 'enj1233n@gm3il.com',
      password: '2ofl1234',
    };
    const newUser = await request(app)
      .post('/api/v1/accounts/signup')
      .send(userData);
    const response = await request(app)
      .post('/api/v1/accounts/login')
      .send(invalidLoginWrongPW);

    expect(response.headers['set-cookie']).toBeUndefined();
    expect(response.status).toEqual(401);
    expect(response.body.code).toEqual(401);
    expect(response.body.msg).toEqual('invalid email or password1');
    expect(response.body.isLogin).toBeFalsy();
  });

  it('authentication successfully authenticates a user', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    const token = await savedUser.generateAuthToken();
    const response = await request(app)
      .get('/api/v1/accounts/authentication')
      .set('Cookie', [`auth_token=${token}`]);

    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual(200);
    expect(response.body.isAuthenticate).toBeTruthy();
    expect(response.body.user).toBeDefined();
  });

  it('authentication with invalid token should fail', async () => {
    console.log = jest.fn();

    const validUser = new User(userData);
    const savedUser = await validUser.save();
    const token = await savedUser.generateAuthToken();
    const response = await request(app)
      .get('/api/v1/accounts/authentication')
      .set('Cookie', [`auth_token=${token}2`]);

    expect(console.log).toHaveBeenCalled();

    expect(response.status).toEqual(401);
    expect(response.body.code).toEqual(401);
    expect(response.body.isAuthenticate).toBeFalsy();
    expect(response.body.msg).toBe('invalid token');
  });

  it('logout clears cookie', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    const token = await savedUser.generateAuthToken();
    const response = await request(app)
      .get('/api/v1/accounts/logout')
      .set('Cookie', [`auth_token=${token}`]);

    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual(200);
    expect(response.body.isLogout).toBeTruthy();
  });
});
