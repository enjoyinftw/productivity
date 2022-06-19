const express = require('express');
const cors = require('cors');
const router = require('./routes/router.js');
const cookieparser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use('/api/v1', router);

module.exports = app;
