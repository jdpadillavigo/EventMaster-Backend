'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Invitacion', {
      notificacion_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Notificacion',
          key: 'notificacion_id'
        }
      },
      fechaLimite: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Invitacion');
  }
};
