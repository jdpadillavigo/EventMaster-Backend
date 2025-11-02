'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('EventoParticipante', {
      evento_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Evento',
          key: 'evento_id'
        }
      },
      participante_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Participante',
          key: 'participante_id'
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('EventoParticipante');
  }
};
