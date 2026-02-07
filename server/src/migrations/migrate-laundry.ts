import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrateLaundry() {
  console.log("Starting Laundry Migration...");
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS laundry (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_type VARCHAR(100) NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        room_number VARCHAR(20),
        ward VARCHAR(50),
        status ENUM('Clean', 'Dirty', 'In Laundry', 'Lost/Damaged') DEFAULT 'Clean',
        last_washed_date DATE,
        next_wash_due DATE,
        assigned_to VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("'laundry' table created or already exists.");
    
    // Seed some initial data if empty
    const [rows]: any = await connection.query('SELECT COUNT(*) as count FROM laundry');
    if (rows[0].count === 0) {
        console.log("Seeding initial laundry data...");
        await connection.query(`
            INSERT INTO laundry (item_type, quantity, room_number, ward, status, next_wash_due)
            VALUES 
            ('Bed Sheets', 50, NULL, 'General Ward', 'Clean', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
            ('Pillow Covers', 60, NULL, 'General Ward', 'Clean', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
            ('Patient Gowns', 40, NULL, 'ICU', 'Dirty', CURDATE()),
            ('Towels', 80, NULL, 'General Ward', 'Clean', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
            ('Blankets', 30, '101', NULL, 'In Laundry', DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
            ('Surgical Drapes', 25, NULL, 'Operation Theatre', 'Clean', DATE_ADD(CURDATE(), INTERVAL 5 DAY))
        `);
    }

    await connection.end();
    console.log("Laundry migration completed successfully.");

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateLaundry();
