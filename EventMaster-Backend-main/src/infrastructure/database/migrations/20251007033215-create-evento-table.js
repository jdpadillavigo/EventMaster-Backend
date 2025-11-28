'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Evento', {
      evento_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      titulo: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(300),
        allowNull: true
      },
      fechaInicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fechaFin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      imagen: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      nroParticipantes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      aforo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      estadoEvento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'EstadoEvento',
          key: 'estado_id'
        }
      },
      privacidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Privacidad',
          key: 'privacidad_id'
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Evento');
  }
};
