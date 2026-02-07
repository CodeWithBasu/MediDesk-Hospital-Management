import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  console.log("Connecting to MySQL Server...");
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
  });

  try {
    console.log("Connected to MySQL successfully!");
    
    // Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'medidesk_db'}`);
    console.log(`Database '${process.env.DB_NAME}' checked/created.`);
    await connection.changeUser({ database: process.env.DB_NAME || 'medidesk_db' });

    // 1. Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'doctor', 'receptionist', 'pharmacist') DEFAULT 'receptionist',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 2. Patients Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        dob DATE NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        address TEXT,
        blood_group VARCHAR(10),
        allergies TEXT,
        medical_history TEXT,
        emergency_contact_name VARCHAR(100),
        emergency_contact_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Doctors Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        specialization VARCHAR(100) NOT NULL,
        department VARCHAR(100),
        phone VARCHAR(20),
        email VARCHAR(100),
        status ENUM('Active', 'On Leave', 'Unavailable') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Appointments Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT,
        doctor_id INT,
        appointment_date DATETIME NOT NULL,
        reason TEXT,
        status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
        FOREIGN KEY (patient_id) REFERENCES patients(id),
        FOREIGN KEY (doctor_id) REFERENCES doctors(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Invoices Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT,
        amount DECIMAL(10, 2) NOT NULL,
        tax DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        status ENUM('Paid', 'Pending', 'Overdue') DEFAULT 'Pending',
        payment_method VARCHAR(50),
        invoice_date DATE NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("All tables created successfully!");

    // Create Admin User if not exists
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if ((rows as any).length === 0) {
        await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', 'admin123', 'admin']);
        console.log("Admin user created.");
    }

  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    await connection.end();
  }
}

initializeDatabase();
