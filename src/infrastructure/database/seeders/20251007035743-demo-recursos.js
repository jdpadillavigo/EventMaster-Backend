'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Obtener los IDs de eventos generados automáticamente
    const eventos = await queryInterface.sequelize.query(
      `SELECT evento_id FROM "Evento" ORDER BY evento_id ASC;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const eventoIds = eventos.map(e => e.evento_id);

    await queryInterface.bulkInsert('Recurso', [
      {
        nombre: 'Agenda',
        url: 'https://www.ulima.edu.pe/sites/default/files/career/files/malla_ing_sistemas_2025_1.pdf',
        tipo_recurso: 1, // Archivo
        evento_id: eventoIds[4],
      },
      {
        nombre: 'Trailer',
        url: 'https://www.youtube.com/watch?v=-MKFIecXRys',
        tipo_recurso: 2, // Enlace
        evento_id: eventoIds[5],
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Recurso', null, {});
  }
};
