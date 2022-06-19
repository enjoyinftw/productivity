const express = require('express');
const cors = require('cors');
const router = require('./routes/router.js');
const cookieparser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: 'https://gregarious-cocada-c96629.netlify.app',
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use('/api/v1', router);

module.exports = app;
