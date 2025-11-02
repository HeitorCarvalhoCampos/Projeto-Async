const express = require('express');
const router = express.Router();
const VoteController = require('../controllers/VoteController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.post('/:id', isLoggedIn, VoteController.toggleVote);

module.exports = router;
