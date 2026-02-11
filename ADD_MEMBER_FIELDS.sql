-- Add new fields to User table for member management
-- Run this script in Supabase SQL Editor

-- Add receiveEmails field
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "receiveEmails" BOOLEAN NOT NULL DEFAULT true;

-- Add digitalSignature field
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "digitalSignature" TEXT;

-- Create ReferralSource table
CREATE TABLE IF NOT EXISTS "ReferralSource" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReferralSource_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on name
CREATE UNIQUE INDEX IF NOT EXISTS "ReferralSource_name_key" ON "ReferralSource"("name");

-- Add referralSourceId foreign key to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "referralSourceId" TEXT;

-- Add foreign key constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'User_referralSourceId_fkey'
  ) THEN
    ALTER TABLE "User" 
    ADD CONSTRAINT "User_referralSourceId_fkey" 
    FOREIGN KEY ("referralSourceId") 
    REFERENCES "ReferralSource"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
