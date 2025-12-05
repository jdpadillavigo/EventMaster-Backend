'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Evento', [
      {
        titulo: 'Conferencia Tech 2024',
        descripcion: 'Una conferencia sobre las últimas tendencias en tecnología y desarrollo de software.',
        fechaInicio: new Date('2026-10-15T10:00:00'),
        fechaFin: new Date('2026-10-15T12:00:00'),
        imagen: 'https://images.unsplash.com/photo-1699962699915-6208f35e3523?q=80&w=2070&auto=format&fit=crop',
        nroParticipantes: 0,
        aforo: 100,
        estadoEvento: 1, // Programado
        privacidad: 1 // Público
      },
      {
        titulo: 'Workshop React',
        descripcion: 'Taller práctico para aprender React desde cero hasta nivel intermedio.',
        fechaInicio: new Date('2026-12-20T14:00:00'),
        fechaFin: new Date('2026-12-20T17:00:00'),
        imagen: 'hhttps://images.unsplash.com/photo-1699962700166-2b8294ea56f9?q=80&w=2070&auto=format&fit=crop',
        nroParticipantes: 0,
        aforo: 50,
        estadoEvento: 1, // Programado
        privacidad: 2 // Privado
      },
      {
        titulo: 'Meetup Devs',
        descripcion: 'Encuentro mensual de desarrolladores para networking y charlas técnicas.',
        fechaInicio: new Date('2026-02-25T18:00:00'),
        fechaFin: new Date('2026-02-25T20:00:00'),
        imagen: 'https://unsplash.com/es/fotos/personas-sentadas-en-una-silla-dentro-de-la-habitacion-ID1yWa1Wpx0',
        nroParticipantes: 0,
        aforo: 30,
        estadoEvento: 1, // Programado
        privacidad: 2 // Privado
      },
      {
        titulo: 'Hackathon 2024',
        descripcion: 'Competencia de programación de 48 horas para crear soluciones innovadoras.',
        fechaInicio: new Date('2026-03-01T09:00:00'),
        fechaFin: new Date('2026-03-01T11:00:00'),
        imagen: 'https://images.unsplash.com/photo-1731087384860-503f1daa1e17?q=80&w=2070&auto=format&fit=crop',
        nroParticipantes: 0,
        aforo: 100,
        estadoEvento: 1, // Programado
        privacidad: 1 // Público
      },
      {
        titulo: 'Baile de los Brainrots',
        descripcion: '¡Por primera vez en Perú ...!',
        fechaInicio: new Date('2026-09-11T20:00:00Z'),
        fechaFin: new Date('2026-09-11T23:00:00Z'),
        imagen: 'https://cdn.teleticket.com.pe/especiales/concierto-brainrots-italianos-show-oficial/images/banner-brainrots.jpg',
        nroParticipantes: 0,
        aforo: 100,
        estadoEvento: 1, // Programado
        privacidad: 1,   // Público
      },
      {
        titulo: 'Festival de Música Electrónica',
        descripcion: 'El mejor festival de música electrónica del año.',
        fechaInicio: new Date('2027-10-15T18:00:00Z'),
        fechaFin: new Date('2027-10-16T06:00:00Z'),
        imagen: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1400&auto=format&fit=crop',
        nroParticipantes: 0,
        aforo: 100,
        estadoEvento: 1, // Programado
        privacidad: 1,   // Público
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Evento', null, {});
  }
};
