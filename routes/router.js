const { Router } = require('express');
const {
  login,
  signup,
  authentication,
  logout,
} = require('../user/user.controller');

const {
  createKanban,
  findAllKanban,
  updateoneKanban,
  deleteoneKanban,
  findByNameKanban,
} = require('../kanban/kanban.controller');

const {
  createLearningCard,
  findAllLearningCard,
  findByTopicLearningCard,
  updateoneLearningCard,
  deleteoneLearningCard,
} = require('../learningcards/learningcards.controller');

const router = Router();

// account related routes
router.post('/accounts/signup', signup);
router.post('/accounts/login', login);
router.get('/accounts/authentication', authentication);
router.get('/accounts/logout', logout);

//kanban related routes
router.post('/kanban/create', createKanban);
router.get('/kanban/findall', findAllKanban);
router.get('/kanban/findbyname', findByNameKanban);
router.put('/kanban/updateone', updateoneKanban);
router.delete('/kanban/delete', deleteoneKanban);

//learningcards related routes
router.post('/learningcards/create', createLearningCard);
router.get('/learningcards/findall', findAllLearningCard);
router.get('/learningcards/findbytopic', findByTopicLearningCard);
router.put('/learningcards/updateone', updateoneLearningCard);
router.delete('/learningcards/delete', deleteoneLearningCard);

module.exports = router;
