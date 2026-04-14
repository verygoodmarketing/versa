-- Migration: add nurtureEmailsOptOut to businesses
-- Adds opt-out flag for CAN-SPAM compliance with trial nurture email sequence.

ALTER TABLE "businesses" ADD COLUMN "nurtureEmailsOptOut" BOOLEAN NOT NULL DEFAULT false;
