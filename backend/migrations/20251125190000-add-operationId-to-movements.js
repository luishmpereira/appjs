'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('movements', 'operationId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'operations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('movements', 'operationId');
  }
};
