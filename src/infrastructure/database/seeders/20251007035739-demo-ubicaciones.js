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

    await queryInterface.bulkInsert('Ubicacion', [
      {
        direccion: 'Centro de Convenciones Ciudad, Av. Principal 123',
        latitud: -12.0464,
        longitud: -77.0428,
        evento_id: eventoIds[0]
      },
      {
        direccion: 'Universidad Tecnológica, Campus Norte',
        latitud: -12.0564,
        longitud: -77.0528,
        evento_id: eventoIds[1]
      },
      {
        direccion: 'Café Tech Hub, Plaza San Martín',
        latitud: -12.0664,
        longitud: -77.0628,
        evento_id: eventoIds[2]
      },
      {
        direccion: 'Parque Tecnológico, Zona Industrial',
        latitud: -12.0764,
        longitud: -77.0728,
        evento_id: eventoIds[3]
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ubicacion', null, {});
  }
};
