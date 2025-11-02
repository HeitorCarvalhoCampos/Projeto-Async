const express = require('express');
const router = express.Router();
const IdeaController = require('../controllers/IdeaController');
const { isLoggedIn } = require('../middlewares/authMiddleware');
const isAuthor = require('../middlewares/authorMiddleware');

router.get('/', IdeaController.list);
router.get('/create', isLoggedIn, IdeaController.createPage);
router.post('/create', isLoggedIn, IdeaController.create);
router.get('/:id', IdeaController.details);
router.get('/:id/edit', isLoggedIn, isAuthor, IdeaController.editPage);
router.post('/:id/edit', isLoggedIn, isAuthor, IdeaController.update);
router.post('/:id/delete', isLoggedIn, isAuthor, IdeaController.delete);

module.exports = router;
