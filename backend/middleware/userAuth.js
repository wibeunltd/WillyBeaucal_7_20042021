// Déclarations des modules requis
const jwt = require('jsonwebtoken');

// Sécurisation des variables d'environnement par un stockage séparé
require('dotenv').config();

module.exports = {
  /** Création du token */
    generateToken: function(userData) {
        return jwt.sign({
          userId: userData.id,
          isAdmin: userData.isAdmin
        },
        process.env.JWT_TOKEN,
        {
          expiresIn: '1h'
        })
      },
  /** Vérification de l'autorisation : token et id utilisateur */
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
      },
    getUserId: function(authorization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if(token != null) {
          try {
            var jwtToken = jwt.verify(token, process.env.JWT_TOKEN);
            if(jwtToken != null)
              userId = jwtToken.userId;
          } catch(err) { }
        }
        return userId;
    }
}