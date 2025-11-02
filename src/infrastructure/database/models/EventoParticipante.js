'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventoParticipante extends Model {
    static associate(models) {
      // EventoParticipante pertenece a Evento
      EventoParticipante.belongsTo(models.Evento, {
        foreignKey: 'evento_id',
        as: 'evento'
      });
      
      // EventoParticipante pertenece a Participante
      EventoParticipante.belongsTo(models.Participante, {
        foreignKey: 'participante_id',
        as: 'participante'
      });
    }
  }
  
  EventoParticipante.init({
    evento_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Evento',
        key: 'evento_id'
      }
    },
    participante_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Participante',
        key: 'participante_id'
      }
    }
  }, {
    sequelize,
    modelName: 'EventoParticipante',
    tableName: 'EventoParticipante',
    timestamps: false
  });
  
  return EventoParticipante;
};
