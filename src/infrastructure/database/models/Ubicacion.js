'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ubicacion extends Model {
    static associate(models) {
      // Una ubicación pertenece a un evento
      Ubicacion.belongsTo(models.Evento, {
        foreignKey: 'evento_id',
        as: 'evento',
        onDelete: 'CASCADE'
      });
    }
  }
  
  Ubicacion.init({
    ubicacion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    latitud: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitud: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    evento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Evento',
        key: 'evento_id'
      },
      unique: true // Un evento solo puede tener una ubicación
    }
  }, {
    sequelize,
    modelName: 'Ubicacion',
    tableName: 'Ubicacion',
    timestamps: false
  });
  
  return Ubicacion;
};
