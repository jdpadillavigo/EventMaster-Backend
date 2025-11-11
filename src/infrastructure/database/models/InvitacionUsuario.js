'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InvitacionUsuario extends Model {
    static associate(models) {
      // Una invitación de usuario pertenece a un usuario
      InvitacionUsuario.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Una invitación de usuario pertenece a un estado
      InvitacionUsuario.belongsTo(models.EstadoInvitacion, {
        foreignKey: 'estado_invitacion_id',
        as: 'estado'
      });
      
      // Una invitación de usuario pertenece a una invitación
      InvitacionUsuario.belongsTo(models.Invitacion, {
        foreignKey: 'invitacion_id',
        targetKey: 'notificacion_id', // el objetivo es la clave foránea
        as: 'invitacion'
      });
    }
  }
  
  InvitacionUsuario.init({
    invitacion_usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estado_invitacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'EstadoInvitacion',
        key: 'estado_id'
      }
    },
    invitacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Invitacion',
        key: 'notificacion_id'
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'usuario_id'
      }
    }
  }, {
    sequelize,
    modelName: 'InvitacionUsuario',
    tableName: 'InvitacionUsuario',
    timestamps: false
  });
  
  return InvitacionUsuario;
};
