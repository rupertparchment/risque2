-- Verify and Add priceCouple, priceMale, priceFemale fields to Event table
-- Run this SQL script in your Supabase SQL Editor

-- First, check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Event' 
AND column_name IN ('priceCouple', 'priceMale', 'priceFemale');

-- Add columns if they don't exist (using separate ALTER statements for better error handling)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Event' AND column_name = 'priceCouple'
    ) THEN
        ALTER TABLE "Event" ADD COLUMN "priceCouple" DOUBLE PRECISION;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Event' AND column_name = 'priceMale'
    ) THEN
        ALTER TABLE "Event" ADD COLUMN "priceMale" DOUBLE PRECISION;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Event' AND column_name = 'priceFemale'
    ) THEN
        ALTER TABLE "Event" ADD COLUMN "priceFemale" DOUBLE PRECISION;
    END IF;
END $$;

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'Event' 
AND column_name IN ('priceCouple', 'priceMale', 'priceFemale')
ORDER BY column_name;
