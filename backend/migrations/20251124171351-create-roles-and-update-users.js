'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      permissions: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        permissions: JSON.stringify([{ action: 'manage', subject: 'all' }]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user',
        permissions: JSON.stringify([
           { action: 'read', subject: 'User', conditions: { id: '${user.id}' } },
           { action: 'update', subject: 'User', conditions: { id: '${user.id}' } }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });
    const [roles] = await queryInterface.sequelize.query("SELECT id, name FROM roles");
    const userRole = roles.find(r => r.name === 'user');
    
    if (userRole) {
       await queryInterface.sequelize.query(
        `UPDATE users SET "roleId" = ${userRole.id} WHERE "roleId" IS NULL`
      );
    }
    try {
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
    } catch (e) {
    }
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('users', 'roleId');
    await queryInterface.dropTable('roles');
  }
};
