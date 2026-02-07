import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrateUserDetails() {
  console.log("Starting User Details Migration...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    // Add new columns to users table
    const columnsToAdd = [
      'ADD COLUMN address TEXT',
      'ADD COLUMN bank_name VARCHAR(100)',
      'ADD COLUMN bank_account_no VARCHAR(50)',
      'ADD COLUMN bank_ifsc VARCHAR(20)',
      'ADD COLUMN aadhaar_number VARCHAR(20)',
      'ADD COLUMN designation VARCHAR(100)', // Field they work in
      'ADD COLUMN is_verified BOOLEAN DEFAULT FALSE'
    ];

    for (const col of columnsToAdd) {
        try {
            await connection.query(`ALTER TABLE users ${col}`);
            console.log(`Executed: ${col}`);
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log(`Skipping ${col} (already exists)`);
            } else {
                throw e;
            }
        }
    }

    console.log("User details migration completed successfully.");
    await connection.end();

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateUserDetails();
