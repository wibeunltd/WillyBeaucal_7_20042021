/** Déclarations des modules requis */
const { body, validationResult } = require('express-validator');

/** Règles de validation pour l'inscription */
exports.registerValidationRules = () => {
    return [
        body('firstname')
            .notEmpty().withMessage('Le prénom est obligatoire, le champ ne peut pas être vide.')
            .isLength({ min: 3, max: 40 }).withMessage('Le prénom doit contenir entre 3 et 40 caractères.')
            .custom((val) => /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]+$/i.test(val)).withMessage('Le prénom ne peut contenir que des lettres, des espaces, des traits d\'union.'),
        body('lastname')
            .notEmpty().withMessage('Le nom est obligatoire, le champ ne peut pas être vide.')
            .isLength({ min: 3, max: 40 }).withMessage('Le nom doit contenir 3 et 40 caractères.')
            .custom((val) => /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]+$/i.test(val)).withMessage('Le nom ne peut contenir que des lettres, des espaces, des traits d\'union.'),
        body('email')
            .notEmpty().withMessage('L\'email est obligatoire, le champ ne peut pas être vide.')
            .isEmail().withMessage('Merci de saisir une adresse email valide'),
        body('password')
            .notEmpty().withMessage('Le mot de passe est obligatoire, le champ ne peut pas être vide.')
            .isLength({ max: 32 }).withMessage('Le mot de passe ne peut pas excéder 32 caractères.')
            .isStrongPassword().withMessage('Le mot de passe doit être fort : soit 8 caractères minimum, 1 majuscule minimum,  1 symbole minimum, 1 chiffre minimum'),
        body('pwdConfirm')
            .notEmpty().withMessage('La confirmation du mot de passe est obligatoire, le champ ne peut pas être vide.')
            .custom((value, { req }) => value === req.body.password).withMessage('Le mot de passe de confirmation doit être identique au mot de passe entré.'),
    ]
};

/** Règles de validation pour la connexion */
exports.loginValidationRules = () => {
    return [
        body('email')
            .notEmpty().withMessage('L\'email est obligatoire, le champ ne peut pas être vide.')
            .isEmail().withMessage('Merci de saisir une adresse email valide'),
        body('password')
            .notEmpty().withMessage('Le mot de passe est obligatoire, le champ ne peut pas être vide.')
            .isStrongPassword().withMessage('Le mot de passe doit être fort : soit 8 caractères minimum, 1 majuscule minimum,  1 symbole minimum, 1 chiffre minimum'),
    ]
};

/** Retour erreurs des règles de validation */
exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            rulesValidationErrors: errors.array()
        });
    } else {
        return next();
    }
};