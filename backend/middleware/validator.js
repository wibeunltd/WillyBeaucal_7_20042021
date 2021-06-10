// Déclarations des modules requis
const validator = require('validator');

//Mot de passe fort
exports.password = (req, res, next) => {
    if(!validator.isStrongPassword(req.body.password, {minLength: 8, minLowercase: 1, 
        minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
        res.status(400).json({error: 'Votre mot de passe doit contenir au minimum 8 caractères, dont 1 chiffre, 1 minuscule, 1 majuscule, 1 symbole' })
    } else {
        res.status(200).json({ message: 'Un mot de passe fort, affaiblit sa découverte !' })
        next();
    }
};

// Email
exports.mail = (req, res, next) => {
    if(!validator.isEmail(req.body.email)) {
        res.status(400).json({error: 'Merci d\'entrer une adresse mail valide !' })
    } else {
        next();
    }
};