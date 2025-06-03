-- Insert default admin user if not exists
INSERT INTO users (name, email, password, role, phone_number, active)
SELECT 
    'Admin User',
    'admin@example.com',
    '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', -- password: Admin@123
    'ADMIN',
    '+1234567890',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@example.com'
); 