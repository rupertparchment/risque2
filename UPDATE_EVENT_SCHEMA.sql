-- Update Event table: Make eventTime and capacity optional
-- Run this SQL script in your Supabase SQL Editor

-- Make eventTime optional
ALTER TABLE "Event" 
ALTER COLUMN "eventTime" DROP NOT NULL;

-- Make capacity optional
ALTER TABLE "Event" 
ALTER COLUMN "capacity" DROP NOT NULL;
