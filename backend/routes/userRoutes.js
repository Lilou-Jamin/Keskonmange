const express = require('express');
const { register, login, addFavorite, deleteFavorite, getFavorite } = require('../controllers/userController.js');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/addfavorite', addFavorite);
router.post('/deletefavorite', deleteFavorite);
router.get('/getfavorite/:id', getFavorite);

module.exports = router;
