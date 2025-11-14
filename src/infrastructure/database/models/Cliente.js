'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    static associate(models) {
      // Un cliente pertenece a un usuario
      Cliente.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
        onDelete: 'CASCADE'
      });
    }
  }
  
  Cliente.init({
    cliente_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    foto_perfil: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'URL o base64 de la foto de perfil (puede exceder 255 chars)'
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'usuario_id'
      },
      unique: true // Un usuario solo puede ser un cliente
    }
  }, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'Cliente',
    timestamps: false
  });
  
  return Cliente;
};
