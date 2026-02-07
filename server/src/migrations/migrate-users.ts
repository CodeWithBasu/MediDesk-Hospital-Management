import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrateUsers() {
  console.log("Starting Users Table Migration...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    // Add new columns to users table if they don't exist
    const [columns] = await connection.query(`SHOW COLUMNS FROM users`);
    const existingColumns = (columns as any[]).map(col => col.Field);

    if (!existingColumns.includes('full_name')) {
        await connection.query(`ALTER TABLE users ADD COLUMN full_name VARCHAR(100) AFTER username`);
        console.log("Added 'full_name' column.");
    }

    if (!existingColumns.includes('email')) {
        await connection.query(`ALTER TABLE users ADD COLUMN email VARCHAR(100) AFTER full_name`);
        console.log("Added 'email' column.");
    }
    
    if (!existingColumns.includes('phone')) {
        await connection.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email`);
        console.log("Added 'phone' column.");
    }

    // Update existing admin user with mock details if null
    await connection.query(`
        UPDATE users 
        SET full_name = 'System Administrator', email = 'admin@medidesk.com', phone = '1234567890' 
        WHERE username = 'admin' AND full_name IS NULL
    `);
    console.log("Updated admin user details.");

    await connection.end();
    console.log("User migration completed successfully.");

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateUsers();
