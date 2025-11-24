'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('users', 'avatar', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    } catch (e) {
      console.log("Column avatar already exists, skipping");
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatar');
  }
};
