'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Recurso', {
      recurso_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      url: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      tipo_recurso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TipoRecurso',
          key: 'tipo_recurso_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      evento_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Evento',
          key: 'evento_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Recurso');
  }
};