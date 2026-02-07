import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migratePayroll() {
  console.log("Starting Payroll Table Migration...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    // Create Payroll Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payroll (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recipient_id INT, 
        recipient_type ENUM('Doctor', 'Staff', 'Other') NOT NULL,
        recipient_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'Cash',
        status ENUM('Paid', 'Pending', 'Failed') DEFAULT 'Paid',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created 'payroll' table.");

    // Seed Data
    const [payments] = await connection.query('SELECT * FROM payroll');
    if ((payments as any[]).length === 0) {
        await connection.query(`
            INSERT INTO payroll (recipient_id, recipient_type, recipient_name, amount, payment_date, payment_method, status, notes) VALUES 
            (1, 'Doctor', 'Dr. Smith', 50000.00, CURDATE(), 'Bank Transfer', 'Paid', 'Monthly Salary'),
            (2, 'Staff', 'Nurse Joy', 25000.00, CURDATE(), 'Cash', 'Paid', 'Monthly Salary'),
            (null, 'Other', 'Electric Co.', 1200.00, CURDATE(), 'Online', 'Paid', 'Electricity Bill')
        `);
        console.log("Seeded payroll data.");
    }

    await connection.end();
    console.log("Payroll migration completed successfully.");

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migratePayroll();
