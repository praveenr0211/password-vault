# 🔐 Password Vault

A secure, full-stack password manager with **end-to-end client-side encryption** built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS.

![Password Vault](https://img.shields.io/badge/Security-End--to--End%20Encrypted-success)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)## ✨ Features

### Core Features

- **🔒 Client-Side Encryption**: All vault items are encrypted using **Web Crypto API (PBKDF2 + AES-GCM)** before being sent to the server
- **🔐 Secure Authentication**: Email + password with **bcrypt hashing** (12 rounds) and **JWT tokens** (7-day expiration)
- **🎲 Password Generator**: Generate strong passwords with customizable options (length, character types, strength meter)
- **📋 Smart Clipboard**: Copy passwords with auto-clear after 30 seconds
- **🔍 Search & Filter**: Quickly find vault items by title, username, URL, or tags
- **✏️ CRUD Operations**: Create, read, update, and delete vault items with instant feedback

### Advanced Features ⭐ NEW

- **🏷️ Tags & Organization**: Add multiple tags to vault items (e.g., "work", "personal", "banking")
  - Filter items by clicking tag buttons
  - Search includes tag names
  - Beautiful color-coded tag badges with emojis
- **📦 Export & Import**: Backup and restore your entire vault
  - Export to JSON backup file with metadata
  - Import from previous backups (bulk upload)
  - Encrypted data remains encrypted in backups
- **🌙 Dark Mode**: Beautiful UI with automatic dark mode support
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **✨ Modern UI**: Glass morphism effects, animated gradient backgrounds, smooth transitions

## 🎬 Quick Demo

1. **Sign Up**: Create an account with email and strong master password
2. **Generate Password**: Use the password generator with customizable options
3. **Save with Tags**: Add items with tags like "work, email, google"
4. **Organize**: Filter by tags, search across all fields
5. **Export**: Download encrypted backup of your entire vault
6. **Import**: Restore from backup files with one click

## 📸 Screenshots

- **Landing Page**: Modern hero section with animated gradients
- **Dashboard**: Password generator + vault list with tag filtering
- **Add/Edit Modal**: Clean form with tags input and password preview
- **Export/Import**: One-click backup and restore functionality

## 🔐 Security Architecture

### Client-Side Encryption

Password Vault implements **zero-knowledge encryption**:

1. **Key Derivation**: Your master password is used to derive an encryption key via **PBKDF2** (100,000 iterations, SHA-256)
2. **Encryption**: Vault items are encrypted client-side using **AES-GCM (256-bit)** with unique IV per item
3. **Storage**: Only encrypted ciphertext is transmitted and stored in MongoDB
4. **Decryption**: Items are decrypted client-side only when you access your vault

**Encryption Flow:**

```
Master Password → PBKDF2 (100k iterations) → AES-256 Key → Encrypt Data → Server (Ciphertext Only)
```

### AuthenticationCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- **Password Hashing**: bcrypt with 12 rounds for secure password storage
- **Session Management**: JWT tokens with 7-day expiration
- **Authorization**: Protected API routes verify JWT on every request

> **Note**: Your master password **never leaves your device**. Even if our database is compromised, your vault items remain encrypted and secure.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB Atlas account (free tier works perfectly)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/password-vault.git
cd password-vault

# Install dependencies
npm install

# Set up environment variables (see below)

# Run development server
npm run dev

# Open http://localhost:3000
```

### Detailed Installation

**1. Set up environment variables**

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/password-vault?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting MongoDB URI:**

- Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Click "Connect" → "Connect your application"
- Copy the connection string and replace `<username>`, `<password>`, and database name
- **Important**: URL-encode special characters in password (e.g., `@` becomes `%40`)

**Generating JWT Secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**2. Run the development server**

```bash
npm run dev
```

**3. Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
password-vault/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── signup/route.ts    # User registration
│   │   │   │   └── login/route.ts     # User login
│   │   │   └── vault/
│   │   │       ├── route.ts           # GET/POST vault items
│   │   │       ├── [id]/route.ts      # PUT/DELETE vault item
│   │   │       └── import/route.ts    # Bulk import vault items ⭐ NEW
│   │   ├── dashboard/page.tsx         # Main dashboard (with Export/Import) ⭐
│   │   ├── login/page.tsx            # Auth page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Global styles with animations
│   ├── components/
│   │   ├── PasswordGenerator.tsx     # Password generator with strength meter
│   │   ├── VaultList.tsx            # Vault items list (with Tags filter) ⭐
│   │   └── VaultItemModal.tsx       # Add/edit modal (with Tags input) ⭐
│   ├── contexts/
│   │   └── AuthContext.tsx          # Auth state management
│   ├── lib/
│   │   ├── auth.ts                  # JWT utilities
│   │   ├── crypto.ts                # Encryption functions (PBKDF2 + AES-GCM)
│   │   ├── db.ts                    # MongoDB connection
│   │   └── password-generator.ts    # Password generation logic
│   └── models/
│       ├── User.ts                  # User model
│       └── VaultItem.ts             # Vault item model (with tags field) ⭐
├── .env.local                       # Environment variables
├── package.json
├── README.md
├── SETUP.md                         # Quick setup guide
├── DEPLOYMENT.md                    # Deployment checklist
├── NEW_FEATURES.md                  # Tags & Export/Import documentation ⭐
└── TESTING_CHECKLIST.md            # Comprehensive testing guide ⭐
```

## 🗄️ Database Schema

### Users Collection

```typescript
{
  email: string,           // User's email (unique)
  passwordHash: string,    // bcrypt hash of master password
  encSalt: string,        // Salt for PBKDF2 key derivation
  createdAt: Date
}
```

### VaultItems Collection

```typescript
{
  userId: ObjectId,        // Reference to user
  title: string,          // Item title (plaintext)
  username: string,       // Username/email (plaintext)
  passwordCipher: string, // Encrypted password (ciphertext)
  url: string,           // Website URL (optional)
  notesCipher: string,   // Encrypted notes (optional, ciphertext)
  tags: string[],        // Tags array (plaintext) ⭐ NEW
  createdAt: Date,
  updatedAt: Date
}
```

**Note**: Only `passwordCipher` and `notesCipher` are encrypted. Title, username, URL, and tags are stored as plaintext for search and filter functionality.

## 🎯 Usage

### 1. **Create an Account**

- Sign up with email and a strong master password
- Your encryption salt is automatically generated

### 2. **Generate Passwords**

- Use the password generator to create strong passwords
- Customize length and character types
- Exclude similar-looking characters for better readability

### 3. **Save to Vault**

- Click "Use This Password" or "Add Item"
- Enter website details
- Password is encrypted client-side before saving

### 4. **Organize with Tags** ⭐ NEW

- Add comma-separated tags when creating items: "work, email, google"
- Filter items by clicking tag buttons
- Tags appear as colorful badges with emojis
- Search includes tag names

### 5. **Backup & Restore** ⭐ NEW

- **Export**: Click "Export" button to download encrypted JSON backup
  - Filename: `vault-backup-YYYY-MM-DD.json`
  - Contains all vault items with metadata
- **Import**: Click "Import" button to restore from backup
  - Validates file structure
  - Bulk imports all items at once
  - Shows success notification with item count

### 6. **Manage Items**

- Search through your vault by title, username, URL, or tags
- Copy passwords to clipboard (auto-clears after 30 seconds)
- Edit or delete items with instant feedback
- View decrypted passwords on demand

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. **Add environment variables**

   - In Vercel dashboard → Settings → Environment Variables
   - Add `MONGODB_URI`, `JWT_SECRET`, and `NEXT_PUBLIC_APP_URL`

4. **Deploy!**
   - Vercel automatically deploys on push to main branch

### MongoDB Atlas Setup

1. **Whitelist Vercel IPs** (or use 0.0.0.0/0 for simplicity)
2. **Update connection string** in environment variables
3. **Test the connection** after deployment

## 🧪 Testing

### Manual Testing Checklist

#### Authentication

- [ ] Sign up with new account
- [ ] Log in with existing account
- [ ] Logout functionality

#### Password Generator

- [ ] Generate password with different options
- [ ] Check strength meter (Weak/Medium/Strong)
- [ ] Use generated password button

#### Vault Management

- [ ] Save vault item with generated password
- [ ] Add item with tags (e.g., "work, personal, banking") ⭐
- [ ] Search for vault items by title, username, URL
- [ ] Search by tag name ⭐
- [ ] Filter by clicking tag buttons ⭐
- [ ] Edit existing item and modify tags ⭐
- [ ] Copy password to clipboard (verify auto-clear after 30s)
- [ ] Delete vault item

#### Export/Import ⭐ NEW

- [ ] Export vault to JSON (check Downloads folder)
- [ ] Verify backup file structure and encryption
- [ ] Import vault from JSON file
- [ ] Delete items and restore from backup
- [ ] Import validation with invalid file

#### Security

- [ ] Verify ciphertext in MongoDB (passwords should be encrypted)
- [ ] Check JWT token in cookies/localStorage
- [ ] Test protected routes without authentication

### Verify Encryption

Connect to MongoDB and check a vault item:

```json
{
  "title": "Gmail",
  "username": "user@example.com",
  "passwordCipher": "YWRzZmFzZGZhc2RmYXNkZmFzZGY=...", // Base64 ciphertext
  "notesCipher": "cXdlcnR5dWlvcGFzZGZnaGprbA==..." // Base64 ciphertext
}
```

You should see **unintelligible ciphertext** for password and notes fields.

## 🛡️ Security Notes

✅ **What We Do**

- Client-side encryption with Web Crypto API
- PBKDF2 key derivation (100,000 iterations)
- AES-GCM authenticated encryption
- bcrypt password hashing
- JWT session tokens
- HTTPS in production (via Vercel)

⚠️ **Important**

- Master password is **never sent to server**
- If you forget your master password, **data cannot be recovered**
- Always use HTTPS in production
- Regularly update dependencies
- Use strong master passwords (16+ characters)

## 📝 Technical Details

### Encryption Implementation

**I used Web Crypto API (PBKDF2 + AES-GCM) for client-side encryption so vault items are only decrypted client-side. Passwords are hashed with bcrypt for authentication.**

**Key Derivation (PBKDF2):**

- 100,000 iterations for strong key stretching
- SHA-256 hash algorithm
- Unique salt per user (stored in database)
- Derives 256-bit AES key from master password

**Encryption (AES-GCM):**

- 256-bit encryption keys
- 96-bit Initialization Vector (IV) per item
- Authenticated encryption (prevents tampering)
- IV + ciphertext stored as Base64

**Storage Format:**

```
salt:iv:ciphertext
```

Example: `abc123...:def456...:ghi789...`

### Why This Stack?

- **Next.js 15**: App Router, Server Components, API routes, Turbopack
- **TypeScript**: Type safety, IntelliSense, better developer experience
- **MongoDB Atlas**: Flexible NoSQL schema, easy scaling, free tier
- **Tailwind CSS 4**: Utility-first styling, dark mode, animations
- **Web Crypto API**: Native browser encryption (no external crypto libraries needed)
- **Zod**: Runtime type validation for API routes
- **bcrypt**: Industry-standard password hashing
- **JWT**: Stateless authentication tokens

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Author

Built with ❤️ using Claude and VS Code

---

## 🎯 Feature Completion Status

| Feature                                   | Status         |
| ----------------------------------------- | -------------- |
| User Authentication (Signup/Login)        | ✅ Complete    |
| Password Generator                        | ✅ Complete    |
| Client-Side Encryption (PBKDF2 + AES-GCM) | ✅ Complete    |
| Vault CRUD Operations                     | ✅ Complete    |
| Search & Filter                           | ✅ Complete    |
| Tags & Organization                       | ✅ Complete ⭐ |
| Export to JSON Backup                     | ✅ Complete ⭐ |
| Import from JSON Backup                   | ✅ Complete ⭐ |
| Dark Mode                                 | ✅ Complete    |
| Responsive Design                         | ✅ Complete    |
| Clipboard Auto-Clear                      | ✅ Complete    |
| Modern UI/UX                              | ✅ Complete    |

### Potential Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Password strength requirements on signup
- [ ] Rate limiting for API routes
- [ ] Account recovery options
- [ ] Audit logs for security events
- [ ] Biometric authentication
- [ ] Browser extension
- [ ] Password sharing with other users
- [ ] Password expiration reminders

## 📚 Documentation

- **README.md** (this file) - Comprehensive project overview
- **SETUP.md** - Quick start guide for developers
- **DEPLOYMENT.md** - Production deployment checklist
- **NEW_FEATURES.md** - Detailed Tags & Export/Import documentation
- **TESTING_CHECKLIST.md** - Systematic testing procedures
- **QUICKSTART.md** - Quick reference card

---

## 🌟 Key Highlights

### Security First

✅ **Zero-knowledge encryption** - Your data is encrypted on your device before it ever reaches our servers  
✅ **PBKDF2 + AES-GCM** - Industry-standard encryption with 100,000 iterations  
✅ **No plain-text storage** - Passwords and notes are always encrypted in the database  
✅ **Open source** - Full transparency, audit the code yourself

### Feature Rich

✅ **Smart password generator** with strength meter  
✅ **Tags & organization** for better vault management  
✅ **Export/Import** for easy backups and migrations  
✅ **Real-time search** across all fields including tags  
✅ **Dark mode** with beautiful glass morphism UI  
✅ **Auto-clearing clipboard** for enhanced security

### Developer Friendly

✅ **Modern stack** - Next.js 15 + TypeScript + MongoDB  
✅ **Well documented** - Multiple guides for setup, deployment, and testing  
✅ **Type-safe** - Full TypeScript coverage  
✅ **Easy deployment** - One-click deploy to Vercel

---

**⚡ Ready to secure your passwords? Get started in under 5 minutes!**

```bash
git clone <repo-url> && cd password-vault && npm install && npm run dev
```

**Need help?** Check out [SETUP.md](./SETUP.md) for detailed instructions or [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for testing procedures.

**Found a bug?** Open an issue on GitHub or submit a pull request!

---

Made with 🔐 by developers who care about security.
