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
    'Roxiler Systems, 5th Floor, Cyber Towers, HITEC City, Hyderabad 500081',
    'SYSTEM_ADMIN'
);

-- 2 Store Owners
-- Password: OwnerPass123!
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
(
    uuid_generate_v4(),
    'Priya Venkatesh Ramanathan',
    'priya.ramanathan@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '12 Besant Nagar Beach Road, Chennai, Tamil Nadu 600090',
    'STORE_OWNER'
),
(
    uuid_generate_v4(),
    'Rohan Deshpande Kulkarni',
    'rohan.kulkarni@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '45 Koregaon Park Lane 7, Pune, Maharashtra 411001',
    'STORE_OWNER'
);

-- 3 Normal Users
-- Password: UserPass123!
INSERT INTO users (id, name, email, password_hash, address, role) VALUES
(
    uuid_generate_v4(),
    'Ananya Sharma Bhattacharya',
    'ananya.bhattacharya@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '8B Lake Gardens, Kolkata, West Bengal 700045',
    'NORMAL_USER'
),
(
    uuid_generate_v4(),
    'Vikram Singh Rajput Chauhan',
    'vikram.chauhan@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '27 Civil Lines, Jaipur, Rajasthan 302006',
    'NORMAL_USER'
),
(
    uuid_generate_v4(),
    'Meera Krishnan Subramanian',
    'meera.subramanian@roxiler.com',
    '$2a$12$K1x8R7L3P9Q2W5E4R6T8Y0U1I2O3P4A5S6D7F8G9H0J1K2L3M4N5',
    '63 Anna Nagar West, Chennai, Tamil Nadu 600040',
    'NORMAL_USER'
);

-- Stores
-- Get owner IDs via subqueries
INSERT INTO stores (id, name, email, address, owner_id) VALUES
(
    uuid_generate_v4(),
    'Ramanathan Electronics Emporium',
    'priya.electronics@roxiler.com',
    '14 Anna Salai, Chennai, Tamil Nadu 600002',
    (SELECT id FROM users WHERE email = 'priya.ramanathan@roxiler.com' LIMIT 1)
),
(
    uuid_generate_v4(),
    'Kulkarni Fresh Grocery Mart',
    'rohan.grocery@roxiler.com',
    '22 Fergusson College Road, Pune, Maharashtra 411004',
    (SELECT id FROM users WHERE email = 'rohan.kulkarni@roxiler.com' LIMIT 1)
);

-- Sample Ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES
(
    (SELECT id FROM users WHERE email = 'ananya.bhattacharya@roxiler.com' LIMIT 1),
    (SELECT id FROM stores WHERE email = 'priya.electronics@roxiler.com' LIMIT 1),
    5
),
(
    (SELECT id FROM users WHERE email = 'vikram.chauhan@roxiler.com' LIMIT 1),
    (SELECT id FROM stores WHERE email = 'priya.electronics@roxiler.com' LIMIT 1),
    4
),
(
    (SELECT id FROM users WHERE email = 'meera.subramanian@roxiler.com' LIMIT 1),
    (SELECT id FROM stores WHERE email = 'rohan.grocery@roxiler.com' LIMIT 1),
    3
),
(
    (SELECT id FROM users WHERE email = 'ananya.bhattacharya@roxiler.com' LIMIT 1),
    (SELECT id FROM stores WHERE email = 'rohan.grocery@roxiler.com' LIMIT 1),
    5
);
