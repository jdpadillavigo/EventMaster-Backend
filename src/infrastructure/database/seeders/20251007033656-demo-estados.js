'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('EstadoEvento', [
      {
        estado_id: 1,
        nombre: 'Programado'
      },
      {
        estado_id: 2,
        nombre: 'En curso'
      },
      {
        estado_id: 3,
        nombre: 'Finalizado'
      },
      {
        estado_id: 4,
        nombre: 'Cancelado'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EstadoEvento', null, {});
  }
};
