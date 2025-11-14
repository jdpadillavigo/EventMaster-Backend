'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('NotificacionAccion', {
      notificacion_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Notificacion',
          key: 'notificacion_id'
        },
        onDelete: 'CASCADE'
      },
      mensaje: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('NotificacionAccion');
  }
};
