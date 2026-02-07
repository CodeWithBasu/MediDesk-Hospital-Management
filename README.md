# MediDesk - Advanced Hospital Management System (HMS)

![MediDesk Banner](https://via.placeholder.com/1200x400?text=MediDesk+HMS+Dashboard)

**MediDesk** is a comprehensive, modern, and secure Hospital Management System designed to streamline healthcare operations. Built with cutting-edge technologies, it offers a seamless experience for doctors, staff, and administrators to manage patient records, appointments, billing, pharmacy inventory, and emergency services.

---

## 🚀 Key Features

### 🏥 **Core Clinical Modules**

- **Patient Management**: Complete electronic health records (EHR), demographics, medical history, and visit logs.
- **Doctor Management**: Manage doctor profiles, specializations, departments, and availability.
- **Appointment Scheduling**: Interactive calendar for booking, rescheduling, and tracking patient appointments.
- **Room Management**: Track room occupancy, ward types (General, ICU, Private), and bed availability.

### 💊 **Pharmacy & Inventory**

- **Medicine Inventory**: Real-time tracking of medicine stock, expiry dates, and categories.
- **Low Stock Alerts**: Automated notifications for medicines running low.

### 💰 **Finance & Administration**

- **Billing System**: Generate invoices, track payments, and manage insurance details.
- **Staff Management**: Manage nurse, receptionist, and support staff profiles.
- **Report Analytics**: Visual dashboard with charts for patient trends, revenue, and hospital occupancy.

### 🚨 **Emergency Services**

- **Ambulance Fleet**: Manage ambulance availability, drivers, and maintenance status.
- **Emergency Contacts**: Quick access to internal and external emergency numbers (Police, Fire, Blood Bank).

### 🔒 **Security & Settings**

- **RBAC (Role-Based Access Control)**: Secure login for Admins, Doctors, and Staff.
- **Audit Logs**: Track system activities for security and compliance.
- **Profile Settings**: User profile management and password security.

---

## 🛠️ Technology Stack

| Component          | Technology        | Description                                       |
| :----------------- | :---------------- | :------------------------------------------------ |
| **Frontend**       | React 18          | Modern UI library for dynamic interfaces          |
| **Styling**        | TailwindCSS       | Utility-first CSS framework for responsive design |
| **Desktop App**    | Electron          | Cross-platform desktop application wrapper        |
| **Backend**        | Node.js & Express | Scalable REST API server                          |
| **Database**       | MySQL             | Relational database for structured data           |
| **Authentication** | JWT & Bcrypt      | Secure token-based auth and password hashing      |
| **Language**       | TypeScript        | Statically typed JavaScript for robust code       |

---

## ⚙️ Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MySQL Server** (v8.0 or higher)
- **Git**

---

## 📥 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/medidesk-app.git
cd medidesk-app
```

### 2. Backend Setup (Server)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Copy `.env.example` to `.env` (or create a new `.env` file).
    - Update the database credentials:
      ```env
      PORT=5000
      DB_HOST=localhost
      DB_USER=root
      DB_PASS=your_password
      DB_NAME=medidesk_db
      JWT_SECRET=your_super_secret_key
      ```
4.  Initialize Database & Migrations:

    ```bash
    # Create tables and seed initial data
    npx ts-node src/init-db.ts

    # Run all migrations
    npx ts-node src/migrations/migrate-users.ts
    npx ts-node src/migrations/migrate-rooms.ts
    npx ts-node src/migrations/migrate-pharmacy.ts
    npx ts-node src/migrations/migrate-emergency.ts
    npx ts-node src/migrations/secure-migration.ts
    ```

5.  Start the Server:
    ```bash
    npm run dev
    ```
    The server should now be running on `http://localhost:5000`.

### 3. Frontend Setup (Client)

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server (Electron):
    ```bash
    npm run dev:electron
    ```
    This will launch the application in a desktop window.

---

## 📦 Building for Production

To create a standalone executable (`.exe`, `.dmg`, etc.) for deployment:

1.  Build the React app and Electron wrapper:
    ```bash
    cd client
    npm run electron:build
    ```
2.  The installer will be generated in `client/release`.

---

## 📂 Project Structure

```bash
medidesk-app/
├── client/                 # Frontend (React + Electron)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts (Dashboard, Auth)
│   │   ├── pages/          # Application views/screens
│   │   ├── utils/          # Helper functions
│   │   └── App.tsx         # Main functionality
│   └── electron/           # Electron main process files
│
├── server/                 # Backend (Node + Express)
│   ├── src/
│   │   ├── migrations/     # Database schema updates
│   │   ├── scripts/        # Maintenance scripts
│   │   ├── index.ts        # Server entry point
│   │   └── init-db.ts      # Database setup
│   └── .env                # Environment variables
│
└── DEPLOYMENT.md           # Detailed deployment guide
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed by Santi Shradha Medicare PVT-LTD Team**
_Empowering Healthcare with Technology._
