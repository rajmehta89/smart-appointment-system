-- Create user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'user') THEN
      CREATE USER "user" WITH PASSWORD 'password';
   END IF;
END
$do$;

-- Create database if not exists
SELECT 'CREATE DATABASE appointment_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'appointment_db');

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE appointment_db TO "user"; 