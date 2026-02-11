-- Seed ReferralSource table with predefined options
-- Run this script in Supabase SQL Editor AFTER running ADD_MEMBER_FIELDS.sql

INSERT INTO "ReferralSource" ("id", "name", "displayOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('ref_001', 'Altplayground', 1, true, NOW(), NOW()),
  ('ref_002', 'Adult Friend Finder AFF', 2, true, NOW(), NOW()),
  ('ref_003', 'ASN Lifestyle Magazine', 3, true, NOW(), NOW()),
  ('ref_004', 'Bing Search', 4, true, NOW(), NOW()),
  ('ref_005', 'Co Worker', 5, true, NOW(), NOW()),
  ('ref_006', 'Club Zone', 6, true, NOW(), NOW()),
  ('ref_007', 'Edge Search', 7, true, NOW(), NOW()),
  ('ref_008', 'Family', 8, true, NOW(), NOW()),
  ('ref_009', 'Facebook', 9, true, NOW(), NOW()),
  ('ref_010', 'fetlife', 10, true, NOW(), NOW()),
  ('ref_011', 'Friend', 11, true, NOW(), NOW()),
  ('ref_012', 'Google Search', 12, true, NOW(), NOW()),
  ('ref_013', 'Instagram', 13, true, NOW(), NOW()),
  ('ref_014', 'Kasidie', 14, true, NOW(), NOW()),
  ('ref_015', 'Klymaxxx', 15, true, NOW(), NOW()),
  ('ref_016', 'Lifestyle Lounge', 16, true, NOW(), NOW()),
  ('ref_017', 'Metro Underground', 17, true, NOW(), NOW()),
  ('ref_018', 'National Assoc Swinger Clubs', 18, true, NOW(), NOW()),
  ('ref_019', 'National Coalition Sexual Freedom', 19, true, NOW(), NOW()),
  ('ref_020', 'Quiver', 20, true, NOW(), NOW()),
  ('ref_021', 'Risque Member', 21, true, NOW(), NOW()),
  ('ref_022', 'Safari Search', 22, true, NOW(), NOW()),
  ('ref_023', 'Swingers Date Club', 23, true, NOW(), NOW()),
  ('ref_024', 'SwingLifeStyle SLS', 24, true, NOW(), NOW()),
  ('ref_025', 'Swingers Underground', 25, true, NOW(), NOW()),
  ('ref_026', 'Swingers Board', 26, true, NOW(), NOW()),
  ('ref_027', 'TikTok', 27, true, NOW(), NOW()),
  ('ref_028', 'OTHER', 28, true, NOW(), NOW())
ON CONFLICT ("name") DO NOTHING;
