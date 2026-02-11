-- Add priceCouple, priceMale, priceFemale fields to Event table
-- Run this SQL script in your Supabase SQL Editor

ALTER TABLE "Event" 
ADD COLUMN IF NOT EXISTS "priceCouple" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "priceMale" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "priceFemale" DOUBLE PRECISION;
