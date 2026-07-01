const express = require('express');
const { register, login, addFavorite, deleteFavorite, getFavorite, getFavorites, getPreferences, updatePreferences } = require('../controllers/userController.js');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/addfavorite', addFavorite);
router.post('/deletefavorite', deleteFavorite);
router.get('/getfavorite/:id', getFavorite);
router.get('/getfavorites/:id', getFavorites);
router.get('/getpreferences/:id', getPreferences);
router.post('/updatepreferences/:id', updatePreferences);

module.exports = router;
