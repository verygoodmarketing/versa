-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "serviceAreaRadius" INTEGER,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zip" TEXT;

-- AlterTable
ALTER TABLE "sites" ADD COLUMN     "contactFormFields" JSONB NOT NULL DEFAULT '["name","email","phone","message"]',
ADD COLUMN     "contactFormNotifyEmail" TEXT;
