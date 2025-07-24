# Manana - Document Chat Application

A modern chat application built with Next.js, MongoDB, and NextAuth for Google authentication.

## 🚀 Deployment to Vercel

### Prerequisites
1. MongoDB Atlas account
2. Google OAuth application
3. Vercel account

### Environment Variables

Create the following environment variables in your Vercel dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_secure_random_string
```

### Setting up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the following names:
   - `MONGODB_URI`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Add your Vercel domain to authorized origins:
   - `https://your-app-name.vercel.app`
6. Add callback URL:
   - `https://your-app-name.vercel.app/api/auth/callback/google`

### MongoDB Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Get the connection string
5. Replace `<username>`, `<password>`, and `<database_name>` in the URI

### Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🔧 Local Development

1. Copy `.env.local` and fill in your values:
   ```bash
   cp .env.local .env.local
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## 📦 Production Build

```bash
pnpm build
pnpm start
```

## 🔐 Security Notes

- Never commit `.env.local` or `.env` files to git
- Use strong, unique values for `NEXTAUTH_SECRET`
- Regularly rotate your secrets
- Use MongoDB Atlas IP whitelist for additional security

## 🚨 Troubleshooting

### Common Issues

1. **Authentication not working**: Check your Google OAuth redirect URIs
2. **Database connection failed**: Verify MongoDB URI and network access
3. **Build fails**: Check all environment variables are set correctly

### Build Requirements

- Node.js 18+ 
- All environment variables must be set
- MongoDB connection must be accessible from Vercel's servers

## 🧪 Testing

### Unit & Integration Tests

Run all Jest tests:

```bash
pnpm test
```

Run in watch mode:

```bash
pnpm test:watch
```

### End-to-End (E2E) Tests

Run all Playwright tests:

```bash
pnpm test:e2e
```

---

## 🚀 Deployment Readiness

- Ensure all environment variables are set (see above)
- Run `pnpm lint`, `pnpm type-check`, and all tests before deploying
- See DEPLOYMENT.md for Vercel-specific steps
