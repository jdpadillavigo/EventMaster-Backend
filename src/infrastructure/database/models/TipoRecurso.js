'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoRecurso extends Model {
    static associate(models) {
      // Un tipo de recurso puede estar en muchos recursos
      TipoRecurso.hasMany(models.Recurso, {
        foreignKey: 'tipo_recurso',
        as: 'recursos'
      });
    }
  }

  TipoRecurso.init({
    tipo_recurso_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'TipoRecurso',
    tableName: 'TipoRecurso',
    timestamps: false
  });

  return TipoRecurso;
};