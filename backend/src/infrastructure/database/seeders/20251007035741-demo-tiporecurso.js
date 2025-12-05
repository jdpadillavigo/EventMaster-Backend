'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TipoRecurso', [
      {
        tipo_recurso_id: 1,
        nombre: 'ARCHIVO'
      },
      {
        tipo_recurso_id: 2,
        nombre: 'ENLACE'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TipoRecurso', null, {});
  }
};
