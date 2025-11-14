'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notificacion extends Model {
    static associate(models) {
      // Una notificación pertenece a un evento
      Notificacion.belongsTo(models.Evento, {
        foreignKey: 'evento_id',
        as: 'evento',
        onDelete: 'CASCADE'
      });
      
      // Una notificación puede tener una invitación
      Notificacion.hasOne(models.Invitacion, {
        foreignKey: 'notificacion_id',
        as: 'invitacion'
      });

      // Una notificación puede tener una notificación de acción
      Notificacion.hasOne(models.NotificacionAccion, {
        foreignKey: 'notificacion_id',
        as: 'notificacionAccion'
      });
    }
  }
  
  Notificacion.init({
    notificacion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false
    },
    evento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Evento',
        key: 'evento_id'
      }
    }
  }, {
    sequelize,
    modelName: 'Notificacion',
    tableName: 'Notificacion',
    timestamps: false
  });
  
  return Notificacion;
};
