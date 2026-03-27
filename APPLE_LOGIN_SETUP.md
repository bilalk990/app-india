# 🍎 Apple Login Setup Guide

## ✅ Step 1: React Native Code (COMPLETED)
- ✅ Package installed: `@invertase/react-native-apple-authentication`
- ✅ Code implemented in `SocialLogin.js`
- ✅ Backend integration ready

---

## 📱 Step 2: iOS Configuration (MANUAL STEPS REQUIRED)

### A. Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

### B. Xcode Configuration

1. **Open Xcode:**
   ```bash
   open ios/RemyndNow.xcworkspace
   ```

2. **Enable Sign in with Apple Capability:**
   - Select your project in Xcode
   - Go to "Signing & Capabilities" tab
   - Click "+ Capability"
   - Search for "Sign in with Apple"
   - Add it to your project

3. **Update Info.plist:**
   - Open `ios/RemyndNow/Info.plist`
   - Add the following (if not already present):
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
     <dict>
       <key>CFBundleURLSchemes</key>
       <array>
         <string>com.remyndnow.login</string>
       </array>
     </dict>
   </array>
   ```

4. **Apple Developer Account:**
   - Go to https://developer.apple.com
   - Sign in with your Apple Developer account
   - Go to "Certificates, Identifiers & Profiles"
   - Select your App ID: `com.remyndnow.login`
   - Enable "Sign in with Apple" capability
   - Save changes

---

## 🔧 Step 3: Backend Configuration (Railway)

### Add Environment Variables to Railway:

1. Go to your Railway project dashboard
2. Click on your Laravel service
3. Go to "Variables" tab
4. Add these variables:

```env
APPLE_CLIENT_ID=com.remyndnow.login
APPLE_TEAM_ID=S8FWP3UGAG
APPLE_KEY_ID=9H5T68L49Y
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgsISyQuqB+UlxUdQX
TwEwbiiPgLbQku4jDLHx0DS05X+gCgYIKoZIzj0DAQehRANCAATV9V33AnKMR7kh
Syw3JlxWsCd6NW9Lx9h9u4+2A4iYerTTvzdw8SP4cHuvBU9HVuYflm0Ef+JCmIUi
KkMfP7qE
-----END PRIVATE KEY-----"
```

5. Click "Deploy" to restart the service with new variables

---

## 🚀 Step 4: Build & Test

### Android Build:
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

### iOS Build:
```bash
cd ios
pod install
cd ..
npx react-native run-ios --configuration Release
```

Or build in Xcode:
- Product → Archive
- Distribute App

---

## ✅ Testing Apple Login

### On iOS Device:
1. Make sure you're signed in to iCloud
2. Open the app
3. Tap "Apple" button
4. Follow Apple Sign-In flow
5. App should log you in successfully

### On Android:
- Apple Sign-In is iOS only
- Button will show but won't work on Android
- Consider hiding the button on Android

---

## 🔍 Troubleshooting

### Issue: "Apple Sign-In not supported"
**Solution:** Make sure you're testing on a real iOS device with iOS 13+

### Issue: "Invalid client_id"
**Solution:** Verify Bundle ID matches in:
- Xcode project settings
- Apple Developer Portal
- Backend APPLE_CLIENT_ID

### Issue: "User canceled"
**Solution:** This is normal - user clicked "Cancel" in Apple Sign-In dialog

---

## 📝 Notes

- Apple Sign-In only works on iOS 13+
- Requires real device for testing (not simulator)
- Backend already supports Apple login via `social-login` API
- User data flow: App → Backend → Database → Return token

---

## 🎯 Current Status

✅ React Native code implemented
✅ Backend API ready
✅ Credentials provided
⚠️ iOS Xcode configuration needed (manual)
⚠️ Railway environment variables needed (manual)

---

## 📞 Support

If you face any issues:
1. Check Xcode console logs
2. Check Railway backend logs
3. Verify Apple Developer Portal settings
4. Ensure Bundle ID matches everywhere
