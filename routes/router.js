const { Router } = require('express');
const {
  login,
  signup,
  authentication,
  logout,
} = require('../user/user.controller');

const {
  create,
  findAll,
  updateone,
  deleteone,
  findByName,
} = require('../kanban/kanban.controller');

const router = Router();

// account related routes
router.post('/accounts/signup', signup);
router.post('/accounts/login', login);
router.get('/accounts/authentication', authentication);
router.get('/accounts/logout', logout);

//goal related routes
router.post('/kanban/create', create);
router.get('/kanban/findall', findAll);
router.get('/kanban/findbyname', findByName);
router.put('/kanban/update', updateone);
router.delete('/kanban/delete', deleteone);

module.exports = router;
