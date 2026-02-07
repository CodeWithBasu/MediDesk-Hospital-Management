import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migratePayrollV2() {
  console.log("Starting Payroll V2 Migration (Schema Update)...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    // Update recipient_type to VARCHAR to allow more flexible roles (Nurse, Sweeper, etc.)
    await connection.query(`
      ALTER TABLE payroll 
      MODIFY COLUMN recipient_type VARCHAR(50) NOT NULL
    `);
    console.log("Updated 'recipient_type' to VARCHAR(50).");

    await connection.end();
    console.log("Payroll V2 migration completed successfully.");

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migratePayrollV2();
