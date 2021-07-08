/** Déclarations des modules requis */
const bcrypt    = require('bcrypt');
const userAuth  = require('../middleware/userAuth');
const { User }  = require('../models');


/** Sécurisation des variables d'environnement par un stockage séparé */ 
require('dotenv').config();

/** Inscription d'un nouvel utilisateur
 * @type {{firstname: string, lastname: string, email: string, password: string}}
 * */ 
exports.register = (req, res, next) => {
    /** Informations utilisateur */
    const { firstname, lastname, email, password } = req.body;
   
    /** Vérification de l'utilisateur */
    User.findOne({
        attributes: ['email'],
        where: { email: email }
    })
    .then(userFound => {
        if(!userFound) {
            bcrypt.hash(password, 10)
            .then(hash => {
                const user = User.create({
                    firstname       : firstname,
                    lastname        : lastname,
                    email           : email,
                    password        : hash,
                    profilePicture  : "https://eu.ui-avatars.com/api/?background=random&name=" + firstname + "+" + lastname,
                    isAdmin         : false,
                })
                .then(newUser => {
                    return res.status(201).json({
                        'message': 'Inscription réalisée avec succès',
                        'User ID': newUser.id
                    })
                })
                .catch(error => {
                    return res.status(500).json({ 'error': 'Impossible d\'effectuer l\'inscription, renouveler la demande ou rapprochez d\'un administrateur.'});
                });
            })
            .catch(error => res.status(500).json({ error }));

        } else {
                return res.status(409).json({'error': 'L\'adresse email saisie ne peut être pas utilisée, merci d\'en choisir une autre.'})
        }
    })
    .catch(err => res.status(500).json({ 'error': 'Problème de connexion au serveur, impossible de vérifier le status de l\'inscription.' }));
};

/** Connexion d'un utilisateur existant
 * @type {{email: string, password: string}} 
*/
exports.login = (req, res, next) => {

    /** Informations utilisateur */
    const { email, password } = req.body;
    
    /** Vérification de l'utilisateur */
    User.findOne({
    where: { email: email }
    })
    .then(userFound => {
        if(userFound) {
            bcrypt.compare(password, userFound.password)
            .then(valid => {
                if (valid) {
                    return res.status(200).json({
                        'User ID'       : userFound.id,
                        'User Lastname' : userFound.lastname,
                        'User Firstname': userFound.firstname,
                        'Last Login'    : userFound.lastLogin,
                        'Created at'    : userFound.createdAt,
                        'Updated at'    : userFound.updatedAt,
                        'Token'         : userAuth.generateToken(userFound)
                    });
                } else {
                    return res.status(401).json({ 'error' : 'Mot de passe incorrect !' });
                }
            })
        } else {
            return res.status(404).json({ 'error': 'Utilisateur non trouvé' })
        }

    })
    .catch(err => res.status(500).json({ 'error': 'Problème de connexion au serveur, impossible d\'effectuer la connexion' }));
};

/** Récupération d'un profil utilisateur
 * @param {{userId}}
 * @param {{token}}
*/
exports.getUser = (req, res, next) => {
    /** Récupération et vérification du token d'authentification */ 
    const headerAuth  = req.headers['authorization'];
    const userId      = userAuth.getUserId(headerAuth);

    if (userId < 0)
      return res.status(400).json({ 'error': 'Token non valide' });

    User.findOne({
      attributes: [ 'id', 'firstname', 'lastname', 'email', 'lastLogin', 'biography', 'isAdmin', 'companyServices', 'coverPicture', 'profilePicture', 'createdAt', 'updatedAt' ],
      where: { id: userId }
    }).then(function(user) {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ 'error': 'Utilisateur non trouvé' });
      }
    }).catch(function(err) {
      res.status(500).json({ 'error': 'Problème de connexion au serveur, impossible de récupérer les informations de l\'utilisateur' });
    });
};

/** Mise à jour d'un profil utilisateur
 @param {{userId}}
 @param {{token}}
*/
exports.updatetUser = (req, res, next) => {
    /** Récupération et vérification du token d'authentification */
    const headerAuth  = req.headers['authorization'];
    const userId      = userAuth.getUserId(headerAuth);

    /** Informations utilisateur */
    const { firstname, lastname, email, password, biography, companyServices, coverPicture, profilePicture } = req.body;

    User.findOne({
        attributes: [ 'id', 'firstname', 'lastname', 'email', 'biography', 'companyServices', 'coverPicture', 'profilePicture' ],
        where: { id: userId }
    })
    .then(userFound => {
        if(userFound) {
            userFound.update({
                firstname       : (firstname ? firstname : userFound.firstname),
                lastname        : (lastname ? lastname : userFound.lastname),
                email           : (email ? email : userFound.email),
                password        : (password ? password : userFound.password),
                biography       : (biography ? biography : userFound.biography),
                companyServices : (companyServices ? companyServices : userFound.companyServices),
                coverPicture    : (coverPicture ? coverPicture : userFound.coverPicture),
                profilePicture  : (profilePicture ? profilePicture : userFound.profilePicture)
            })
            .then(userFound => {
                return res.status(201).json(userFound);
            })
            .catch(error => {
                return res.status(500).json({ 'error': 'Impossible de mettre à jour l\'utilisateur.' })
            })
        } else {
            res.status(404).json({ 'error': 'Utilisateur non trouvé' });
        }
    })
    .catch(err => res.status(500).json({ 'error': 'Problème de connexion au serveur, impossible de mettre à jour les informations de l\'utilisateur' }));
};