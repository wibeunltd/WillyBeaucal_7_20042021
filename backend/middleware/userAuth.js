// Modules requis
const jwt = require('jsonwebtoken');

// Variables d'environnement
require('dotenv').config();

exports.isLoggedIn = (req, res, next) => {
    try {
        const token = req.headers.authorization.split('')[1];
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN
        )
        req.userData = decoded;
        next();
    } catch (error) {
        const message = `Votre session n'est pas valide. Merci de vous connecter.`
        return res.status(401).json({ message, data: error})
    }
}