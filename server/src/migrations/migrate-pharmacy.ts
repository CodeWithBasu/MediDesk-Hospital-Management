import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migratePharmacy() {
  console.log("Starting Pharmacy Migration...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected to database.");

    // Create Medicines Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS medicines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        stock INT DEFAULT 0,
        price DECIMAL(10, 2) NOT NULL,
        expiry_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'medicines' created or already exists.");

    // Insert some mock data if empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM medicines');
    const count = (rows as any)[0].count;

    if (count === 0) {
        console.log("Seeding mock medicines...");
        const mockMedicines = [
            ['Paracetamol 500mg', 'Tablet', 500, 2.50, '2027-12-31'],
            ['Amoxicillin 250mg', 'Capsule', 200, 8.00, '2026-06-30'],
            ['Cough Syrup', 'Syrup', 50, 85.00, '2025-08-15'],
            ['Vitamin C', 'Tablet', 1000, 5.00, '2028-01-01'],
            ['Bandage Roll', 'Equipment', 100, 20.00, '2030-01-01']
        ];
        
        await connection.query(
            'INSERT INTO medicines (name, category, stock, price, expiry_date) VALUES ?',
            [mockMedicines]
        );
        console.log("Mock medicines seeded.");
    }

    await connection.end();
    console.log("Migration completed successfully.");

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migratePharmacy();
