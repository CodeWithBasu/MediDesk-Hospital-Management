import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Database Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'medidesk_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
app.get('/', (req, res) => {
  res.send('MediDesk API is running');
});

// --- Patient Routes ---

// GET /api/patients
app.get('/api/patients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// POST /api/patients
app.post('/api/patients', async (req, res) => {
  try {
    const { 
      firstName, lastName, dateOfBirth, gender, phone, email, 
      address, bloodGroup, allergies, medicalHistory, 
      emergencyContactName, emergencyContactPhone 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO patients (
        first_name, last_name, dob, gender, phone, email, address, 
        blood_group, allergies, medical_history, 
        emergency_contact_name, emergency_contact_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName, lastName, dateOfBirth, gender, phone, email, address, 
        bloodGroup, allergies, medicalHistory, 
        emergencyContactName, emergencyContactPhone
      ]
    );

    res.status(201).json({ id: (result as any).insertId, message: 'Patient created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating patient' });
  }
});

// DELETE /api/patients/:id
app.delete('/api/patients/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM patients WHERE id = ?', [req.params.id]);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting patient' });
  }
});

// --- Doctor Routes ---

// GET /api/doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM doctors ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// POST /api/doctors
app.post('/api/doctors', async (req, res) => {
  try {
    const { 
      name, specialization, department, phone, email, status 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO doctors (
        name, specialization, department, phone, email, status,
        address, qualification, experience_years, joining_date,
        consultation_fee, aadhaar_number, pan_number,
        bank_name, bank_account_no, bank_ifsc, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, specialization, department, phone, email, status || 'Active',
        req.body.address, req.body.qualification, req.body.experienceYears, req.body.joiningDate,
        req.body.consultationFee, req.body.aadhaarNumber, req.body.panNumber,
        req.body.bankName, req.body.bankAccountNo, req.body.bankIfsc, true
      ]
    );

    res.status(201).json({ id: (result as any).insertId, message: 'Doctor added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding doctor' });
  }
});

// DELETE /api/doctors/:id
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM doctors WHERE id = ?', [req.params.id]);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting doctor' });
  }
});

// --- Appointment Routes ---

// GET /api/appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const query = `
      SELECT a.*, \n             CONCAT(p.first_name, ' ', p.last_name) as patient_name,
             p.phone as patient_phone,
             d.name as doctor_name, d.specialization as doctor_specialization, 
             d.department as doctor_department
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date ASC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// POST /api/appointments
app.post('/api/appointments', async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, reason, status } = req.body;

    const [result] = await pool.query(
      `INSERT INTO appointments (
        patient_id, doctor_id, appointment_date, reason, status
      ) VALUES (?, ?, ?, ?, ?)`,
      [patientId, doctorId, appointmentDate, reason, status || 'Scheduled']
    );

    res.status(201).json({ id: (result as any).insertId, message: 'Appointment booked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

// --- Invoice Routes ---

// GET /api/invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const query = `
      SELECT i.*, CONCAT(p.first_name, ' ', p.last_name) as patient_name
      FROM invoices i
      LEFT JOIN patients p ON i.patient_id = p.id
      ORDER BY i.created_at DESC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
});

// POST /api/invoices
app.post('/api/invoices', async (req, res) => {
  try {
    const { 
      patientId, amount, tax, total, status, method, invoiceDate 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO invoices (
        patient_id, amount, tax, total, status, payment_method, invoice_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patientId, amount, tax, total, status || 'Pending', method || 'Cash', invoiceDate]
    );

    res.status(201).json({ id: (result as any).insertId, message: 'Invoice created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating invoice' });
  }
});
// --- Pharmacy Routes ---

// GET /api/medicines
app.get('/api/medicines', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM medicines ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching medicines' });
  }
});

// POST /api/medicines
app.post('/api/medicines', async (req, res) => {
  try {
    const { name, category, stock, price, expiryDate } = req.body;
    const [result] = await pool.query(
      'INSERT INTO medicines (name, category, stock, price, expiry_date) VALUES (?, ?, ?, ?, ?)',
      [name, category, stock, price, expiryDate]
    );
    res.status(201).json({ id: (result as any).insertId, message: 'Medicine added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding medicine' });
  }
});

// DELETE /api/medicines/:id
app.delete('/api/medicines/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM medicines WHERE id = ?', [req.params.id]);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting medicine' });
  }
});

// --- Room Routes ---

// GET /api/rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const query = `
      SELECT r.*, CONCAT(p.first_name, ' ', p.last_name) as patient_name 
      FROM rooms r 
      LEFT JOIN patients p ON r.patient_id = p.id 
      ORDER BY r.room_number ASC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

// POST /api/rooms
app.post('/api/rooms', async (req, res) => {
  try {
    const { roomNumber, type, pricePerDay, status } = req.body;
    const [result] = await pool.query(
      'INSERT INTO rooms (room_number, type, price_per_day, status) VALUES (?, ?, ?, ?)',
      [roomNumber, type, pricePerDay, status || 'Available']
    );
    res.status(201).json({ id: (result as any).insertId, message: 'Room created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating room' });
  }
});

// PUT /api/rooms/:id
app.put('/api/rooms/:id', async (req, res) => {
  try {
    const { roomNumber, type, pricePerDay, status, patientId } = req.body;
    await pool.query(
      'UPDATE rooms SET room_number = ?, type = ?, price_per_day = ?, status = ?, patient_id = ? WHERE id = ?',
      [roomNumber, type, pricePerDay, status, patientId || null, req.params.id]
    );
    res.json({ message: 'Room updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating room' });
  }
});

// DELETE /api/rooms/:id
app.delete('/api/rooms/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting room' });
  }
});
// --- Admin Database Routes ---

// GET /api/admin/tables
app.get('/api/admin/tables', async (req, res) => {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    const tables = (rows as any[]).map(row => Object.values(row)[0]);
    res.json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tables' });
  }
});

// GET /api/admin/tables/:name
app.get('/api/admin/tables/:name', async (req, res) => {
  const tableName = req.params.name;
  try {
    // Validate table name to prevent SQL injection (simple check)
    const [tables] = await pool.query('SHOW TABLES');
    const validTables = (tables as any[]).map(row => Object.values(row)[0]);
    
    if (!validTables.includes(tableName)) {
         return res.status(400).json({ message: 'Invalid table name' });
    }

    const [rows] = await pool.query(`SELECT * FROM ${tableName} LIMIT 100`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching table data' });
  }
});

// --- Search Route ---

app.get('/api/search', async (req, res) => {
  const query = req.query.q as string;
  if (!query || query.length < 2) {
    return res.json({ patients: [], doctors: [], medicines: [] });
  }

  try {
    const searchTerm = `%${query}%`;
    
    const [patients] = await pool.query(
      'SELECT id, first_name, last_name, phone FROM patients WHERE first_name LIKE ? OR last_name LIKE ? OR phone LIKE ? LIMIT 5',
      [searchTerm, searchTerm, searchTerm]
    );

    const [doctors] = await pool.query(
      'SELECT id, name, specialization FROM doctors WHERE name LIKE ? OR specialization LIKE ? LIMIT 5',
      [searchTerm, searchTerm]
    );

    const [medicines] = await pool.query(
      'SELECT id, name, category, stock FROM medicines WHERE name LIKE ? OR category LIKE ? LIMIT 5',
      [searchTerm, searchTerm]
    );

    res.json({
      patients,
      doctors,
      medicines
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Search error' });
  }
});



// --- Auth Route ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check user
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const users = rows as any[];

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Secure password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate Token
    const token = jwt.default.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.full_name
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- User / Staff Routes ---

// GET /api/users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, role, full_name, email, phone, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// POST /api/users (Register Staff)
app.post('/api/users', async (req, res) => {
  try {
    const { 
        username, password, role, fullName, email, phone,
        address, bankName, bankAccountNo, bankIfsc, aadhaarNumber, designation
    } = req.body;
    
    // Check if username exists
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if ((existing as any[]).length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash Password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    // User already requested "verified", let's verify by default on creation if admin creates
    
    // For simplicity, we can reuse the existing bcrypt import if available or re-import
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      `INSERT INTO users (
        username, password, role, full_name, email, phone, 
        address, bank_name, bank_account_no, bank_ifsc, 
        aadhaar_number, designation, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username, hashedPassword, role || 'receptionist', fullName, email, phone,
        address, bankName, bankAccountNo, bankIfsc, 
        aadhaarNumber, designation, true  // Auto-verify if created by admin
      ]
    );

    res.status(201).json({ id: (result as any).insertId, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// PUT /api/users/:id (Update Profile)
app.put('/api/users/:id', async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;
    
    // If password provided, hash it
    if (password) {
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
         
         await pool.query(
            'UPDATE users SET full_name = ?, email = ?, phone = ?, password = ? WHERE id = ?',
            [full_name, email, phone, hashedPassword, req.params.id]
        );
    } else {
        await pool.query(
            'UPDATE users SET full_name = ?, email = ?, phone = ? WHERE id = ?',
            [full_name, email, phone, req.params.id]
        );
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
});


// DELETE /api/users/:id
app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// --- Ambulance Routes ---

// GET /api/ambulances
app.get('/api/ambulances', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ambulances ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching ambulances' });
  }
});

// POST /api/ambulances
app.post('/api/ambulances', async (req, res) => {
  try {
    const { vehicleNumber, driverName, contactNumber, status } = req.body;
    const [result] = await pool.query(
      'INSERT INTO ambulances (vehicle_number, driver_name, contact_number, status) VALUES (?, ?, ?, ?)',
      [vehicleNumber, driverName, contactNumber, status || 'Available']
    );
    res.status(201).json({ id: (result as any).insertId, message: 'Ambulance added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding ambulance' });
  }
});

// DELETE /api/ambulances/:id
app.delete('/api/ambulances/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ambulances WHERE id = ?', [req.params.id]);
    res.json({ message: 'Ambulance deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting ambulance' });
  }
});

// --- Emergency Contact Routes ---

// GET /api/emergency-contacts
app.get('/api/emergency-contacts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM emergency_contacts ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

// POST /api/emergency-contacts
app.post('/api/emergency-contacts', async (req, res) => {
  try {
    const { name, role, contactNumber, isInternal } = req.body;
    const [result] = await pool.query(
      'INSERT INTO emergency_contacts (name, role, contact_number, is_internal) VALUES (?, ?, ?, ?)',
      [name, role, contactNumber, isInternal]
    );
    res.status(201).json({ id: (result as any).insertId, message: 'Contact added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding contact' });
  }
});

// DELETE /api/emergency-contacts/:id
app.delete('/api/emergency-contacts/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM emergency_contacts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

// --- Payroll Routes ---

// GET /api/payroll
app.get('/api/payroll', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payroll ORDER BY payment_date DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payroll' });
  }
});

// POST /api/payroll
app.post('/api/payroll', async (req, res) => {
  try {
    const { recipientId, recipientType, recipientName, amount, paymentDate, method, status, notes } = req.body;
    const [result] = await pool.query(
      `INSERT INTO payroll (
        recipient_id, recipient_type, recipient_name, amount, payment_date, payment_method, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [recipientId || null, recipientType, recipientName, amount, paymentDate, method || 'Cash', status || 'Paid', notes]
    );
    res.status(201).json({ id: (result as any).insertId, message: 'Payment recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error recording payment' });
  }
});

// --- Machinery Routes ---

// GET /api/machinery
app.get('/api/machinery', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM machinery ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching machinery' });
  }
});

// POST /api/machinery
app.post('/api/machinery', async (req, res) => {
  try {
    const { 
        name, type, modelNumber, serialNumber, purchaseDate, 
        lastMaintenanceDate, nextMaintenanceDate, technicianDetails, 
        description, status 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO machinery (
        name, type, model_number, serial_number, purchase_date, 
        last_maintenance_date, next_maintenance_date, technician_details, 
        description, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, type, modelNumber, serialNumber, purchaseDate || null, 
        lastMaintenanceDate || null, nextMaintenanceDate || null, technicianDetails, 
        description, status || 'Operational'
      ]
    );
    res.status(201).json({ id: (result as any).insertId, message: 'Machinery added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding machinery' });
  }
});

// PUT /api/machinery/:id
app.put('/api/machinery/:id', async (req, res) => {
    try {
      const { 
          name, type, modelNumber, serialNumber, purchaseDate, 
          lastMaintenanceDate, nextMaintenanceDate, technicianDetails, 
          description, status 
      } = req.body;
  
      await pool.query(
        `UPDATE machinery SET 
            name = ?, type = ?, model_number = ?, serial_number = ?, purchase_date = ?, 
            last_maintenance_date = ?, next_maintenance_date = ?, technician_details = ?, 
            description = ?, status = ?
         WHERE id = ?`,
        [
          name, type, modelNumber, serialNumber, purchaseDate || null, 
          lastMaintenanceDate || null, nextMaintenanceDate || null, technicianDetails, 
          description, status, req.params.id
        ]
      );
      res.json({ message: 'Machinery updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating machinery' });
    }
  });

// DELETE /api/machinery/:id
app.delete('/api/machinery/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM machinery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Machinery deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting machinery' });
  }
});

// --- Laundry Routes ---

// GET /api/laundry
app.get('/api/laundry', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM laundry ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching laundry items' });
  }
});

// POST /api/laundry
app.post('/api/laundry', async (req, res) => {
  try {
    const { 
        itemType, quantity, roomNumber, ward, status, 
        lastWashedDate, nextWashDue, assignedTo, notes 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO laundry (
        item_type, quantity, room_number, ward, status, 
        last_washed_date, next_wash_due, assigned_to, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemType, quantity, roomNumber || null, ward || null, status || 'Clean', 
        lastWashedDate || null, nextWashDue || null, assignedTo || null, notes
      ]
    );
    res.status(201).json({ id: (result as any).insertId, message: 'Laundry item added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding laundry item' });
  }
});

// PUT /api/laundry/:id
app.put('/api/laundry/:id', async (req, res) => {
    try {
      const { 
          itemType, quantity, roomNumber, ward, status, 
          lastWashedDate, nextWashDue, assignedTo, notes 
      } = req.body;
  
      await pool.query(
        `UPDATE laundry SET 
            item_type = ?, quantity = ?, room_number = ?, ward = ?, status = ?, 
            last_washed_date = ?, next_wash_due = ?, assigned_to = ?, notes = ?
         WHERE id = ?`,
        [
          itemType, quantity, roomNumber || null, ward || null, status, 
          lastWashedDate || null, nextWashDue || null, assignedTo || null, notes, req.params.id
        ]
      );
      res.json({ message: 'Laundry item updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating laundry item' });
    }
  });

// DELETE /api/laundry/:id
app.delete('/api/laundry/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM laundry WHERE id = ?', [req.params.id]);
    res.json({ message: 'Laundry item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting laundry item' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

