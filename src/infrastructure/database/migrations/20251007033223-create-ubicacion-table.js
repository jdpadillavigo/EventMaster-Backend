'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Ubicacion', {
      ubicacion_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      direccion: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      latitud: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      longitud: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      evento_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Evento',
          key: 'evento_id'
        },
        onDelete: 'CASCADE',
        unique: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Ubicacion');
  }
};
