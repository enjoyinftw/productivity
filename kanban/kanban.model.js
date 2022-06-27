const mongoose = require('mongoose');

const kanbanSchema = mongoose.Schema({
  name: {
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
      columnname: {
        type: String,
        required: true,
      },
      columnitems: [
        {
          itemname: String,
          itemdescription: String,
        },
      ],
    },
  ],
});

const Kanban = new mongoose.model('kanban', kanbanSchema);

module.exports = Kanban;
