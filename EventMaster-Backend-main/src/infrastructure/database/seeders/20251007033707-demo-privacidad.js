'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Privacidad', [
      {
        privacidad_id: 1,
        nombre: 'Publico'
      },
      {
        privacidad_id: 2,
        nombre: 'Privado'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Privacidad', null, {});
  }
};
