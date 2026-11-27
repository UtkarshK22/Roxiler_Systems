-- Run this file connected to the default "postgres" database
-- CREATE DATABASE cannot run inside a transaction block
-- This SQL creates the database named in .env (roxiler)

-- PostgreSQL command to run separately (not inside this script):
-- psql -U postgres -c "CREATE DATABASE roxiler;

-- If running via psql with \set ON_ERROR_STOP on, this will abort on error
SELECT 'Database creation SQL: CREATE DATABASE roxiler';
-- Note: Must run this outside a transaction block