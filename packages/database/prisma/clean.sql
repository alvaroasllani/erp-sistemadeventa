-- Clean all data except users, products, categories, tenants, and company_settings
DELETE FROM sale_items;
DELETE FROM sales;
DELETE FROM transactions;
DELETE FROM customers;
