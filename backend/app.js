// Déclarations des modules requis 
const express = require('express');
const helmet  = require('helmet');
const path    = require('path');

// Sécurisation des variables d'environnement par un stockage séparé
require('dotenv').config();

// Déclarations des routes
const userRoutes  = require('./routes/userRoutes');

// Création de l'instance de l'application
const app = express();

// Sécurisation contre les attaques XSS
app.use(helmet());

// Permission des requêtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080/');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Extraction des données JSON du corps de requête
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gestion du dossier de sauvegarde des images uploadées
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes utilisateurs
app.use('/api/users/', userRoutes);

module.exports = app;