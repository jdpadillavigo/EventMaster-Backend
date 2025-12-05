'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Evento extends Model {
    static associate(models) {
      // Un evento puede tener muchas notificaciones
      Evento.hasMany(models.Notificacion, {
        foreignKey: 'evento_id',
        as: 'notificaciones'
      });

      // Un evento tiene una ubicación
      Evento.hasOne(models.Ubicacion, {
        foreignKey: 'evento_id',
        as: 'ubicacion'
      });

      // Un evento pertenece a un estado de evento
      Evento.belongsTo(models.EstadoEvento, {
        foreignKey: 'estadoEvento',
        as: 'estado'
      });

      // Un evento pertenece a una privacidad
      Evento.belongsTo(models.Privacidad, {
        foreignKey: 'privacidad',
        as: 'privacidadTipo'
      });

      // Un evento puede tener muchos participantes (a través de EventoParticipante)
      Evento.belongsToMany(models.Participante, {
        through: models.EventoParticipante,
        foreignKey: 'evento_id',
        as: 'participantes'
      });
    }
  }

  Evento.init({
    evento_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: false
    },
    imagen: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nroParticipantes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    aforo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    estadoEvento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'EstadoEvento',
        key: 'estado_id'
      }
    },
    privacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Privacidad',
        key: 'privacidad_id'
      }
    }
  }, {
    sequelize,
    modelName: 'Evento',
    tableName: 'Evento',
    timestamps: false
  });

  return Evento;
};
