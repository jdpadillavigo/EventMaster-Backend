'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Evento', [
      {
        titulo: 'Conferencia Tech 2024',
        descripcion: 'Una conferencia sobre las últimas tendencias en tecnología y desarrollo de software.',
        fechaInicio: new Date('2026-10-15T10:00:00'),
        fechaFin: new Date('2026-10-15T12:00:00'),
        imagen: 'https://example.com/conferencia-tech.jpg',
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
        imagen: 'https://example.com/react-workshop.jpg',
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
        imagen: 'https://example.com/meetup-dev.jpg',
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
        imagen: 'https://example.com/hackathon.jpg',
        nroParticipantes: 0,
        aforo: 100,
        estadoEvento: 1, // Programado
        privacidad: 1 // Público
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Evento', null, {});
  }
};
