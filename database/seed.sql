-- ============================================================
-- Asset Tracker — Seed Data (development only)
-- ============================================================
USE asset_tracker;

-- Demo user (password: Demo@1234)
INSERT INTO users (full_name, email, hashed_password) VALUES
('Demo User', 'demo@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW');

-- Sections for demo user
INSERT INTO sections (user_id, name, description, icon) VALUES
(1, 'Electronics',  'Phones, laptops, tablets',         'cpu'),
(1, 'Car',          'Vehicle and car accessories',       'car'),
(1, 'Kitchen',      'Appliances and cookware',           'chef-hat'),
(1, 'Furniture',    'Home furniture and decor',          'sofa');

-- Items for demo user
INSERT INTO items (section_id, user_id, name, buying_price, purchase_year, condition, brand, notes) VALUES
(1, 1, 'MacBook Pro 14"', 1999.00, 2023, 'excellent', 'Apple',   'M3 Pro chip'),
(1, 1, 'iPhone 15 Pro',    999.00, 2023, 'good',      'Apple',   '256GB Space Black'),
(2, 1, 'Honda Civic',    22000.00, 2021, 'good',      'Honda',   '2021 model, serviced Jan 2024'),
(3, 1, 'Air Fryer',        129.99, 2022, 'good',      'Philips', '5.7L XXL');
