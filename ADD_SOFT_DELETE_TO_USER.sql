-- Add soft delete fields to User table
-- Run this in your Supabase SQL Editor

ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- Create an index for faster queries of active members
CREATE INDEX IF NOT EXISTS "User_isDeleted_idx" ON "User"("isDeleted");
