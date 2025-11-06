'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Participante', [
      // Usuario 1 - Ambos roles
      { usuario_id: 1, rol_id: 1 }, // ORGANIZADOR  id:1
      { usuario_id: 1, rol_id: 2 }, // ASISTENTE id:2
      
      // Usuario 2 - Ambos roles
      { usuario_id: 2, rol_id: 1 }, // ORGANIZADOR id:3
      { usuario_id: 2, rol_id: 2 }, // ASISTENTE id:4
      
      // Usuario 3 - Ambos roles
      { usuario_id: 3, rol_id: 1 }, // ORGANIZADOR id:5
      { usuario_id: 3, rol_id: 2 }, // ASISTENTE id:6
      
      // Usuario 4 - Ambos roles
      { usuario_id: 4, rol_id: 1 }, // ORGANIZADOR id:7
      { usuario_id: 4, rol_id: 2 }, // ASISTENTE id:8
      
      // Usuario 5 - Ambos roles
      { usuario_id: 5, rol_id: 1 }, // ORGANIZADOR id:9
      { usuario_id: 5, rol_id: 2 }, // ASISTENTE id:10
      
      // Usuario 6 - Ambos roles
      { usuario_id: 6, rol_id: 1 }, // ORGANIZADOR id:11
      { usuario_id: 6, rol_id: 2 }, // ASISTENTE id:12
      
      // Usuario 7 - Ambos roles
      { usuario_id: 7, rol_id: 1 }, // ORGANIZADOR id:13
      { usuario_id: 7, rol_id: 2 }, // ASISTENTE id:14
      
      // Usuario 8 - Ambos roles
      { usuario_id: 8, rol_id: 1 }, // ORGANIZADOR id:15
      { usuario_id: 8, rol_id: 2 }  // ASISTENTE id:16
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Participante', null, {});
  }
};
