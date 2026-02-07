# MediDesk HMS - Deployment Guide

This guide covers how to deploy the MediDesk application for production use.

## 1. System Requirements

- **Main Server**: A PC/Server running Windows/Linux with Node.js 18+ and MySQL 8.
- **Client PCs**: Windows PCs connected to the same LAN as the server.

## 2. Server Setup (Back-End)

1.  **Install Node.js & MySQL**: Ensure Node.js and MySQL are installed on the server machine.
2.  **Database Setup**:
    - Create a MySQL database named `medidesk_db`.
    - Navigate to the `server` folder.
    - Copy `.env` and update the database credentials (`DB_HOST`, `DB_USER`, `DB_PASS`).
    - If deploying on a different machine, set `DB_HOST` to `localhost` (relative to the server) or the DB server IP.
    - Run the initial migration:
      ```bash
      cd server
      npm install
      npx ts-node src/init-db.ts
      npx ts-node src/migrate-pharmacy.ts
      npx ts-node src/migrate-rooms.ts
      npx ts-node src/migrate-users.ts
      npx ts-node src/secure-migration.ts
      ```
    - **Note**: The default admin login is `admin` / `admin123`. The migration script `secure-migration.ts` automatically secures this password.

3.  **Start the Server**:
    - For production, build and improved performance:
      ```bash
      npm run build
      npm start
      ```
    - Or use a process manager like PM2 to keep it running:
      ```bash
      npm install -g pm2
      pm2 start dist/index.js --name "medidesk-server"
      ```

4.  **Firewall**: Ensure port **5000** is open on the server so other computers can access the API.

## 3. Client Setup (Front-End / Desktop App)

1.  **Configure API URL**:
    - Open `client/src/config.ts` (create if needed) or update your API calls.
    - Currently, the app points to `http://localhost:5000`.
    - To deploy on other computers, **update all API calls** in the `client/src/pages` to point to the Server's IP Address (e.g., `http://192.168.1.100:5000`).
    - _Recommendation: Create a central Axios instance with the base URL._

2.  **Build the Desktop App**:
    - Navigate to the `client` folder.
    - Run the build command:
      ```bash
      cd client
      npm install
      npm run electron:build
      ```
    - This will generate an installer (e.g., `MediDesk HMS Setup 1.0.0.exe`) in the `client/release` folder.

3.  **Install on Client PCs**:
    - Copy the `.exe` file to the reception/doctor computers.
    - Run the installer to install the application.

## 4. Updates & Maintenance

- **Database Backups**: Regularly backup the `medidesk_db` using `mysqldump`.
- **App Updates**: To update the app, pull the latest code, rebuild the electron app, and reinstall on client machines.
