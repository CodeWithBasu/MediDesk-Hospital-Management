import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrateRooms() {
  console.log("Starting Rooms Table Migration...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    // Create Rooms Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_number VARCHAR(20) NOT NULL UNIQUE,
        type ENUM('General', 'Private', 'ICU', 'Ward') NOT NULL,
        price_per_day DECIMAL(10, 2) NOT NULL,
        status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
        patient_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
      )
    `);
    console.log("Table 'rooms' created or already exists.");

    // Insert mock data if empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM rooms');
    const count = (rows as any)[0].count;

    if (count === 0) {
        console.log("Seeding mock rooms...");
        const mockRooms = [
            ['101', 'General', 500.00, 'Available', null],
            ['102', 'General', 500.00, 'Occupied', 1], // Assuming patient ID 1 exists, otherwise this might fail if foreign key checks enforce it strictly and table is empty. safe to leave null for now or ensure patient exists.
            ['201', 'Private', 1500.00, 'Available', null],
            ['301', 'ICU', 5000.00, 'Maintenance', null],
            ['103', 'General', 500.00, 'Available', null]
        ];
        
        // We need to be careful with foreign keys in mock data. Let's insert without patient_id for safety initially, or check if patients exist.
        // For simplicity in this migration script, I'll insert without patient_id to avoid FK errors.
        const safeMockRooms = mockRooms.map(r => [r[0], r[1], r[2], r[3], null]);

        await connection.query(
            'INSERT INTO rooms (room_number, type, price_per_day, status, patient_id) VALUES ?',
            [safeMockRooms]
        );
        console.log("Mock rooms seeded.");
    }

    await connection.end();
    console.log("Room migration completed successfully.");

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateRooms();
