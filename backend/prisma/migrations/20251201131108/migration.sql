/*
  Warnings:

  - A unique constraint covering the columns `[stockMovementCode]` on the table `Movement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[convertedToId]` on the table `Movement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[operationCode]` on the table `Operation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `balanceAmount` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactId` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movementType` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidAmount` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockMovementCode` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `MovementLine` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MovementStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELED', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'PENDING', 'PARTIALLY_PAID', 'PAID', 'FULFILLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('DEBIT', 'CREDIT');

-- DropForeignKey
ALTER TABLE "MovementLine" DROP CONSTRAINT "MovementLine_movementId_fkey";

-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "balanceAmount" DECIMAL(10,4) NOT NULL,
ADD COLUMN     "contactId" INTEGER NOT NULL,
ADD COLUMN     "convertedToId" INTEGER,
ADD COLUMN     "movementType" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paidAmount" DECIMAL(10,4) NOT NULL,
ADD COLUMN     "status" "MovementStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "stockMovementCode" TEXT NOT NULL,
ADD COLUMN     "totalAmount" DECIMAL(10,4) NOT NULL,
ADD COLUMN     "validUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MovementLine" ADD COLUMN     "subtotal" DECIMAL(10,4) NOT NULL,
ADD COLUMN     "unitPrice" DECIMAL(10,4);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "paymentCode" TEXT NOT NULL,
    "movementId" INTEGER NOT NULL,
    "amount" DECIMAL(10,4) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethodId" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "accountCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "balance" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountEntry" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "paymentId" INTEGER,
    "movementId" INTEGER,
    "amount" DECIMAL(10,4) NOT NULL,
    "entryType" "EntryType" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentCode_key" ON "Payment"("paymentCode");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_name_key" ON "PaymentMethod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountCode_key" ON "Account"("accountCode");

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Movement_stockMovementCode_key" ON "Movement"("stockMovementCode");

-- CreateIndex
CREATE UNIQUE INDEX "Movement_convertedToId_key" ON "Movement"("convertedToId");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_operationCode_key" ON "Operation"("operationCode");

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_convertedToId_fkey" FOREIGN KEY ("convertedToId") REFERENCES "Movement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovementLine" ADD CONSTRAINT "MovementLine_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "Movement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "Movement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountEntry" ADD CONSTRAINT "AccountEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountEntry" ADD CONSTRAINT "AccountEntry_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountEntry" ADD CONSTRAINT "AccountEntry_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "Movement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
