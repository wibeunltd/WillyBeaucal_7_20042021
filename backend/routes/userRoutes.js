// Modules requis
const router  = require('express').Router();

// Controller user
const userCtrl = require('../controllers/userCtrl');

// Middleware loggedIn
const auth    = require('../middleware/userAuth')

// Règles de validations
const { registerValidationRules, loginValidationRules, validate } = require('../middleware/userValidator');

// Gestion du nombre de requêtes utilisateurs
const accountLimiter = require('../middleware/account-limit-requests');

// Routes users
router.post('/register', registerValidationRules(), validate, userCtrl.register);
router.get('/verify/:userId/:token', userCtrl.verifyUserAccount)
router.post('/login', loginValidationRules(), validate, userCtrl.login);
router.get('/profile', userCtrl.getUser);
router.put('/profile', userCtrl.updateUser);

module.exports = router;