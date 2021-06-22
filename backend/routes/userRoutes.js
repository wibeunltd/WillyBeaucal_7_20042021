// Déclarations des modules requis
const express   = require('express');
const router    = express.Router();

// Déclaration et import du controller user
const userCtrl = require('../controllers/userCtrl');


// Gestion de l'entrée d'un mot de passe fort


// Gestion du nombre de requêtes utilisateurs
const accountLimiter = require('../middleware/account-limit-requests');

// Routes users
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/profile', userCtrl.getUser);
router.put('/profile', userCtrl.updatetUser);

module.exports = router;