'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('EventoParticipante', [
      {
        evento_id: 1,
        participante_id: 1 // Juan como organizador del evento 1
      },
      {
        evento_id: 1,
        participante_id: 2 // María como participante del evento 1
      },
      {
        evento_id: 2,
        participante_id: 2 // María como participante del evento 2
      },
      {
        evento_id: 2,
        participante_id: 3 // Carlos como moderador del evento 2
      },
      {
        evento_id: 3,
        participante_id: 1 // Juan como organizador del evento 3
      },
      {
        evento_id: 3,
        participante_id: 4 // Juan también como participante del evento 3
      },
      {
        evento_id: 4,
        participante_id: 3 // Carlos como moderador del evento 4
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EventoParticipante', null, {});
  }
};
