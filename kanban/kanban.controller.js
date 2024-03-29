const Kanban = require('./kanban.model');
const jwt = require('jsonwebtoken');

const createKanban = async (req, res) => {
  try {
    const data = req.body;
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (verifyToken) {
      const fullData = {
        ...data,
        userid: verifyToken._id,
      };
      const board = new Kanban(fullData);
      await board.save();

      res.status(201).json({ code: 201, isCreated: true, boardData: board });
    } else {
      res.status(400).json({
        code: 400,
        isCreated: false,
        msg: 'invalid data or invalid syntax',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      code: 400,
      isCreated: false,
      msg: 'invalid data or invalid syntax',
    });
  }
};

const findAllKanban = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const boardInfo = await Kanban.find({
      userid: verifyToken._id,
    });
    res.status(200).json({
      code: 200,
      isFound: true,
      boardData: boardInfo,
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

const findByNameKanban = async (req, res) => {
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
      boardData: boardInfo,
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

const updateoneKanban = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (verifyToken) {
      const data = req.body;
      const boardInfo = await Kanban.findOneAndUpdate(
        {
          _id: data._id,
          userid: verifyToken._id,
        },
        {
          $set: { name: data.name, content: data.content },
        },
        {
          new: true,
        }
      );
      res
        .status(200)
        .json({ code: 200, isUpdated: true, boardData: boardInfo });
    } else {
      res.status(400).json({
        code: 400,
        isUpdated: false,
        msg: 'invalid data or token',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      code: 400,
      isUpdated: false,
      msg: 'invalid data or token',
    });
  }
};

const deleteoneKanban = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (verifyToken) {
      const data = req.body;

      const deleteBoard = await Kanban.findByIdAndDelete({
        _id: data._id,
        userid: verifyToken._id,
      });

      res
        .status(200)
        .json({ code: 200, isDeleted: true, boardData: deleteBoard });
    } else {
      res
        .status(400)
        .json({ code: 400, isDeleted: false, msg: 'invallid data or token' });
    }
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ code: 400, isDeleted: false, msg: 'invallid data or token' });
  }
};

module.exports = {
  createKanban,
  findAllKanban,
  findByNameKanban,
  updateoneKanban,
  deleteoneKanban,
};
