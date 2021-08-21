// Modules requis 
const express = require('express');
const morgan  = require('morgan');
const helmet  = require('helmet');
const cors    = require('cors');
const path    = require('path');

// Variables d'environnement
require('dotenv').config();

// Instanciation de l'application
const app = express();

app
.use(express.json())
.use(express.urlencoded({ extended: true }))
.use(morgan('dev'))
.use(helmet())
.use(cors())
.use('/images', express.static(path.join(__dirname, 'images')))

// Requêtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Déclarations des routes
const userRoutes  = require('./routes/userRoutes');

// Route initialisation
app.get('/', (req,res) => {
  res.json(`Backend du réseau social Moments de Groupomania 😎`)
})

// Routes utilisateurs
app.use('/api/users/', userRoutes);

//Gestion des erreurs 404
app.use(({ res }) => {
  const message = `Désolé, la ressource demandée n'est plus disponible à cette adresse, où n'existe plus. Merci de revenir à la page d'accueil.`
  res.status(404).json({ message })
})

module.exports = app;