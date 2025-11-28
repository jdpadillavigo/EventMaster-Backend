'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TipoRecurso', [
      {
        tipo_recurso_id: 1,
        nombre: 'DOCUMENTO'
      },
      {
        tipo_recurso_id: 2,
        nombre: 'ENLACE'
      },
      {
        tipo_recurso_id: 3,
        nombre: 'IMAGEN'
      },
      {
        tipo_recurso_id: 4,
        nombre: 'VIDEO'
      },
      {
        tipo_recurso_id: 5,
        nombre: 'OTRO'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TipoRecurso', null, {});
  }
};
