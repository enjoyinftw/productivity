const express = require('express');
const cors = require('cors');
const router = require('./routes/router.js');
const cookieparser = require('cookie-parser');
const app = express();

const corsOptions = {
  credentials: true,
  origin: ['https://gregarious-cocada-c96629.netlify.app'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use('/api/v1', router);

module.exports = app;
