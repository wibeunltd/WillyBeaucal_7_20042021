// Déclarations des modules requis
const express   = require('express');
const router    = express.Router();

// Déclaration et import du controller user
const userCtrl = require('../controllers/userCtrl');

// Gestion de l'entrée d'un mot de passe fort
const pwd = require('../middleware/password-validator')

// Gestion du nombre de requêtes utilisateurs
const accountLimiter = require('../middleware/account-limit-requests');

// Routes users
router.post('/register', pwd.validation, accountLimiter)
router.post('/login', accountLimiter)