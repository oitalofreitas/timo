-- AlterTable
ALTER TABLE "whatsapp_connections" ADD COLUMN "qrCode" TEXT,
ADD COLUMN "authData" BYTEA,
ADD COLUMN "lastError" TEXT,
ADD COLUMN "lastSync" TIMESTAMP(3);
