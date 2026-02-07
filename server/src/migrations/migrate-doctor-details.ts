import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrateDoctorDetails() {
  console.log("Starting Doctor Details Migration...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    // Add new columns to doctors table
    const columnsToAdd = [
      'ADD COLUMN address TEXT',
      'ADD COLUMN qualification VARCHAR(100)',
      'ADD COLUMN experience_years INT DEFAULT 0',
      'ADD COLUMN joining_date DATE',
      'ADD COLUMN bank_name VARCHAR(100)',
      'ADD COLUMN bank_account_no VARCHAR(50)',
      'ADD COLUMN bank_ifsc VARCHAR(20)',
      'ADD COLUMN aadhaar_number VARCHAR(20)',
      'ADD COLUMN pan_number VARCHAR(20)',
      'ADD COLUMN is_verified BOOLEAN DEFAULT FALSE',
      'ADD COLUMN consultation_fee DECIMAL(10, 2) DEFAULT 0.00'
    ];

    for (const col of columnsToAdd) {
        try {
            await connection.query(`ALTER TABLE doctors ${col}`);
            console.log(`Executed: ${col}`);
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log(`Skipping ${col} (already exists)`);
            } else {
                throw e;
            }
        }
    }

    console.log("Doctor details migration completed successfully.");
    await connection.end();

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateDoctorDetails();
