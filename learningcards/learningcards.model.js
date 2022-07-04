const mongoose = require('mongoose');

const learningCardsSchema = mongoose.Schema({
  cardtopic: {
    type: String,
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  content: [
    {
      cardname: { type: String, required: true },
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      link: {
        type: String,
      },
    },
  ],
});

const LearningCard = new mongoose.model('learningcard', learningCardsSchema);

module.exports = LearningCard;
