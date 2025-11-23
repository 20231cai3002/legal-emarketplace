const express = require('express');
const router = express.Router();
const { registerCitizen, registerProvider, login } = require('../controllers/authController');

router.post('/register/citizen', registerCitizen);
router.post('/register/provider', registerProvider);
router.post('/login', login);

module.exports = router;