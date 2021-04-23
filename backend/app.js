// Déclarations des modules requis 
const express = require('express');
const helmet = require('helmet');
const path = require('path');

// Création de l'instance de l'application
const app = express();

// Test routes
app.use('/', (req, res, next) => {
  console.log('ok');
res.status(200).json({ message: 'Requête bien reçue !' })
});

// Sécurisation contre les attaques XSS
app.use(helmet());

// Permission des requêtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Extraction des données JSON du corps de requête
app.use(express.json());

module.exports = app;