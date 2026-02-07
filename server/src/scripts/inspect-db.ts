import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function inspectDatabase() {
  console.log(`Connecting to database '${process.env.DB_NAME}'...`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'medidesk_db',
    });

    console.log("Connected successfully.\n");

    // Get all tables
    const [tables] = await connection.query('SHOW TABLES');
    const tableList = (tables as any[]).map(row => Object.values(row)[0]);

    if (tableList.length === 0) {
        console.log("No tables found in the database.");
    } else {
        console.log("Tables found:");
        console.log("-------------");
        
        for (const table of tableList) {
            const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
            const count = (countResult as any)[0].count;
            console.log(`- ${table} (${count} records)`);
            
            if (table === 'medicines') {
                const [structure] = await connection.query(`DESCRIBE ${table}`);
                console.log(structure);
            }
        }
    }

    await connection.end();

  } catch (error) {
    console.error("Error inspecting database:", error);
  }
}

inspectDatabase();
