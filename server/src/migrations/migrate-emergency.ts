import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

dotenv.config();

async function migrateEmergency() {
  console.log("Starting Emergency Tables Migration...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    // Create Ambulances Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ambulances (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vehicle_number VARCHAR(20) NOT NULL UNIQUE,
        driver_name VARCHAR(100),
        contact_number VARCHAR(20),
        status ENUM('Available', 'On Call', 'Maintenance') DEFAULT 'Available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created 'ambulances' table.");

    // Create Emergency Contacts Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50),
        contact_number VARCHAR(20) NOT NULL,
        is_internal BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created 'emergency_contacts' table.");

    // Seed Data
    const [ambulances] = await connection.query('SELECT * FROM ambulances');
    if ((ambulances as any[]).length === 0) {
        await connection.query(`
            INSERT INTO ambulances (vehicle_number, driver_name, contact_number, status) VALUES 
            ('AMC-001', 'Ramesh Kumar', '+91 98987 65432', 'Available'),
            ('AMC-002', 'Suresh Singh', '+91 87654 32109', 'On Call')
        `);
        console.log("Seeded ambulances.");
    }

    const [contacts] = await connection.query('SELECT * FROM emergency_contacts');
    if ((contacts as any[]).length === 0) {
        await connection.query(`
            INSERT INTO emergency_contacts (name, role, contact_number, is_internal) VALUES 
            ('City General Hospital', 'Referral Center', '011-23456789', FALSE),
            ('Fire Station (Sector 4)', 'Emergency', '101', FALSE),
            ('Police Station (North)', 'Emergency', '100', FALSE),
            ('Blood Bank', 'Support', '011-23451234', TRUE)
        `);
        console.log("Seeded emergency contacts.");
    }

    await connection.end();
    console.log("Emergency migration completed successfully.");

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateEmergency();
