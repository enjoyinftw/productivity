const LearningCard = require('./learningcards.model');
const jwt = require('jsonwebtoken');

const createLearningCard = async (req, res) => {
  try {
    const data = req.body;
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (verifyToken) {
      const fullData = {
        ...data,
        userid: verifyToken._id,
      };
      const learningCard = new LearningCard(fullData);
      await learningCard.save();

      res
        .status(201)
        .json({ code: 201, isCreated: true, cardData: learningCard });
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

const findAllLearningCard = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (verifyToken) {
      const cardInfo = await LearningCard.find({ userid: verifyToken._id });
      res.status(200).json({ code: 200, isFound: true, cardData: cardInfo });
    } else {
      res.status(400).json({
        code: 400,
        isFound: false,
        msg: 'invalid token',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      code: 400,
      isFound: false,
      msg: 'invalid token',
    });
  }
};

const findByTopicLearningCard = async (req, res) => {
  try {
    const { cardtopic } = req.body;
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (verifyToken) {
      const cardInfo = await LearningCard.find({
        userid: verifyToken._id,
        cardtopic: cardtopic,
      });
      if (cardInfo) {
        res.status(200).json({
          code: 200,
          isFound: true,
          cardData: cardInfo,
        });
      } else {
        res.status(400).json({
          code: 400,
          isFound: false,
          msg: 'invalid request',
        });
      }
    } else {
      res.status(400).json({
        code: 400,
        isFound: false,
        msg: 'invalid request',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      code: 400,
      isFound: false,
      msg: 'invalid request',
    });
  }
};

const updateoneLearningCard = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (verifyToken) {
      const data = req.body;
      const cardInfo = await LearningCard.findOneAndUpdate(
        {
          _id: data._id,
          userid: verifyToken._id,
        },
        {
          $set: {
            cardtopic: data.cardtopic,
            content: data.content,
          },
        },
        { new: true }
      );
      res.status(200).json({ code: 200, isUpdated: true, cardData: cardInfo });
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

const deleteoneLearningCard = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (verifyToken) {
      const data = req.body;
      const deleteCard = await LearningCard.findByIdAndDelete({
        _id: data._id,
        userid: verifyToken._id,
      });
      res
        .status(200)
        .json({ code: 200, isDeleted: true, cardData: deleteCard });
    } else {
      res
        .status(400)
        .json({ code: 400, isDeleted: false, msg: 'invalid data or token' });
    }
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ code: 400, isDeleted: false, msg: 'invalid data or token' });
  }
};

module.exports = {
  createLearningCard,
  findAllLearningCard,
  findByTopicLearningCard,
  updateoneLearningCard,
  deleteoneLearningCard,
};
