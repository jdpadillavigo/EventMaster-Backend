'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Rol', [
      {
        rol_id: 1,
        nombre: 'Organizador'
      },
      {
        rol_id: 2,
        nombre: 'Asistente'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Rol', null, {});
  }
};
