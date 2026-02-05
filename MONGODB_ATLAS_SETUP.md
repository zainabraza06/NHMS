# MongoDB Atlas Setup Guide

## Quick Start for MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with your email (free tier available)
3. Create a new project or use default

### Step 2: Create a Cluster
1. Click "Create" button
2. Select "Shared Clusters" (Free tier, 512MB storage)
3. Choose cloud provider and region (closest to your location)
4. Click "Create Cluster"
5. Wait for cluster to be created (usually 1-2 minutes)

### Step 3: Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Enter username: `nhms-user` (or your choice)
4. Enter password: Create a strong password
5. Select "Built-in Role" → "Atlas admin"
6. Click "Add User"

### Step 4: Configure Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow from anywhere" (0.0.0.0/0)
4. For production: Add your actual server IP addresses
5. Click "Confirm"

### Step 5: Get Connection String
1. Click "Clusters" → your cluster name
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<myFirstDatabase>` with `nhms`

Example connection string:
```
mongodb+srv://nhms-user:your-password-here@cluster0.xxxxx.mongodb.net/nhms?retryWrites=true&w=majority
```

### Step 6: Update Backend Configuration

#### Option A: Create `.env` file in backend directory
Create file: `backend/.env`

Copy from `backend/.env.example` and update:
```
MONGODB_URI=mongodb+srv://nhms-user:your-password@cluster0.xxxxx.mongodb.net/nhms?retryWrites=true&w=majority
```

Replace:
- `nhms-user` with your database username
- `your-password` with your database password
- `cluster0.xxxxx` with your cluster name

#### Option B: Use Environment Variables
Set your system environment variables:
- Windows PowerShell:
```powershell
[System.Environment]::SetEnvironmentVariable("MONGODB_URI", "mongodb+srv://...", "User")
```

### Step 7: Start the Backend
```bash
cd backend
npm install
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

## Troubleshooting

### Issue: "Could not connect to database"
**Solution:** 
- Check IP whitelist (Network Access → Add your IP)
- Verify password is correct (no special characters causing issues)
- Check connection string format

### Issue: "Authentication failed"
**Solution:**
- Verify username and password are correct
- Make sure user was created before connecting
- Check no typos in connection string

### Issue: "Connection timeout"
**Solution:**
- Check your internet connection
- Verify IP address is whitelisted
- Try with 0.0.0.0/0 temporarily for testing

### Issue: "Command 'npm start' not found"
**Solution:**
```bash
cd backend
npm install  # Install dependencies first
npm start
```

## Local MongoDB (Alternative)

If you prefer local MongoDB instead of Atlas:

1. **Install MongoDB Community:**
   - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
   - macOS: `brew install mongodb-community`
   - Linux: Follow official MongoDB docs

2. **Start MongoDB Service:**
   - Windows: `mongod` in PowerShell
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Update .env:**
```
MONGODB_URI=mongodb://localhost:27017/nhms
```

4. **Start Backend:**
```bash
npm start
```

## Testing Database Connection

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/tools/compass
2. Paste connection string
3. Click "Connect"
4. You should see the `nhms` database

### Using Backend Health Check
1. Start backend: `npm start`
2. Go to: `http://localhost:5000/health`
3. Should show connection status

### Using curl
```bash
curl http://localhost:5000/health
```

## Production Deployment

For production (Azure, AWS, Heroku, etc.):

1. **Upgrade MongoDB Atlas:**
   - Convert shared cluster to dedicated cluster
   - Use M0 or higher tier

2. **Network Security:**
   - Replace `0.0.0.0/0` with actual server IP
   - Use VPC peering for better security

3. **Backups:**
   - Enable automated backups (Atlas does this by default)
   - Configure backup retention policy

4. **Environment Variable:**
   - Set `MONGODB_URI` in production platform (e.g., Heroku Config Vars)
   - Set `NODE_ENV=production`
   - Set `JWT_SECRET` to a strong random value

## Documentation References

- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **MongoDB Connection Strings:** https://docs.mongodb.com/manual/reference/connection-string/
- **Node.js MongoDB Driver:** https://docs.mongodb.com/drivers/node/
- **Mongoose (ORM):** https://mongoosejs.com/docs/
