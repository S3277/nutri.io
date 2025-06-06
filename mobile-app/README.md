# Nutri.io Mobile App

A React Native mobile application for smart nutrition tracking with AI-powered food recognition.

## Features

- 📱 Native mobile experience
- 📸 Camera integration for food scanning
- 🤖 AI-powered food recognition
- 📊 Nutrition tracking and analytics
- 💪 Workout logging and progress tracking
- 👤 User profiles and goal setting
- 🔐 Secure authentication with Supabase

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Navigate to the mobile app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Update `src/services/supabase.ts` with your Supabase URL and API key
   - Update `src/services/openai.ts` with your OpenAI API key

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   ├── services/           # API services (Supabase, OpenAI)
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── assets/                 # Images, icons, fonts
├── App.tsx                 # Main app component
└── package.json           # Dependencies and scripts
```

## Key Features

### Authentication
- Email/password authentication
- Secure token storage with Expo SecureStore
- Profile setup flow for new users

### Food Tracking
- Camera integration for food photos
- AI-powered food recognition using OpenAI Vision API
- Manual food entry with macro tracking
- Daily nutrition summaries

### Workout Tracking
- Exercise logging with sets and reps
- Progress tracking and analytics
- XP and leveling system

### Profile Management
- Personal information and goals
- Calorie target calculation
- Membership management (Free/Pro)

## Backend Integration

The mobile app uses the same Supabase backend as the web application:
- User authentication and profiles
- Food entries and nutrition data
- Workout logs and progress
- Subscription management

## Development Notes

- Uses Expo for easier development and deployment
- TypeScript for type safety
- React Navigation for screen navigation
- Expo Camera for photo capture
- React Native Chart Kit for data visualization

## Deployment

### iOS App Store
1. Build for production: `expo build:ios`
2. Submit to App Store Connect
3. Follow Apple's review process

### Google Play Store
1. Build for production: `expo build:android`
2. Upload to Google Play Console
3. Follow Google's review process

## Environment Variables

Make sure to update these files with your actual API keys:

- `src/services/supabase.ts`: Supabase URL and API key
- `src/services/openai.ts`: OpenAI API key

## Support

For issues or questions, please refer to the main project documentation or create an issue in the repository.