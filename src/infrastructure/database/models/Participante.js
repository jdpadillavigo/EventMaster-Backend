'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Participante extends Model {
    static associate(models) {
      // Un participante pertenece a un usuario
      Participante.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Un participante tiene un rol
      Participante.belongsTo(models.Rol, {
        foreignKey: 'rol_id',
        as: 'rol'
      });

      // Un participante puede estar en muchos eventos (a través de EventoParticipante)
      Participante.belongsToMany(models.Evento, {
        through: models.EventoParticipante,
        foreignKey: 'participante_id',
        as: 'eventos'
      });
    }
  }
  
  Participante.init({
    participante_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'usuario_id'
      }
      // Removido unique: true para permitir múltiples participantes por usuario
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Rol',
        key: 'rol_id'
      }
    }
  }, {
    sequelize,
    modelName: 'Participante',
    tableName: 'Participante',
    timestamps: false
  });
  
  return Participante;
};
