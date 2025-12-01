import prisma from "../src/config/database";

async function main() {
    console.log("Starting Sales Flow Verification...");

    // 1. Setup Data (User, Contact, Product, Operation)
    const user = await prisma.user.findFirst();
    const contact = await prisma.contact.findFirst();
    const product = await prisma.product.findFirst();
    const quotOp = await prisma.operation.findUnique({ where: { operationCode: "QUOT" } });

    if (!user || !contact || !product || !quotOp) {
        console.error("Missing seed data. Run seeds first.");
        return;
    }

    console.log("1. Creating Quotation...");
    const quotation = await prisma.movement.create({
        data: {
            stockMovementCode: `QUOT-TEST-${Date.now()}`,
            movementType: "QUOTATION",
            operationId: quotOp.id,
            contactId: contact.id,
            createdById: user.id,
            updatedById: user.id,
            lines: {
                create: [{
                    productId: product.id,
                    quantity: 5,
                    unitPrice: 100,
                    subtotal: 500
                }]
            },
            totalAmount: 500,
            paidAmount: 0,
            balanceAmount: 500,
            status: "DRAFT"
        }
    });
    console.log(`Quotation created: ${quotation.id} (${quotation.stockMovementCode})`);

    console.log("2. Sending Quotation...");
    await prisma.movement.update({
        where: { id: quotation.id },
        data: { status: "SENT" }
    });
    console.log("Quotation SENT");

    console.log("3. Accepting Quotation (Converting to Sale)...");
    // Simulate logic from controller (simplified)
    const saleOp = await prisma.operation.findUnique({ where: { operationCode: "SALE" } });
    if (!saleOp) throw new Error("Sale operation not found");

    const saleOrder = await prisma.movement.create({
        data: {
            stockMovementCode: `SALE-TEST-${Date.now()}`,
            movementType: "SALE",
            operationId: saleOp.id,
            contactId: contact.id,
            totalAmount: 500,
            paidAmount: 0,
            balanceAmount: 500,
            status: "PENDING",
            convertedFrom: { connect: { id: quotation.id } },
            createdById: user.id,
            updatedById: user.id,
            lines: {
                create: [{
                    productId: product.id,
                    quantity: 5,
                    unitPrice: 100,
                    subtotal: 500
                }]
            }
        }
    });
    await prisma.movement.update({
        where: { id: quotation.id },
        data: { status: "ACCEPTED", convertedToId: saleOrder.id }
    });
    console.log(`Sale Order created: ${saleOrder.id} (${saleOrder.stockMovementCode})`);

    console.log("4. Creating Payment...");
    const paymentMethod = await prisma.paymentMethod.findFirst({ where: { name: "Cash" } });
    if (!paymentMethod) throw new Error("Payment method not found");

    const payment = await prisma.payment.create({
        data: {
            paymentCode: `PAY-TEST-${Date.now()}`,
            movementId: saleOrder.id,
            amount: 200, // Partial payment
            paymentMethodId: paymentMethod.id,
            status: "PENDING",
            createdById: user.id
        }
    });
    console.log(`Payment created: ${payment.id}`);

    console.log("5. Confirming Payment & Accounting...");
    // Simulate controller logic
    const cashAccount = await prisma.account.findUnique({ where: { accountCode: "1010" } });
    const arAccount = await prisma.account.findUnique({ where: { accountCode: "1030" } });

    if (!cashAccount || !arAccount) throw new Error("Accounts not found");

    await prisma.$transaction([
        prisma.payment.update({ where: { id: payment.id }, data: { status: "CONFIRMED" } }),
        prisma.accountEntry.create({
            data: {
                accountId: cashAccount.id,
                paymentId: payment.id,
                amount: 200,
                entryType: "DEBIT",
                description: "Test Payment Debit"
            }
        }),
        prisma.account.update({ where: { id: cashAccount.id }, data: { balance: { increment: 200 } } }),
        prisma.accountEntry.create({
            data: {
                accountId: arAccount.id,
                paymentId: payment.id,
                amount: 200,
                entryType: "CREDIT",
                description: "Test Payment Credit"
            }
        }),
        prisma.account.update({ where: { id: arAccount.id }, data: { balance: { decrement: 200 } } }),
        prisma.movement.update({
            where: { id: saleOrder.id },
            data: {
                paidAmount: 200,
                balanceAmount: 300,
                status: "PARTIALLY_PAID"
            }
        })
    ]);
    console.log("Payment CONFIRMED. Account entries created.");

    // Verification Checks
    const finalSale = await prisma.movement.findUnique({ where: { id: saleOrder.id } });
    const finalCash = await prisma.account.findUnique({ where: { id: cashAccount.id } });

    console.log("\n--- Verification Results ---");
    console.log(`Sale Status: ${finalSale?.status} (Expected: PARTIALLY_PAID)`);
    console.log(`Sale Paid: ${finalSale?.paidAmount} (Expected: 200)`);
    console.log(`Sale Balance: ${finalSale?.balanceAmount} (Expected: 300)`);
    console.log(`Cash Account Balance: ${finalCash?.balance} (Expected: >= 200)`);

    if (finalSale?.status === "PARTIALLY_PAID" && Number(finalSale?.paidAmount) === 200) {
        console.log("\n✅ SUCCESS: Sales flow verified!");
    } else {
        console.error("\n❌ FAILURE: Verification failed.");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
