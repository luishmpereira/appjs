'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('movement_lines');
    
    if (tableInfo.createdAt) {
        await queryInterface.removeColumn('movement_lines', 'createdAt');
    }
    if (tableInfo.updatedAt) {
        await queryInterface.removeColumn('movement_lines', 'updatedAt');
    }
    if (tableInfo.userId) {
        await queryInterface.removeColumn('movement_lines', 'userId');
    }
  },

  async down (queryInterface, Sequelize) {
    // We don't strictly need to restore these garbage columns, but for completeness:
    // This down migration is partial/best-effort as we are cleaning up schema drift.
    await queryInterface.addColumn('movement_lines', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('movement_lines', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    // userId was likely a mistake, not restoring it.
  }
};
