'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('InvitacionUsuario', {
      invitacion_usuario_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      estado_invitacion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'EstadoInvitacion',
          key: 'estado_id'
        }
      },
      invitacion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Invitacion',
          key: 'notificacion_id'
        }
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'usuario_id'
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('InvitacionUsuario');
  }
};
