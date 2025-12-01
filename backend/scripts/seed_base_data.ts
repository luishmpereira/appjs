import prisma from "../src/config/database";
import bcrypt from "bcryptjs";

async function main() {
    console.log("Seeding base data...");

    // 1. Roles
    const adminRole = await prisma.role.upsert({
        where: { name: "admin" },
        update: {},
        create: {
            name: "admin",
            permissions: { all: true }
        }
    });

    // 2. User
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            name: "Admin User",
            password: hashedPassword,
            roleId: adminRole.id
        }
    });

    // 3. Contact
    const contact = await prisma.contact.create({
        data: {
            name: "Test Customer",
            email: "customer@example.com",
            phone: "1234567890",
            sellerId: user.id
        }
    });

    // 4. Product
    const product = await prisma.product.create({
        data: {
            name: "Test Product",
            description: "A product for testing",
            price: 100.00,
            stockQuantity: 100
        }
    });

    console.log("Base data seeded successfully.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
