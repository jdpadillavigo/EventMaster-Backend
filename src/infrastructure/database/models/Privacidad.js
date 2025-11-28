'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Privacidad extends Model {
    static associate(models) {
      // Una privacidad puede tener muchos eventos
      Privacidad.hasMany(models.Evento, {
        foreignKey: 'privacidad',
        as: 'eventos'
      });
    }
  }
  
  Privacidad.init({
    privacidad_id: {
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
    modelName: 'Privacidad',
    tableName: 'Privacidad',
    timestamps: false
  });
  
  return Privacidad;
};
