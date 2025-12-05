'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuario', 'activation_token', {
      type: Sequelize.STRING(50),
      allowNull: true
    });

    await queryInterface.addColumn('Usuario', 'token_expires_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuario', 'activation_token');
    await queryInterface.removeColumn('Usuario', 'token_expires_at');
  }
};
