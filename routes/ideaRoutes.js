const express = require('express');
const router = express.Router();
const IdeaController = require('../controllers/IdeaController');
const { isLoggedIn } = require('../middlewares/authMiddleware');
const { isAuthor } = require('../middlewares/authorMiddleware');

router.get('/', isLoggedIn, IdeaController.list);
router.get('/create', isLoggedIn, IdeaController.createPage);
router.post('/create', isLoggedIn, IdeaController.create);
router.get('/edit/:id', isLoggedIn, isAuthor, IdeaController.editPage);
router.post('/edit/:id', isLoggedIn, isAuthor, IdeaController.update);
router.post('/delete/:id', isLoggedIn, isAuthor, IdeaController.delete);
router.get('/:id', IdeaController.details);

module.exports = router;
