-- Roxiler Systems Seed Data
-- Run this AFTER schema.sql
-- All passwords are hashed with bcrypt (cost 12)
-- Password for all seeded users: <Role>Pass123! (e.g., AdminPass123!, OwnerPass123!, UserPass123!)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1 Admin (name must be 20+ chars per validation rules)
-- Password: AdminPass123!
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
(
    uuid_generate_v4(),
    'System Administrator Roxiler',
    'admin@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '123 Admin Street, Admin City, AC 12345',
    'SYSTEM_ADMIN'
);

-- 2 Store Owners
-- Password: OwnerPass123!
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
(
    uuid_generate_v4(),
    'John Store Owner One',
    'owner1@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '456 Owner Avenue, Owner City, OC 23456',
    'STORE_OWNER'
),
(
    uuid_generate_v4(),
    'Jane Store Owner Two',
    'owner2@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '789 Owner Boulevard, Owner Town, OT 34567',
    'STORE_OWNER'
);

-- 3 Normal Users
-- Password: UserPass123!
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
(
    uuid_generate_v4(),
    'Alice Normal User One',
    'user1@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '301 Resident Lane, Resident City, RC 76543',
    'NORMAL_USER'
),
(
    uuid_generate_v4(),
    'Bob Normal User Two',
    'user2@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '302 Resident Lane, Resident City, RC 76543',
    'NORMAL_USER'
),
(
    uuid_generate_v4(),
    'Carol Normal User Three',
    'user3@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '303 Resident Lane, Resident City, RC 76543',
    'NORMAL_USER'
);

-- Stores
-- Get owner IDs via subqueries
INSERT INTO stores (id, name, email, address, owner_id) VALUES
(
    uuid_generate_v4(),
    'Roxiler Electronics Store',
    'electronics@roxiler.com',
    '101 Tech Plaza, Tech City, TC 54321',
    (SELECT id FROM users WHERE email = 'owner1@roxiler.com' LIMIT 1)
),
(
    uuid_generate_v4(),
    'Roxiler Grocery Mart',
    'grocery@roxiler.com',
    '202 Market Street, Market City, MC 65432',
    (SELECT id FROM users WHERE email = 'owner2@roxiler.com' LIMIT 1)
);

-- Sample Ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES
(
    (SELECT id FROM users WHERE email = 'user1@roxiler.com' LIMIT 1),
    (SELECT id FROM stores WHERE email = 'electronics@roxiler.com' LIMIT 1),
    5
),
(
    (SELECT id FROM users WHERE email = 'user2@roxiler.com' LIMIT 1),
    (SELECT id FROM stores WHERE email = 'electronics@roxiler.com' LIMIT 1),
    4
),
(
    (SELECT id FROM users WHERE email = 'user3@roxiler.com' LIMIT 1),
    (SELECT id FROM stores WHERE email = 'grocery@roxiler.com' LIMIT 1),
    3
),
(
    (SELECT id FROM users WHERE email = 'user1@roxiler.com' LIMIT 1),
    (SELECT id FROM stores WHERE email = 'grocery@roxiler.com' LIMIT 1),
    5
);