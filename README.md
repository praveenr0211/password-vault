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
- **✨ Modern UI**: Glass morphism effects, animated gradient backgrounds, smooth transitionsYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 🔐 Security ArchitectureThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Client-Side Encryption## Learn More

Password Vault implements **zero-knowledge encryption**:To learn more about Next.js, take a look at the following resources:

1. **Key Derivation**: Your master password is used to derive an encryption key via **PBKDF2** (100,000 iterations)- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

2. **Encryption**: Vault items are encrypted client-side using **AES-GCM (256-bit)**- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

3. **Storage**: Only encrypted ciphertext is transmitted and stored in MongoDB

4. **Decryption**: Items are decrypted client-side only when you access your vaultYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

````## Deploy on Vercel

Master Password → PBKDF2 → AES-256 Key → Encrypt Data → Server (Ciphertext Only)

```The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.



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

- [ ] Sign up with new account
- [ ] Log in with existing account
- [ ] Generate password with different options
- [ ] Save vault item with generated password
- [ ] Search for vault items
- [ ] Edit existing item
- [ ] Copy password to clipboard
- [ ] Delete vault item
- [ ] Verify ciphertext in MongoDB

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

- **PBKDF2**: 100,000 iterations, SHA-256, per-user salt
- **AES-GCM**: 256-bit keys, 96-bit IV, authenticated encryption
- **Storage**: IV + ciphertext combined as Base64

### Why This Stack?

- **Next.js 14**: Server actions, API routes, and SSR
- **TypeScript**: Type safety and better DX
- **MongoDB**: Flexible schema, easy scaling
- **Tailwind CSS**: Rapid UI development
- **Web Crypto API**: Native browser encryption (no external libs needed)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Author

Built with ❤️ using Claude and VS Code

---

**Remember**: This is a demonstration project. For production use, consider additional features like:

- Two-factor authentication (2FA)
- Password strength requirements
- Rate limiting
- Account recovery options
- Audit logs
- Biometric authentication
- Browser extension
