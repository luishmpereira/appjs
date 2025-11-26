'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Create Roles table
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

    // 2. Insert default roles
    const adminPermissions = [{ action: "manage", subject: "all" }];
    const userPermissions = [
      { action: "read", subject: "User" }, // Can read all users? or just self? The code logic will handle 'self' conditions often, but for basic role config let's say read all for now or refine in code
      // Actually, dynamic permissions usually means we store the rules.
      // Let's replicate the logic we had:
      // user can read/update own user.
      // In CASL JSON, conditions like { id: user.id } need interpolation or specific handling.
      // For simplicity in this migration, we'll just store static permissions.
      // The specific "own user" logic might need to be handled by the backend replacing placeholders, 
      // or we stick to Role-based permissions and keep "ownership" logic in code?
      // The user asked for "configurable roles".
      // Let's store the rule with a template variable if supported, or just broad permissions.
      // Ideally: { action: 'read', subject: 'User', conditions: { id: '${user.id}' } }
      // But let's keep it simple:
    ];
    
    // Let's insert the roles. Note: We can't easily put dynamic conditions in JSON without parsing them in code.
    // We will implement a parser in `abilities.ts` that interpolates ${user.id}.
    
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

    // 3. Add roleId to users
    await queryInterface.addColumn('users', 'roleId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // 4. Migrate data (this is tricky with raw SQL in migration but needed)
    // We need to map existing role enum strings to IDs.
    // This assumes 'users' table has data.
    
    // Get roles
    const [roles] = await queryInterface.sequelize.query("SELECT id, name FROM roles");
    const adminRole = roles.find(r => r.name === 'admin');
    const userRole = roles.find(r => r.name === 'user');

    if (adminRole) {
      await queryInterface.sequelize.query(
        `UPDATE users SET "roleId" = ${adminRole.id} WHERE role = 'admin'`
      );
    }
    if (userRole) {
      await queryInterface.sequelize.query(
        `UPDATE users SET "roleId" = ${userRole.id} WHERE role = 'user'`
      );
    }
    
    // Fallback for any nulls if needed
    if (userRole) {
       await queryInterface.sequelize.query(
        `UPDATE users SET "roleId" = ${userRole.id} WHERE "roleId" IS NULL`
      );
    }

    // 5. Remove old role column
    await queryInterface.removeColumn('users', 'role');
    
    // Remove the ENUM type if it exists (postgres specific)
    try {
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
    } catch (e) {
        // ignore
    }
  },

  async down (queryInterface, Sequelize) {
    // Revert is hard because we lose data mapping if we just drop column.
    // For now just drop roles table and remove roleId.
    
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM("user", "admin"),
      defaultValue: "user"
    });

    // Try to restore data (approximate)
    const [roles] = await queryInterface.sequelize.query("SELECT id, name FROM roles");
    for (const role of roles) {
        await queryInterface.sequelize.query(
            `UPDATE users SET role = '${role.name}' WHERE "roleId" = ${role.id}`
        );
    }

    await queryInterface.removeColumn('users', 'roleId');
    await queryInterface.dropTable('roles');
  }
};
