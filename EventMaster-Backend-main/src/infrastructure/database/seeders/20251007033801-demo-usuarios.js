'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Usuario', [
      {
        clave: 'user1',
        correo: 'user1@eventos.com',
        isActive: true
      },
      {
        clave: 'user2',
        correo: 'user2@eventos.com',
        isActive: true
      },
      {
        clave: 'user3',
        correo: 'user3@eventos.com',
        isActive: true
      },
      {
        clave: 'user4pass',
        correo: 'user4@eventos.com',
        isActive: true
      },
      {
        clave: 'user5pass',
        correo: 'user5@eventos.com',
        isActive: true
      },
      {
        clave: 'user6pass',
        correo: 'user6@eventos.com',
        isActive: true
      },
      {
        clave: 'user7pass',
        correo: 'user7@eventos.com',
        isActive: true
      },
      {
        clave: 'user8pass',
        correo: 'user8@eventos.com',
        isActive: true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuario', null, {});
  }
};
