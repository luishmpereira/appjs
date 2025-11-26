'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('operations', [
      {
        name: 'Quotation',
        operationCode: 'QUOTATION',
        operationType: 'OUT',
        changeInventory: false,
        hasFinance: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Order Sale',
        operationCode: 'ORDER_SALE',
        operationType: 'OUT',
        changeInventory: true,
        hasFinance: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Stock Out',
        operationCode: 'STOCK_OUT',
        operationType: 'OUT',
        changeInventory: true,
        hasFinance: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Stock In',
        operationCode: 'STOCK_IN',
        operationType: 'IN',
        changeInventory: true,
        hasFinance: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('operations', {
      operationCode: ['QUOTATION', 'ORDER_SALE', 'STOCK_OUT', 'STOCK_IN']
    });
  }
};
