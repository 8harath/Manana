# 🚀 Vercel Deployment Checklist for Manana

## ✅ Pre-deployment Setup

### 1. Environment Variables Setup
Copy the values from `.env.local` to your Vercel dashboard:

**Required Environment Variables:**
- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console  
- [ ] `NEXTAUTH_URL` - Your Vercel app URL (e.g., https://your-app.vercel.app)
- [ ] `NEXTAUTH_SECRET` - Generate a secure random string

### 2. Google OAuth Configuration
- [ ] Create Google OAuth 2.0 credentials
- [ ] Add authorized origins: `https://your-app-name.vercel.app`
- [ ] Add redirect URI: `https://your-app-name.vercel.app/api/auth/callback/google`

### 3. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas cluster
- [ ] Create database user with read/write permissions
- [ ] Configure network access (allow all IPs: 0.0.0.0/0 for Vercel)
- [ ] Get connection string

## 🔧 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository

### Step 3: Configure Environment Variables
1. In Vercel dashboard, go to your project
2. Navigate to Settings → Environment Variables
3. Add each variable from the list above
4. Set environment to "Production" (and "Preview" if needed)

### Step 4: Deploy
- Vercel will automatically deploy when you push to main branch
- Or click "Deploy" button in Vercel dashboard

## 🧪 Testing Your Deployment

After deployment, test these features:
- [ ] Home page loads correctly
- [ ] Google authentication works
- [ ] Can create and access chat rooms
- [ ] Document upload functionality works
- [ ] Database connections are working

## 🔍 Troubleshooting

### Common Issues:

**Build Fails:**
- Check all environment variables are set
- Verify TypeScript compilation: `pnpm type-check`
- Check ESLint: `pnpm lint`

**Authentication Issues:**
- Verify Google OAuth redirect URIs
- Check NEXTAUTH_URL matches your domain
- Ensure NEXTAUTH_SECRET is set

**Database Connection:**
- Verify MongoDB URI format
- Check MongoDB Atlas network access settings
- Ensure database user has correct permissions

**Environment Variables Not Loading:**
- Double-check variable names (case-sensitive)
- Ensure they're set for correct environment (Production/Preview)
- Redeploy after adding variables

## 📋 Final Checklist

- [ ] All dependencies installed
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Environment variables configured in Vercel
- [ ] Google OAuth configured with correct URLs
- [ ] MongoDB Atlas accessible from Vercel
- [ ] Application deployed and accessible
- [ ] Authentication flow tested
- [ ] Core functionality verified

## 🎉 You're Ready to Deploy!

Your application is now production-ready for Vercel deployment!
