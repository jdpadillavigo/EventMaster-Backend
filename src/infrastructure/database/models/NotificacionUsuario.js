'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NotificacionUsuario extends Model {
    static associate(models) {
      // NotificacionUsuario pertenece a una NotificacionAccion
      NotificacionUsuario.belongsTo(models.NotificacionAccion, {
        foreignKey: 'notificacion_accion_id',
        targetKey: 'notificacion_id',
        as: 'notificacion_accion' // el objetivo es la clave foranea
      });
      
      // NotificacionUsuario pertenece a un Usuario
      NotificacionUsuario.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
    }
  }
  
  NotificacionUsuario.init({
    notificacion_accion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'NotificacionAccion',
        key: 'notificacion_id'
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Usuario',
        key: 'usuario_id'
      }
    }
  }, {
    sequelize,
    modelName: 'NotificacionUsuario',
    tableName: 'NotificacionUsuario',
    timestamps: false
  });
  
  return NotificacionUsuario;
};