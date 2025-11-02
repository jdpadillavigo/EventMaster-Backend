'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Obtener los IDs de usuarios generados automáticamente
    const usuarios = await queryInterface.sequelize.query(
      `SELECT usuario_id FROM "Usuario" ORDER BY usuario_id ASC;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const usuarioIds = usuarios.map(u => u.usuario_id);

    await queryInterface.bulkInsert('Cliente', [
      {
        nombre: 'Juan',
        apellido: 'Perez',
        usuario_id: usuarioIds[0]
      },
      {
        nombre: 'Maria',
        apellido: 'Gonzalez',
        usuario_id: usuarioIds[1]
      },
      {
        nombre: 'Carlos',
        apellido: 'Lopez',
        usuario_id: usuarioIds[2]
      },
      {
        nombre: 'Laura',
        apellido: 'Ramirez',
        usuario_id: usuarioIds[3]
      },
      {
        nombre: 'Diego',
        apellido: 'Fernandez',
        usuario_id: usuarioIds[4]
      },
      {
        nombre: 'Sofia',
        apellido: 'Martinez',
        usuario_id: usuarioIds[5]
      },
      {
        nombre: 'Miguel',
        apellido: 'Hernandez',
        usuario_id: usuarioIds[6]
      },
      {
        nombre: 'Valentina',
        apellido: 'Sanchez',
        usuario_id: usuarioIds[7]
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cliente', null, {});
  }
};
