# Database Migrations

This folder contains database migration scripts for the Santi Shradha Medicare App.

## Running Migrations

These scripts are designed to be run manually or as part of a deployment process.

```bash
# Example: Run user migration
npx ts-node src/migrations/migrate-users.ts

# Example: Run emergency tables migration
npx ts-node src/migrations/migrate-emergency.ts
```

## Available Migrations

- `migrate-users.ts`: Updates the `users` table with new columns.
- `migrate-emergency.ts`: Creates `ambulances` and `emergency_contacts` tables.
- `migrate-pharmacy.ts`: Creates/Migrates pharmacy related tables.
- `migrate-rooms.ts`: Creates/Migrates rooms related tables.
- `secure-migration.ts`: Updates insecure passwords to hashed passwords.
