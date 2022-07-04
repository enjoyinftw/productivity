const app = require('../server');
const User = require('../user/user.model');
const jwt = require('jsonwebtoken');
const request = require('supertest');
require('dotenv').config({ path: './config/.env' });
const { setUp, dropCollections, dropDatabase } = require('../setup/db.js');
const { oneTopic, twoCards } = require('./staticItems.js');

const userData = {
  username: 'enjoyin',
  email: 'enjoyin@gmail.com',
  password: 'lolrofl1234',
};
const userLogin = {
  email: 'enterteyin@gmerteil.com',
  password: 'lolrofl1234',
};

const getToken = async () => {
  const validUser = new User(userData);
  const savedUser = await validUser.save();
  const token = await savedUser.generateAuthToken();
  return token;
};
const getUserId = async (token) => {
  const verified_token = jwt.verify(token, process.env.SECRET_KEY);
  return verified_token._id;
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

describe('learningcard controller', () => {
  it('creates a learning card entry succesfullly', async () => {
    const token = await getToken();
    const userid = getUserId(token);
    const validData = { ...oneTopic, userid: userid };
    try {
      const { body } = await request(app)
        .post('/api/v1/learningcards/create')
        .set('Cookie', [`auth_token=${token}`])
        .send(validData);

      expect(body?.code).toEqual(201);
      expect(body?.isCreated).toBeTruthy(),
        expect(body?.cardData?.cardtopic).toBe('math');
      expect(body?.cardData?.content[0]).toBeDefined();
    } catch (e) {
      console.log(e);
    }
  });

  it('finds all entries succesfully', async () => {
    const token = await getToken();
    const userid = getUserId(token);
    const validData1 = { ...oneTopic, userid: userid };
    const validData2 = { ...twoCards, userid: userid };
    try {
      const createEntry1 = await request(app)
        .post('/api/v1/learningcards/create')
        .set('Cookie', [`auth_token=${token}`])
        .send(validData1);

      const createEntry2 = await request(app)
        .post('/api/v1/learningcards/create')
        .set('Cookie', [`auth_token=${token}`])
        .send(validData2);

      const { body } = await request(app)
        .get('/api/v1/learningcards/findall')
        .set('Cookie', [`auth_token=${token}`]);

      expect(body.code).toBe(200);
      expect(body.isFound).toBeTruthy();
      expect(body.cardData.length).toBe(2);
      expect(body.cardData[0].content).toBeDefined();
      expect(body.cardData[0].cardtopic).toBe('math');
      expect(body.cardData[1].content).toBeDefined();
      expect(body.cardData[1].cardtopic).toBe('life');
    } catch (e) {
      console.log(e);
    }
  });

  it('finds one entry by topic', async () => {
    const token = await getToken();
    const userid = getUserId(token);
    const validData1 = { ...oneTopic, userid: userid };
    const validData2 = { ...twoCards, userid: userid };
    try {
      const createEntry1 = await request(app)
        .post('/api/v1/learningcards/create')
        .set('Cookie', [`auth_token=${token}`])
        .send(validData1);

      const createEntry2 = await request(app)
        .post('/api/v1/learningcards/create')
        .set('Cookie', [`auth_token=${token}`])
        .send(validData2);

      const validName = { cardtopic: 'math' };

      const { body } = await request(app)
        .get('/api/v1/learningcards/findbytopic')
        .set('Cookie', [`auth_token=${token}`])
        .send(validName);

      console.log(body);

      expect(body.code).toBe(200);
      expect(body.isFound).toBeTruthy();
      expect(body.cardData.length).toBe(1);
      expect(body.cardData[0]?.cardtopic).toBe('math');
      expect(body.cardData[0]?.content).toBeDefined();
    } catch (e) {
      console.log(e);
    }
  });

  it('finds one entry and updates it', async () => {
    const token = await getToken();
    const userid = getUserId(token);
    const validData1 = { ...oneTopic, userid: userid };

    try {
      const createEntry1 = await request(app)
        .post('/api/v1/learningcards/create')
        .set('Cookie', [`auth_token=${token}`])
        .send(validData1);

      const { cardData } = createEntry1.body;
      const updatedCard = { ...cardData, ...twoCards };

      const { body } = await request(app)
        .put('/api/v1/learningcards/updateone')
        .set('Cookie', [`auth_token=${token}`])
        .send(updatedCard);

      expect(body.code).toBe(200);
      expect(body.isUpdated).toBeTruthy();
      expect(body.cardData?.cardtopic).toBe('life');
      expect(body.cardData?.content.length).toBe(2);
    } catch (e) {
      console.log(e);
    }
  });

  it('finds one and deletes it', async () => {
    const token = await getToken();
    const userid = getUserId(token);
    const validData1 = { ...oneTopic, userid: userid };

    const validEntry1 = await request(app)
      .post('/api/v1/learningcards/create')
      .set('Cookie', [`auth_token=${token}`])
      .send(validData1);

    const validId = { _id: validEntry1.body.cardData._id };

    const { body } = await request(app)
      .delete('/api/v1/learningcards/delete')
      .set('Cookie', [`auth_token=${token}`])
      .send(validId);

    expect(body.code).toBe(200);
    expect(body.isDeleted).toBeTruthy();
  });
});
