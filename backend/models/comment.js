'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
      models.Comment.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false
        }
      });
    }
  };
  Comment.init({
    posts_id: DataTypes.INTEGER,
    users_id: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};