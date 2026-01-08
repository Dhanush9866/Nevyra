# Admin Seeding Script

This script allows you to seed admin users into the Nevyra database.

## Features

- Create multiple admin users with secure password hashing
- Skip existing admins to avoid duplicates
- Clear all existing admins
- List current admins in the database
- Support for custom admin data via environment variables

## Usage

### Basic Commands

```bash
# Seed default admins
npm run seed:admins

# Clear all admins
npm run seed:admins:clear

# List current admins
npm run seed:admins:list
```

### Direct Script Usage

```bash
# Seed admins
node scripts/seedAdmins.js

# Clear admins
node scripts/seedAdmins.js clear

# List admins
node scripts/seedAdmins.js list
```

## Default Admin Accounts

The script creates three default admin accounts:

1. **Super Admin**
   - Email: `superadmin@nevyra.com`
   - Password: `SuperAdmin123!`

2. **Admin User**
   - Email: `admin@nevyra.com`
   - Password: `Admin123!`

3. **Manager Admin**
   - Email: `manager@nevyra.com`
   - Password: `Manager123!`

## Custom Admin Data

You can provide custom admin data using the `ADMIN_DATA` environment variable:

```bash
# Example with custom admin data
ADMIN_DATA='[{"firstName":"John","lastName":"Doe","email":"john@example.com","phone":"+1234567890","password":"SecurePass123!"}]' npm run seed:admins
```

The `ADMIN_DATA` should be a JSON array of admin objects with the following structure:

```json
[
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "SecurePass123!"
  }
]
```

## Environment Variables

- `MONGO_URI`: MongoDB connection string (default: `mongodb://localhost:27017/nevyra`)
- `ADMIN_DATA`: JSON string of custom admin data (optional)

## Security Notes

- All passwords are hashed using bcrypt with a salt rounds of 12
- The script will skip creating admins that already exist (based on email)
- Passwords are never logged or displayed after creation
- Default credentials are only shown during the initial seeding process

## Error Handling

The script includes comprehensive error handling:
- Database connection failures
- Duplicate email handling
- Invalid data validation
- Graceful cleanup on errors

## Output

The script provides detailed output including:
- Connection status
- Creation/skip status for each admin
- Summary statistics
- Default credentials (only during initial seeding)
- Error messages for any issues
