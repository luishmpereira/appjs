import { PrismaClient } from '../src/lib/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const prisma = new PrismaClient({ adapter })

async function main() {
    await prisma.role.upsert({
        where: {
            name: 'admin'
        },
        update: {},
        create: {
            name: 'admin',
            permissions: [{ action: 'manage', subject: 'all' }],
        }
    });
    
    await prisma.role.upsert({
        where: {
            name: 'user'
        },
        update: {},
        create: {
            name: 'user',
            permissions: [
                { action: 'read', subject: 'User', conditions: { id: '${user.id}' } },
                { action: 'update', subject: 'User', conditions: { id: '${user.id}' } }
            ],
        }
    });
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })