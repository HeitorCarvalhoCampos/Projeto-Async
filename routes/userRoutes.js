const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.get('/register', UserController.registerPage);
router.post('/register', UserController.register);
router.get('/login', UserController.loginPage);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.get('/profile', isLoggedIn, UserController.profilePage);

module.exports = router;
