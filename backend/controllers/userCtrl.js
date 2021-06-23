// Déclarations des modules requis
const bcrypt    = require('bcrypt');
const userAuth  = require('../middleware/userAuth');
const { User }  = require('../models');

// Sécurisation des variables d'environnement par un stockage séparé
require('dotenv').config();

// Regex
const emailRegex     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex  = /^(?=.*\d).{4,8}$/;

// Inscription d'un nouvel utilisateur
exports.register = (req, res, next) => {
    // Variables
    let username    = req.body.username;
    let email       = req.body.email;
    let password    = req.body.password;
    
    //Vérification des variables
    if (username == null || email == null || password == null) {
        return res.status(400).json({'error' : 'Merci de remplir l\'ensemble des champs'});
    }

    if (username.length >= 13 || username.length <= 4) {
        return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
    }
  
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 'error': 'email is not valid' });
    }
  
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
    }

    User.findOne({
        attributes: ['email'],
        where: { email: email}
    })
    .then(userFound => {
        if(!userFound) {
            bcrypt.hash(password, 10)
            .then(hash => {
                const user = User.create({
                    username    : username,
                    email       : email,
                    password    : hash,
                    isAdmin     : false,
                })
                .then(newUser => {
                    return res.status(201).json({
                        'message': 'Utilisateur créé',
                        'userId': newUser.id
                    })
                })
                .catch(error => {
                    return res.status(500).json({ 'error': 'Impossible d\'ajouter l\'utilisateur, veuillez choisir un autre nom d\'utilisateur'});
                });
            })
            .catch(error => res.status(500).json({ error }));

        } else {
            return res.status(409).json({'error': 'L\'utilisateur existe deja'})
        }
    })
    .catch(err => res.status(500).json({ 'error': 'Impossible de vérifier le status de l\'utilisateur' }));
};

// Connexion d'un utilisateur existant
exports.login = (req, res, next) => {

    // Variables
    let email       = req.body.email;
    let password    = req.body.password;
    
    // Vérification des variables
    if (email == null || password == null) {
        return res.status(400).json({'error' : 'Merci de remplir l\'ensemble des champs'});
    }

   User.findOne({
    where: { email: email}
    })
    .then(userFound => {
        if(userFound) {
            bcrypt.compare(password, userFound.password)
            .then(valid => {
                if(valid) {
                    return res.status(200).json({
                        'userId': userFound.id,
                        'token': userAuth.generateToken(userFound)
                    });
                } else {
                    return res.status(401).json({ 'error' : 'Mot de passe incorrect !' });
                }
            })
        } else {
            return res.status(404).json({ 'error': 'Utilisateur non trouvé' })
        }

    })
    .catch(err => res.status(500).json({ 'error': 'Impossible de vérifier le status de l\'utilisateur' }));
};

// Récupération d'un profil utilisateur
exports.getUser = (req, res, next) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = userAuth.getUserId(headerAuth);

    if (userId < 0)
      return res.status(400).json({ 'error': 'wrong token' });

   User.findOne({
      attributes: [ 'id', 'email', 'username', 'biography' ],
      where: { id: userId }
    }).then(function(user) {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    }).catch(function(err) {
      res.status(500).json({ 'error': 'cannot fetch user' });
    });
};

// Mettre à jour un profil utilisateur
exports.updatetUser = (req, res, next) => {
    // Getting auth header
    const headerAuth  = req.headers['authorization'];
    const userId      = userAuth.getUserId(headerAuth);

    // Params
    const biography = req.body.biography;

    User.findOne({
        attributes: [ 'id', 'email', 'username', 'biography' ],
        where: { id: userId }
    })
    .then(userFound => {
        if(userFound) {
            userFound.update({
                email: (email ? email : userFound.email),
                username: (username ? username : userFound.username),
                biography: (biography ? biography : userFound.biography)
            }) 
        } else {
            res.status(404).json({ 'error': 'user not found' });
        }
    })
    .catch(err => res.status(500).json({ 'error': 'cannot update user' }));
};