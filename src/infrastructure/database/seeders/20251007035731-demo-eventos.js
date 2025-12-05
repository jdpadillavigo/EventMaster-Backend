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
        imagen: 'https://miro.medium.com/1*vxjAHkrXbGG6gOiPZgjeZA.jpeg',
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
        imagen: 'https://blog.wildix.com/wp-content/uploads/2020/06/react-logo.jpg',
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
        imagen: 'https://i.ytimg.com/vi/x_DB0UlTk3M/maxresdefault.jpg',
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
        imagen: 'https://media.licdn.com/dms/image/v2/C4D12AQGYL0QQHYmmxA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1622214050531?e=2147483647&v=beta&t=b9DuXiFlELDH2dCRU_8CIjdKKX1vQrGOA4v7_arA3e8',
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
        fechaInicio: new Date('2025-10-15T18:00:00Z'),
        fechaFin: new Date('2025-10-16T06:00:00Z'),
        imagen: 'https://i.ytimg.com/vi/TBrt71Kcclc/maxresdefault.jpg',
        nroParticipantes: 0,
        aforo: 100,
        estadoEvento: 1, // Programado
        privacidad: 1,   // Público
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Evento', null, {});
  }
};
