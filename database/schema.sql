-- ============================================================
-- Asset Tracker — Schema
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS asset_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE asset_tracker;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id               INT          NOT NULL AUTO_INCREMENT,
    full_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(255) NOT NULL,
    hashed_password  VARCHAR(255) NOT NULL,
    is_active        TINYINT(1)   NOT NULL DEFAULT 1,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    KEY ix_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Sections ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sections (
    id          INT          NOT NULL AUTO_INCREMENT,
    user_id     INT          NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    icon        VARCHAR(50)  DEFAULT 'box',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY ix_sections_user_id (user_id),
    CONSTRAINT fk_sections_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Items ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS items (
    id               INT            NOT NULL AUTO_INCREMENT,
    section_id       INT            NOT NULL,
    user_id          INT            NOT NULL,
    name             VARCHAR(150)   NOT NULL,
    description      TEXT,
    buying_price     DECIMAL(12, 2),
    purchase_date    DATE,
    purchase_year    INT,
    brand            VARCHAR(100),
    model_number     VARCHAR(100),
    serial_number    VARCHAR(100),
    `condition`      VARCHAR(50)    DEFAULT 'good',
    photo_path       VARCHAR(500),
    photo_thumb_path VARCHAR(500),
    notes            TEXT,
    created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY ix_items_section_id (section_id),
    KEY ix_items_user_id (user_id),
    CONSTRAINT fk_items_section FOREIGN KEY (section_id) REFERENCES sections (id) ON DELETE CASCADE,
    CONSTRAINT fk_items_user    FOREIGN KEY (user_id)    REFERENCES users    (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Password Reset Tokens ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         INT          NOT NULL AUTO_INCREMENT,
    user_id    INT          NOT NULL,
    token      VARCHAR(255) NOT NULL,
    is_used    TINYINT(1)   NOT NULL DEFAULT 0,
    expires_at DATETIME     NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_reset_token (token),
    KEY ix_reset_token_user_id (user_id),
    CONSTRAINT fk_reset_token_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
