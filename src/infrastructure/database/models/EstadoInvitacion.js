'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EstadoInvitacion extends Model {
    static associate(models) {
      // Un estado puede tener muchas invitaciones de usuario
      EstadoInvitacion.hasMany(models.InvitacionUsuario, {
        foreignKey: 'estado_invitacion_id',
        as: 'invitacionesUsuario'
      });
    }
  }
  
  EstadoInvitacion.init({
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
    modelName: 'EstadoInvitacion',
    tableName: 'EstadoInvitacion',
    timestamps: false
  });
  
  return EstadoInvitacion;
};
