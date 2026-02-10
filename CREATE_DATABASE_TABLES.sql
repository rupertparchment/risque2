-- Risqué Club Database Tables
-- Run this in Supabase SQL Editor

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP,
    "membershipStatus" TEXT NOT NULL DEFAULT 'pending',
    "membershipStart" TIMESTAMP,
    "membershipEnd" TIMESTAMP,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Create Event table
CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventDate" TIMESTAMP NOT NULL,
    "eventTime" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "theme" TEXT,
    "flyerImage" TEXT,
    "interiorImage" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 150,
    "price" REAL NOT NULL DEFAULT 100.00,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Create Payment table
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "paymentType" TEXT NOT NULL,
    "eventId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create RSVP table
CREATE TABLE IF NOT EXISTS "RSVP" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "guests" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE("userId", "eventId")
);

-- Create GalleryImage table
CREATE TABLE IF NOT EXISTS "GalleryImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'interior',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Payment_userId_idx" ON "Payment"("userId");
CREATE INDEX IF NOT EXISTS "Payment_eventId_idx" ON "Payment"("eventId");
CREATE INDEX IF NOT EXISTS "RSVP_userId_idx" ON "RSVP"("userId");
CREATE INDEX IF NOT EXISTS "RSVP_eventId_idx" ON "RSVP"("eventId");
CREATE INDEX IF NOT EXISTS "Event_eventDate_idx" ON "Event"("eventDate");
CREATE INDEX IF NOT EXISTS "Event_isActive_idx" ON "Event"("isActive");
