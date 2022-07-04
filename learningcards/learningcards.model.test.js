const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });
const User = require('../user/user.model');
const LearningCard = require('./learningcards.model');
jwt = require('jsonwebtoken');
const { oneTopic, twoCards } = require('./staticItems.js');

const { setUp, dropCollections, dropDatabase } = require('../setup/db.js');

const userData = {
  username: 'enjoyin',
  email: 'enjoyin1234@gmail.com',
  password: 'lolrofl1234',
};

const getToken = async () => {
  const validUser = new User(userData);
  const savedUser = await validUser.save();
  const token = await savedUser.generateAuthToken();
  return token;
};
const getUserId = async () => {
  const token = await getToken();
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

describe('LearningCard', () => {
  it('creates a learning card topic and saves it successfully', async () => {
    const id = await getUserId();
    const _id = mongoose.Types.ObjectId(id._id);

    const cardData = { ...oneTopic, userid: _id };
    const validCard = new LearningCard(cardData);
    const savedCard = await validCard.save();

    expect(savedCard?.cardtopic).toBe(cardData.cardtopic);
    expect(savedCard?.userid).toBe(cardData.userid);
    expect(savedCard?.content[0]?.cardname).toBe(cardData.content[0].cardname);
    expect(savedCard?.content[0]?.question).toBe(cardData.content[0].question);
    expect(savedCard?.content[0]?.answer).toBe(cardData.content[0].answer);
  });
});
