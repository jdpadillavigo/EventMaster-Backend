'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recurso extends Model {
    static associate(models) {
      // Un recurso pertenece a un tipo de recurso
      Recurso.belongsTo(models.TipoRecurso, {
        foreignKey: 'tipo_recurso',
        as: 'tipo'
      });
      
      // Un recurso pertenece a un evento
      Recurso.belongsTo(models.Evento, {
        foreignKey: 'evento_id',
        as: 'evento'
      });
    }
  }

  Recurso.init({
    recurso_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    tipo_recurso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TipoRecurso',
        key: 'tipo_recurso_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    evento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Evento',
        key: 'evento_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Recurso',
    tableName: 'Recurso',
    timestamps: false
  });

  return Recurso;
};