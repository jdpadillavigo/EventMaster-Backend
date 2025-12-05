'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener los IDs de eventos generados automáticamente
    const eventos = await queryInterface.sequelize.query(
      `SELECT evento_id FROM "Evento" ORDER BY evento_id ASC;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const eventoIds = eventos.map(e => e.evento_id);

    await queryInterface.bulkInsert('Ubicacion', [
      {
        direccion: 'Swissôtel Lima, Av. Santo Toribio 173, San Isidro',
        latitud: -12.0976,
        longitud: -77.0383,
        evento_id: eventoIds[0]
      },
      {
        direccion: 'PUCP - Pontificia Universidad Católica del Perú, Av. Universitaria 1801, San Miguel',
        latitud: -12.0696,
        longitud: -77.0796,
        evento_id: eventoIds[1]
      },
      {
        direccion: 'Plaza San Martín, Centro Histórico de Lima',
        latitud: -12.0517,
        longitud: -77.0346,
        evento_id: eventoIds[2]
      },
      {
        direccion: 'Parque Kennedy, Miraflores',
        latitud: -12.1218,
        longitud: -77.0304,
        evento_id: eventoIds[3]
      },
      {
        direccion: 'Av de los Precursores 125-127, San Miguel 15088',
        latitud: -12.0775,
        longitud: -77.0930,
        evento_id: eventoIds[4],
      },
      {
        direccion: 'Costa Verde, Miraflores',
        latitud: -12.1260,
        longitud: -77.0300,
        evento_id: eventoIds[5],
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ubicacion', null, {});
  }
};
