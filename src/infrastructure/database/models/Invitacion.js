'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invitacion extends Model {
    static associate(models) {
      // Una invitación pertenece a una notificación
      Invitacion.belongsTo(models.Notificacion, {
        foreignKey: 'notificacion_id',
        as: 'notificacion'
      });
      
      // Una invitación puede tener muchas invitaciones de usuario
      Invitacion.hasMany(models.InvitacionUsuario, {
        foreignKey: 'invitacion_id',
        sourceKey: 'notificacion_id', // la fuente es la clave foránea
        as: 'invitacionesUsuario'
      });
    }
  }
  
  Invitacion.init({
    notificacion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Notificacion',
        key: 'notificacion_id'
      }
    },
    fechaLimite: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Invitacion',
    tableName: 'Invitacion',
    timestamps: false
  });
  
  return Invitacion;
};
