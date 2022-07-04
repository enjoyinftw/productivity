const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });
const User = require('../user/user.model');
const Kanban = require('./kanban.model');
const jwt = require('jsonwebtoken');
const { staticItem1, staticItem2 } = require('./staticItems');

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

describe('Kanban', () => {
  it('creates kanban board with 1 item and saves it successfully', async () => {
    const id = await getUserId();
    const _id = mongoose.Types.ObjectId(id._id);

    const boardData = { ...staticItem1, userid: _id };

    const validBoard = new Kanban(boardData);
    const savedBoard = await validBoard.save();

    expect(savedBoard.name).toBe(boardData.name);
    expect(savedBoard.userid).toBe(boardData.userid);
    expect(savedBoard.position).toBe(boardData.position);
    expect(savedBoard.content[0].columnname).toBe(
      boardData.content[0].columnname
    );
    expect(savedBoard.content[0].columnitems[0].itemname).toBe(
      boardData.content[0].columnitems[0].itemname
    );
    expect(savedBoard.content[0].columnitems[0].itemdescription).toBe(
      boardData.content[0].columnitems[0].itemdescription
    );
  });
  it('creates kanban board with multiple columns and rows and saves it successfully', async () => {
    const id = await getUserId();
    const _id = mongoose.Types.ObjectId(id._id);

    const boardData = { ...staticItem2, userid: _id };

    const validBoard = new Kanban(boardData);
    const savedBoard = await validBoard.save();

    expect(savedBoard.name).toBe(boardData.name);
    expect(savedBoard.userid).toBe(boardData.userid);
    expect(savedBoard.position).toBe(boardData.position);
    expect(savedBoard.content[0].columnname).toBe(
      boardData.content[0].columnname
    );
    expect(savedBoard.content[0].columnitems[0].itemname).toBe(
      boardData.content[0].columnitems[0].itemname
    );
    expect(savedBoard.content[0].columnitems[0].itemdescription).toBe(
      boardData.content[0].columnitems[0].itemdescription
    );
  });
  /*
  it('saves new Board succesfully, but the field not defined in schema should be undefined', async () => {
    const id = await getUserId();
    const _id = mongoose.Types.ObjectId(id);

    const BoardData = {
      Boardname: 'master',
      userid: _id,
      position: 1,
      Boarditems: [
        {
          Boarditemname: 'learn react',
          Boarddescription: 'get good or die tryin',
        },
      ],
    };
    const invalidBoard = new Board({
      ...BoardData,
      random: 'so random',
    });
    const savedBoard = await invalidBoard.save();

    expect(savedBoard.Boardname).toBe(BoardData.Boardname);
    expect(savedBoard.userid).toBe(BoardData.userid);
    expect(savedBoard.random).toBeUndefined();
    expect(savedBoard.position).toBe(BoardData.position);
    expect(savedBoard.Boarditems[0].Boarditemname).toBe(
      BoardData.Boarditems[0].Boarditemname
    );
    expect(savedBoard.Boarditems[0].Boarddescription).toBe(
      BoardData.Boarditems[0].Boarddescription
    );
  });
  */
});
