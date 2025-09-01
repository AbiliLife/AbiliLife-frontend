# AbiliLife Production Deployment Guide

## 🚀 Production Readiness Status

✅ **Backend Ready for Production**
- Firebase Admin SDK with secure credential management (BASE64 + file fallback)
- Password hashing with bcrypt (salt rounds: 12)
- Proper authentication validation
- Environment-based configuration
- Production-ready package.json scripts
- Procfile for deployment platforms

✅ **Frontend Ready for Production**
- Environment-based API URL switching
- EAS Build configuration for APK distribution
- Location services with dual provider support
- Comprehensive error handling

## 📋 Pre-Deployment Checklist

### Backend Deployment (Render/Railway)

1. **Environment Variables Setup**
   ```bash
   NODE_ENV=production
   PORT=3000
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account_json
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

2. **Firebase Service Account**
    - Export your Firebase service account JSON
    - Encode it to BASE64: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("firebase-service-account.json"))`
    - Copy the output (it will be a very long string starting with something like `eyJ0eXBlIjoic2Vy...`)
    - Set as `FIREBASE_SERVICE_ACCOUNT_BASE64` environment variable

> ⚠️ **Important Notes**
> - The Base64 string will be very long (several thousand characters)
> - Make sure to copy the entire string without any line breaks
> - **Don't share this string publicly** – it contains your Firebase credentials
> - Store it securely in your deployment platform's environment variables

> 🧪 **Test the Base64 Conversion**
> After getting the Base64 string, you can test if it's valid:
> ```powershell
> # Test decoding (replace YOUR_BASE64_STRING with actual string)
> [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("YOUR_BASE64_STRING"))
> ```
> This should output your original JSON content if the Base64 conversion was successful.

3. **Deployment Commands**
   ```bash
   # The Procfile will automatically run:
   npm run build && npm start
   ```

### Frontend APK Build

1. **Environment Setup**
   ```bash
   # Create .env file from .env.example
   cp .env.example .env
   
   # Update production backend URL
   EXPO_PUBLIC_PROD_BACKEND_URL=https://your-backend-url.com
   EXPO_PUBLIC_USE_GEOAPIFY=true
   EXPO_PUBLIC_ENVIRONMENT=production
   ```

2. **EAS Build Commands**
   ```bash
   # Install EAS CLI
   npm install -g @expo/eas-cli
   
   # Login to Expo
   eas login
   
   # Build APK for internal distribution
   eas build --platform android --profile production
   
   # For preview builds during testing
   eas build --platform android --profile preview
   ```

## 🔧 Configuration Details

### Backend Security Features

- **Password Security**: 12-round bcrypt hashing
- **Token Management**: Firebase custom tokens for authentication
- **Environment Isolation**: Separate dev/prod configurations
- **Error Handling**: Comprehensive error responses
- **CORS Protection**: Environment-based origin validation

### Frontend Security Features

- **API Security**: Bearer token authentication
- **Environment Detection**: Automatic dev/prod URL switching
- **Error Boundaries**: Comprehensive error handling
- **Secure Storage**: Token management with Expo SecureStore

## 🚧 Deployment Steps

### 1. Backend Deployment (Render Example)

1. **Connect Repository**
   - Link your GitHub repository
   - Select `abililife-backend-project` folder

2. **Configure Build**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node.js 18+

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_SERVICE_ACCOUNT_BASE64=your-base64-encoded-json
   CORS_ORIGIN=*
   ```

### 2. Frontend APK Build

1. **Configure Environment**
   ```bash
   # Update .env with production backend URL
   EXPO_PUBLIC_PROD_BACKEND_URL=https://your-backend.onrender.com
   EXPO_PUBLIC_USE_GEOAPIFY=true
   ```

2. **Build APK**
   ```bash
   eas build --platform android --profile production
   ```

3. **Download & Distribute**
   - APK will be available in Expo dashboard
   - Download and distribute to pilot users

## 📱 Testing Production Setup

### Backend Testing
```bash
# Test health endpoint
curl https://your-backend.onrender.com/health

# Test authentication
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Frontend Testing
1. Install APK on test devices
2. Verify connection to production backend
3. Test location services with Geoapify
4. Validate authentication flow

## 🔍 Monitoring & Maintenance

### Health Checks
- Backend: `/health` endpoint
- Monitor Firebase connection status
- Check API response times

### Log Monitoring
- Backend: Console logs for Firebase status
- Frontend: Error boundaries for crash reporting

### Updates
- Backend: Deploy via Git push (auto-deploy on Render)
- Frontend: New APK builds via EAS

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   ```
   Error: Firebase is not initialized
   ```
   **Solution**: Check `FIREBASE_SERVICE_ACCOUNT_BASE64` environment variable

2. **Authentication Failure**
   ```
   Error: Invalid email or password
   ```
   **Solution**: Ensure bcrypt is installed and password hashing is working

3. **CORS Error**
   ```
   Error: Access-Control-Allow-Origin
   ```
   **Solution**: Update `CORS_ORIGIN` environment variable

4. **APK Build Failure**
   ```
   Error: Build failed
   ```
   **Solution**: Check EAS configuration and environment variables

## 📞 Support

For deployment issues:
1. Check logs in deployment platform
2. Verify environment variables
3. Test endpoints individually
4. Review Firebase console for auth issues

## 🎯 Next Steps

After successful deployment:
1. Monitor user feedback from pilot program
2. Implement analytics and crash reporting
3. Set up CI/CD pipeline for automated deployments
4. Plan for scaling based on user growth
