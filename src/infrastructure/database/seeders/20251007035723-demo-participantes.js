'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Participante', [
      // Usuario 1 - Ambos roles
      { usuario_id: 1, rol_id: 1 }, // ORGANIZADOR
      { usuario_id: 1, rol_id: 2 }, // ASISTENTE
      
      // Usuario 2 - Ambos roles
      { usuario_id: 2, rol_id: 1 }, // ORGANIZADOR
      { usuario_id: 2, rol_id: 2 }, // ASISTENTE
      
      // Usuario 3 - Ambos roles
      { usuario_id: 3, rol_id: 1 }, // ORGANIZADOR
      { usuario_id: 3, rol_id: 2 }, // ASISTENTE
      
      // Usuario 4 - Ambos roles
      { usuario_id: 4, rol_id: 1 }, // ORGANIZADOR
      { usuario_id: 4, rol_id: 2 }, // ASISTENTE
      
      // Usuario 5 - Ambos roles
      { usuario_id: 5, rol_id: 1 }, // ORGANIZADOR
      { usuario_id: 5, rol_id: 2 }, // ASISTENTE
      
      // Usuario 6 - Ambos roles
      { usuario_id: 6, rol_id: 1 }, // ORGANIZADOR
      { usuario_id: 6, rol_id: 2 }, // ASISTENTE
      
      // Usuario 7 - Ambos roles
      { usuario_id: 7, rol_id: 1 }, // ORGANIZADOR
      { usuario_id: 7, rol_id: 2 }, // ASISTENTE
      
      // Usuario 8 - Ambos roles
      { usuario_id: 8, rol_id: 1 }, // ORGANIZADOR
      { usuario_id: 8, rol_id: 2 }  // ASISTENTE
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Participante', null, {});
  }
};
