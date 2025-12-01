import prisma from "../src/config/database";

async function main() {
    // Operations
    await prisma.operation.createMany({
        data: [
            { name: "Quotation", operationCode: "QUOT", operationType: "QUOTATION", changeInventory: false, hasFinance: false },
            { name: "Sale Order", operationCode: "SALE", operationType: "SALE", changeInventory: false, hasFinance: true },
            { name: "Delivery", operationCode: "DELV", operationType: "OUT", changeInventory: true, hasFinance: false },
        ],
        skipDuplicates: true,
    });

    // Payment Methods
    await prisma.paymentMethod.createMany({
        data: [
            { name: "Cash", description: "Cash payment" },
            { name: "Credit Card", description: "Credit card payment" },
            { name: "Debit Card", description: "Debit card payment" },
            { name: "Bank Transfer", description: "Electronic bank transfer" },
            { name: "Check", description: "Check payment" },
            { name: "Other", description: "Other payment method" },
        ],
        skipDuplicates: true,
    });

    // Accounts
    await prisma.account.createMany({
        data: [
            { accountCode: "1010", name: "Cash", accountType: "ASSET" },
            { accountCode: "1020", name: "Credit Card Receivable", accountType: "ASSET" },
            { accountCode: "1030", name: "Accounts Receivable", accountType: "ASSET" },
            { accountCode: "4010", name: "Sales Revenue", accountType: "REVENUE" },
        ],
        skipDuplicates: true,
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
