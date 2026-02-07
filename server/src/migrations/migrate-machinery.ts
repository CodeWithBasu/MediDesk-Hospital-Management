import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrateMachinery() {
  console.log("Starting Machinery Migration...");
  console.log("DB Host:", process.env.DB_HOST);

  try {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS machinery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        model_number VARCHAR(100),
        serial_number VARCHAR(100),
        purchase_date DATE,
        last_maintenance_date DATE,
        next_maintenance_date DATE,
        technician_details TEXT,
        description TEXT,
        status ENUM('Operational', 'Under Maintenance', 'Broken', 'Retired') DEFAULT 'Operational',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("'machinery' table checked/created.");
    
    // Seed some initial data if empty
    const [rows]: any = await connection.query('SELECT COUNT(*) as count FROM machinery');
    if (rows[0].count === 0) {
        console.log("Seeding initial machinery data...");
        await connection.query(`
            INSERT INTO machinery (name, type, model_number, status, next_maintenance_date, description)
            VALUES 
            ('MRI Scanner', 'Imaging', 'MRI-3000', 'Operational', DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 'Main MRI scanner in Room 101'),
            ('X-Ray Machine', 'Imaging', 'XR-500', 'Under Maintenance', DATE_ADD(CURDATE(), INTERVAL 1 WEEK), 'Portable X-Ray unit'),
            ('Ventilator 1', 'Life Support', 'VENT-X1', 'Operational', DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'ICU Bed 1'),
            ('Defibrillator', 'Emergency', 'DEFIB-Z', 'Operational', DATE_ADD(CURDATE(), INTERVAL 6 MONTH), 'Emergency Room Station')
        `);
    }

    await connection.end();
    console.log("Machinery migration completed successfully.");

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateMachinery();
