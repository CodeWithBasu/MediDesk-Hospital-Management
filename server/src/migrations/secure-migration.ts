import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

dotenv.config();

async function secureUsers() {
  console.log("Starting User Security Migration...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    // Fetch all users
    const [rows] = await connection.query('SELECT id, username, password FROM users');
    const users = rows as any[];
    console.log(`Found ${users.length} users.`);

    for (const user of users) {
        // Simple check if password appears to be hashed
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            console.log(`User ${user.username} already has secured password. Skipping.`);
            continue;
        }

        console.log(`Securing password for user: ${user.username}...`);
        
        // Hash the plaintext password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
        console.log(`Password updated for ${user.username}.`);
    }

    await connection.end();
    console.log("Security migration completed successfully.");

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

secureUsers();
