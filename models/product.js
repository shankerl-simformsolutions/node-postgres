'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize,  DataTypes) => {
  class Product extends Model {
    
  }
  Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: DataTypes.STRING,
    properties: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'Product',
    underscored: true,
  });
  return Product;
};