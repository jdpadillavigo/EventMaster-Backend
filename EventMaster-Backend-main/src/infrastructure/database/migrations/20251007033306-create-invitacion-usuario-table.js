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
      esParaCoorganizar: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
        },
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'usuario_id'
        },
        onDelete: 'CASCADE'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('InvitacionUsuario');
  }
};
