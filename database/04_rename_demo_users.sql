-- 04_rename_demo_users.sql
-- Renames the original placeholder demo identities to realistic human ones.
-- Data-only migration: no password hashes are touched.
-- Idempotent: every UPDATE is keyed on the OLD email, so re-running is a no-op.
--
-- Run against the live database, e.g.:
--   Get-Content database\04_rename_demo_users.sql -Raw | docker exec -i roxiler-pg psql -U postgres -d roxiler

BEGIN;

-- Store owners
UPDATE users
SET name = 'Priya Venkatesh Ramanathan',
    email = 'priya.ramanathan@roxiler.com',
    address = '12 Besant Nagar Beach Road, Chennai, Tamil Nadu 600090',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'owner1@roxiler.com';

UPDATE users
SET name = 'Rohan Deshpande Kulkarni',
    email = 'rohan.kulkarni@roxiler.com',
    address = '45 Koregaon Park Lane 7, Pune, Maharashtra 411001',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'owner2@roxiler.com';

-- Normal users
UPDATE users
SET name = 'Ananya Sharma Bhattacharya',
    email = 'ananya.bhattacharya@roxiler.com',
    address = '8B Lake Gardens, Kolkata, West Bengal 700045',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'user1@roxiler.com';

UPDATE users
SET name = 'Vikram Singh Rajput Chauhan',
    email = 'vikram.chauhan@roxiler.com',
    address = '27 Civil Lines, Jaipur, Rajasthan 302006',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'user2@roxiler.com';

UPDATE users
SET name = 'Meera Krishnan Subramanian',
    email = 'meera.subramanian@roxiler.com',
    address = '63 Anna Nagar West, Chennai, Tamil Nadu 600040',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'user3@roxiler.com';

-- Admin address (email and name already human; keep them unchanged)
UPDATE users
SET address = 'Roxiler Systems, 5th Floor, Cyber Towers, HITEC City, Hyderabad 500081',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@roxiler.com'
  AND address = '123 Admin Street, Admin City, AC 12345';

-- Stores
UPDATE stores
SET name = 'Ramanathan Electronics Emporium',
    email = 'priya.electronics@roxiler.com',
    address = '14 Anna Salai, Chennai, Tamil Nadu 600002',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'electronics@roxiler.com';

UPDATE stores
SET name = 'Kulkarni Fresh Grocery Mart',
    email = 'rohan.grocery@roxiler.com',
    address = '22 Fergusson College Road, Pune, Maharashtra 411004',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'grocery@roxiler.com';

COMMIT;

-- Verification: should list the six demo accounts with human names/emails.
SELECT role, name, email, length(name) AS name_length
FROM users
WHERE email IN (
    'admin@roxiler.com',
    'priya.ramanathan@roxiler.com',
    'rohan.kulkarni@roxiler.com',
    'ananya.bhattacharya@roxiler.com',
    'vikram.chauhan@roxiler.com',
    'meera.subramanian@roxiler.com'
)
ORDER BY role, email;

SELECT name, email, address FROM stores ORDER BY email;
