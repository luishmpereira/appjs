'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('movements', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'CONFIRMED' // Existing records are confirmed
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('movements', 'status');
  }
};
