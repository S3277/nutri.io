# Nutri.io Mobile App

A React Native mobile application for smart nutrition tracking with AI-powered food recognition.

## 🚀 Quick Setup

### 1. Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### 2. Installation

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install
```

### 3. Configure Environment Variables

**IMPORTANT:** You need to configure your Supabase credentials to connect to the same database as the web app.

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your actual Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_OPENAI_API_KEY=your-openai-api-key
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to Settings → API
- Copy the Project URL and anon/public key

### 4. Start the App

```bash
# Start the development server
npm start

# Or run on specific platform
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser (for testing)
```

## 📱 Features

### ✨ **Tinder-Style Welcome Screen**
- Beautiful gradient background with floating elements
- Compelling hero text and feature previews
- Social proof stats (10K+ users, 4.8★ rating)
- Clear call-to-action buttons

### 🔐 **Authentication**
- Email/password authentication
- Secure token storage with Expo SecureStore
- Profile setup flow for new users
- Seamless navigation between screens

### 🍽️ **Food Tracking**
- Camera integration for food photos
- AI-powered food recognition using OpenAI Vision API
- Manual food entry with macro tracking
- Daily nutrition summaries and progress tracking

### 💪 **Workout Features**
- Exercise logging with sets and reps
- Progress tracking and analytics
- XP and leveling system
- Workout schedule management

### 👤 **Profile Management**
- Personal information and goals
- Calorie target calculation
- Membership management (Free/Pro)
- Settings and preferences

## 🏗️ Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── FoodEntryModal.tsx
│   ├── screens/            # App screens
│   │   ├── WelcomeScreen.tsx      # Tinder-style welcome
│   │   ├── AuthScreen.tsx         # Login/Signup
│   │   ├── ProfileSetupScreen.tsx # Profile setup
│   │   ├── DashboardScreen.tsx    # Main dashboard
│   │   ├── ProfileScreen.tsx      # User profile
│   │   ├── TrainerScreen.tsx      # AI trainer
│   │   └── WorkoutScreen.tsx      # Workout tracking
│   ├── services/           # API services
│   │   ├── supabase.ts           # Supabase client
│   │   └── openai.ts             # OpenAI integration
│   └── types/              # TypeScript definitions
├── assets/                 # Images, icons, fonts
├── App.tsx                 # Main app component
├── app.config.js          # Expo configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Key Technologies

- **React Native + Expo** - Cross-platform mobile development
- **TypeScript** - Type safety and better development experience
- **React Navigation** - Screen navigation and tab management
- **Supabase** - Backend database and authentication
- **Expo Camera** - Camera integration for food scanning
- **OpenAI Vision API** - AI-powered food recognition
- **Expo SecureStore** - Secure token storage
- **Linear Gradient** - Beautiful gradient backgrounds

## 🎨 Design Features

### **Tinder-Style Welcome Screen**
- Full-screen immersive design with gradient overlay
- Floating elements for visual depth
- Professional typography and spacing
- Touch-friendly button sizes
- Social proof integration

### **Modern UI/UX**
- Clean, card-based layouts
- Smooth animations and transitions
- Consistent color scheme (Orange #F97316 primary)
- Responsive design for all screen sizes
- Intuitive navigation patterns

## 🔗 Backend Integration

The mobile app shares the same Supabase backend as the web application:

- **User Authentication** - Email/password with secure session management
- **Profiles** - Personal information, goals, and preferences
- **Food Entries** - Nutrition tracking and meal logging
- **Workout Data** - Exercise logs and progress tracking
- **Subscription Management** - Free/Pro membership handling

## 🚀 Development Workflow

### **Running the App**
```bash
# Start development server
npm start

# Run on iOS (requires Xcode)
npm run ios

# Run on Android (requires Android Studio)
npm run android

# Run in web browser (for testing)
npm run web
```

### **Building for Production**
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## 📋 Environment Setup Checklist

- [ ] Node.js installed (v16+)
- [ ] Expo CLI installed globally
- [ ] iOS Simulator or Android Emulator set up
- [ ] Supabase project created and configured
- [ ] Environment variables configured in `.env`
- [ ] OpenAI API key obtained (optional, for food recognition)

## 🔧 Troubleshooting

### **Common Issues:**

1. **"Supabase URL not configured"**
   - Make sure you've updated the `.env` file with your actual Supabase credentials
   - Restart the Expo development server after changing environment variables

2. **"Camera permissions denied"**
   - Grant camera permissions when prompted
   - Check device settings if permissions were previously denied

3. **"Network request failed"**
   - Ensure your device/simulator has internet connectivity
   - Verify Supabase URL and API key are correct

### **Getting Help:**
- Check the Expo documentation: https://docs.expo.dev/
- Supabase documentation: https://supabase.com/docs
- React Navigation docs: https://reactnavigation.org/

## 📱 Deployment

### **iOS App Store**
1. Build for production: `expo build:ios`
2. Submit to App Store Connect
3. Follow Apple's review process

### **Google Play Store**
1. Build for production: `expo build:android`
2. Upload to Google Play Console
3. Follow Google's review process

---

**Ready to transform mobile nutrition tracking!** 🚀📱