'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rol extends Model {
    static associate(models) {
      // Un rol puede tener muchos participantes
      Rol.hasMany(models.Participante, {
        foreignKey: 'rol_id',
        as: 'participantes'
      });
    }
  }
  
  Rol.init({
    rol_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Rol',
    tableName: 'Rol',
    timestamps: false
  });
  
  return Rol;
};
