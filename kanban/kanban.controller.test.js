const app = require('../server');
const User = require('../user/user.model');
const jwt = require('jsonwebtoken');
const request = require('supertest');
require('dotenv').config({ path: './config/.env' });
const { setUp, dropCollections, dropDatabase } = require('../setup/db.js');
const { staticItem1, staticItem2 } = require('./staticItems');

const userData = {
  username: 'enjoyin',
  email: 'enjoyin@gmail.com',
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

describe('kanban controller', () => {
  it('creates a kanban entry successfully', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    const token = await savedUser.generateAuthToken();
    const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);
    const userId = verifyToken._id;

    const validData = { ...staticItem1, userId: userId };

    const { body } = await request(app)
      .post('/api/v1/kanban/create')
      .set('Cookie', [`auth_token=${token}`])
      .send(validData);

    expect(body.code).toEqual(201);
    expect(body.boardData).toBeDefined();
    expect(body.boardData.name).toBe('hello');
  });

  it('finds all entries successfully', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    const token = await savedUser.generateAuthToken();
    const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);
    const userId = verifyToken._id;

    const validData1 = { ...staticItem1, userId: userId };

    const createEntry1 = await request(app)
      .post('/api/v1/kanban/create')
      .set('Cookie', [`auth_token=${token}`])
      .send(validData1);

    const validData2 = { ...staticItem2, userId: userId };

    const createEntry2 = await request(app)
      .post('/api/v1/kanban/create')
      .set('Cookie', [`auth_token=${token}`])
      .send(validData2);

    const { body } = await request(app)
      .get('/api/v1/kanban/findAll')
      .set('Cookie', [`auth_token=${token}`]);

    expect(body.boardData.length).toBe(2);
    expect(body.boardData[0].name).toBe('hello');
    expect(body.boardData[0].content).toBeDefined();
  });

  it('finds one entry by name', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    const token = await savedUser.generateAuthToken();
    const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);
    const userId = verifyToken._id;

    const validData1 = { ...staticItem1, userId: userId };

    const createEntry1 = await request(app)
      .post('/api/v1/kanban/create')
      .set('Cookie', [`auth_token=${token}`])
      .send(validData1);

    const validData2 = { ...staticItem2, userId: userId };

    const createEntry2 = await request(app)
      .post('/api/v1/kanban/create')
      .set('Cookie', [`auth_token=${token}`])
      .send(validData2);

    const validName = { name: 'hello2' };

    const { body } = await request(app)
      .get('/api/v1/kanban/findbyname')
      .set('Cookie', [`auth_token=${token}`])
      .send(validName);

    expect(body.boardData.length).toBe(1);
    expect(body.boardData[0].name).toBe('hello2');
    expect(body.boardData[0].content).toBeDefined();
  });

  it('finds one entry and updates it', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    const token = await savedUser.generateAuthToken();
    const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);
    const userId = verifyToken._id;

    const validData1 = { ...staticItem1, userId: userId };

    const validEntry1 = await request(app)
      .post('/api/v1/kanban/create')
      .set('Cookie', [`auth_token=${token}`])
      .send(validData1);

    const { boardData } = validEntry1.body;

    const updatedData = { ...boardData, ...staticItem2 };

    const { body } = await request(app)
      .put('/api/v1/kanban/updateone')
      .set('Cookie', [`auth_token=${token}`])
      .send(updatedData);

    expect(body.code).toBe(200);
    expect(body.isUpdated).toBeTruthy();
    expect(body.boardData.name).toBe('hello2');
    expect(body.boardData.content.length).toBe(6);
  });

  it('finds and deletes one', async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    const token = await savedUser.generateAuthToken();
    const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);
    const userId = verifyToken._id;

    const validData1 = { ...staticItem1, userId: userId };

    const validEntry1 = await request(app)
      .post('/api/v1/kanban/create')
      .set('Cookie', [`auth_token=${token}`])
      .send(validData1);

    const validId = { _id: validEntry1.body.boardData._id };

    const { body } = await request(app)
      .delete('/api/v1/kanban/delete')
      .set('Cookie', [`auth_token=${token}`])
      .send(validId);

    expect(body.code).toBe(200);
    expect(body.isDeleted).toBeTruthy();
  });
});
