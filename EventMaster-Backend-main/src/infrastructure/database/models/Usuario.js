'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Un usuario puede tener muchas invitaciones de usuario
      Usuario.hasMany(models.InvitacionUsuario, {
        foreignKey: 'usuario_id',
        as: 'invitacionesUsuario'
      });

      // Un usuario puede tener muchas notificaciones
      Usuario.belongsToMany(models.NotificacionAccion, {
        through: models.NotificacionUsuario,
        foreignKey: 'usuario_id',
        as: 'notificacionesUsuario'
      });
      
      // Un usuario puede ser un cliente
      Usuario.hasOne(models.Cliente, {
        foreignKey: 'usuario_id',
        as: 'cliente'
      });
      
      // Un usuario puede tener muchos participantes (por diferentes roles)
      Usuario.hasMany(models.Participante, {
        foreignKey: 'usuario_id',
        as: 'participantes'
      });
    }
  }
  
  Usuario.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    clave: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    activation_token: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    token_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuario',
    timestamps: false
  });
  
  return Usuario;
};
