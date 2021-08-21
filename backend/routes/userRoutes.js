// Déclarations des modules requis
const express   = require('express');
const router    = express.Router();

// Déclaration et import du controller user
const userCtrl = require('../controllers/userCtrl');

const { registerValidationRules, loginValidationRules, validate } = require('../middleware/userValidator');

// Gestion du nombre de requêtes utilisateurs
const accountLimiter = require('../middleware/account-limit-requests');

// Routes users
router.post('/register', registerValidationRules(), validate, userCtrl.register);
router.post('/login', loginValidationRules(), validate, userCtrl.login);
router.get('/profile', userCtrl.getUser);
router.put('/profile', userCtrl.updateUser);

module.exports = router;