'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('EstadoInvitacion', [
      {
        estado_id: 1,
        nombre: 'Pendiente'
      },
      {
        estado_id: 2,
        nombre: 'Aceptada'
      },
      {
        estado_id: 3,
        nombre: 'Rechazada'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EstadoInvitacion', null, {});
  }
};
