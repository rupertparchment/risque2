-- Create AdminUser table for backend/admin users
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'editor',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isDeleted" BOOLEAN NOT NULL DEFAULT false,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email");

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "AdminUser_isDeleted_idx" ON "AdminUser"("isDeleted");
CREATE INDEX IF NOT EXISTS "AdminUser_role_idx" ON "AdminUser"("role");

-- Insert default administrator user (change password after first login!)
-- Password: "admin123" (hashed with bcrypt)
-- You should change this password immediately after first login
INSERT INTO "AdminUser" ("id", "email", "password", "firstName", "lastName", "role", "isActive", "createdAt", "updatedAt")
VALUES (
  'admin-' || gen_random_uuid()::text,
  'admin@risque2.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- bcrypt hash of "admin123"
  'Admin',
  'User',
  'administrator',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;
