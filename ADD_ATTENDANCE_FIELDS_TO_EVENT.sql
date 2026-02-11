-- Add attendance tracking fields to Event table
-- Run this SQL script in your Supabase SQL Editor

ALTER TABLE "Event" 
ADD COLUMN IF NOT EXISTS "totalCouples" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "totalMales" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "totalFemales" INTEGER NOT NULL DEFAULT 0;
