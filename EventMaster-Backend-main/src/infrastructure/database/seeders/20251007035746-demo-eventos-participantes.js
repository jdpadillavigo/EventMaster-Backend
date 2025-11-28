'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('EventoParticipante', [
      {
        evento_id: 1,
        participante_id: 1 // usuario 1 es ORGANIZADOR
      },
      {
        evento_id: 1,
        participante_id: 4 // usuario 2 es ASISTENTE
      },
      {
        evento_id: 2,
        participante_id: 3 // usuario 2 es ORGANIZADOR
      },
      {
        evento_id: 2,
        participante_id: 2 // usuario 1 es ASISTENTE
      },
      {
        evento_id: 3,
        participante_id: 5 // usuario 3 es ORGANIZADOR
      },
      {
        evento_id: 3,
        participante_id: 8 // usuario 4 es ASISTENTE
      },
      {
        evento_id: 4,
        participante_id: 5 // usuario 3 es ORGANIZADOR
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EventoParticipante', null, {});
  }
};
