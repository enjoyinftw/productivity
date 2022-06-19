const Kanban = require('./kanban.model');
const jwt = require('jsonwebtoken');

const create = async (req, res) => {
  try {
    const data = req.body;
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const fullData = {
      ...data,
      userid: verifyToken._id,
    };
    const board = new Kanban(fullData);
    await board.save();

    res.status(201).json({ code: 201, isCreated: true, boardInfo: board });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      code: 400,
      isCreated: false,
      msg: 'invalid data or invalid syntax',
    });
  }
};

const findAll = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const boardInfo = await Kanban.find({
      userid: verifyToken._id,
    });
    res.status(200).json({
      code: 200,
      isFound: true,
      boardInfo: boardInfo,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      code: 400,
      isFound: false,
      msg: 'invalid token',
    });
  }
};

const findByName = async (req, res) => {
  try {
    const { name } = req.body;
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const boardInfo = await Kanban.find({
      userid: verifyToken._id,
      name: name,
    });
    res.status(200).json({
      code: 200,
      isFound: true,
      boardInfo: boardInfo,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      code: 400,
      isFound: false,
      msg: 'invalid token',
    });
  }
};

const updateone = async (req, res) => {
  try {
    const data = req.body;
    const goalInfo = await Goal.findOneAndUpdate(
      { _id: data._id },
      {
        $set: { goalname: data.goalname, goalitems: data.goalitems },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ code: 200, isUpdated: true, data: goalInfo });
  } catch (e) {
    console.log(e);
  }
};

const deleteone = async (req, res) => {
  try {
    const data = req.body;
    const deleteGoal = await Goal.findByIdAndDelete({ _id: data._id });
    res.status(200).json({ code: 200, isDeleted: true, data: deleteGoal });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { create, findAll, findByName, updateone, deleteone };
