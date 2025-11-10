'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('NotificacionUsuario', {
      notificacion_accion_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'NotificacionAccion',
          key: 'notificacion_id'
        }
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Usuario',
          key: 'usuario_id'
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('NotificacionUsuario');
  }
};
