// Modules requis
const router   = require('express').Router();

// Controller initialization
const initCtrl = require('../controllers/initCtrl');

// Route initialization
router.get('/', initCtrl.init);

module.exports = router;