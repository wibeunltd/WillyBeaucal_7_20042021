// Déclarations des modules requis
const passwordValidator = require('password-validator');

// Création du schéma du mot de passe
const pwdSchema = new passwordValidator();

//Ajout des propriétés au schéma
pwdSchema
.is().min(8)                    //Contient minimum 8 caractères
.is().max(64)                   //Contient maximum 64 caractères
.has().uppercase()              //Contient minimum 1 majuscule
.has().lowercase()              //Contient minimum 1 minuscule
.has().digits()                 //Contient minimum 1 chiffre
.has().symbols()                //Contient minimum 1 symbole
.has().not().spaces();          //Ne contient pas d'espace

exports.validation = (req, res, next) => {
    if (!pwdSchema.validate(req.body.password)) {
        res.status(400).json({error: 'Votre mot de passe doit contenir au minimum 8 caractères, dont 1 chiffre, 1 minuscule, 1 majuscule, 1 symbole'})
    } else {
        next();
    }
};