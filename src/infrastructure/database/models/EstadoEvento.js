'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EstadoEvento extends Model {
    static associate(models) {
      // Un estado de evento puede tener muchos eventos
      EstadoEvento.hasMany(models.Evento, {
        foreignKey: 'estadoEvento',
        as: 'eventos'
      });
    }
  }
  
  EstadoEvento.init({
    estado_id: {
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
    modelName: 'EstadoEvento',
    tableName: 'EstadoEvento',
    timestamps: false
  });
  
  return EstadoEvento;
};
