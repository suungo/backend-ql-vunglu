-- ============================================================
-- DA-TTTN Database Setup Script
-- Hệ thống quản lý tòa nhà / khu dân cư
-- ============================================================

-- Tạo database (nếu chưa có)
CREATE DATABASE IF NOT EXISTS `da_tttn`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Sử dụng database
USE `da_tttn`;

-- Xác nhận tạo thành công
SELECT 'Database da_tttn đã được tạo thành công!' AS message;
SELECT SCHEMA_NAME, DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'da_tttn';
