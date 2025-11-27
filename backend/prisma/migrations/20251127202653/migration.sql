/*
  Warnings:

  - You are about to drop the column `description` on the `Operation` table. All the data in the column will be lost.
  - Added the required column `changeInventory` to the `Operation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasFinance` to the `Operation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operationCode` to the `Operation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operationType` to the `Operation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Operation" DROP COLUMN "description",
ADD COLUMN     "changeInventory" BOOLEAN NOT NULL,
ADD COLUMN     "hasFinance" BOOLEAN NOT NULL,
ADD COLUMN     "operationCode" TEXT NOT NULL,
ADD COLUMN     "operationType" TEXT NOT NULL;
