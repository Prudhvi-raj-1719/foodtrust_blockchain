# Food Trust Mobile App

A React Native mobile application for the Food Trust supply chain transparency system, built with Expo.

## Features

- **Role-based Dashboards**: Different interfaces for Farmer, Processor, Distributor, Retailer, Consumer, and Regulator
- **QR Code Scanning**: Built-in camera functionality for scanning product QR codes
- **Real-time Updates**: Live data synchronization with the backend
- **Offline Support**: Basic functionality without internet connection
- **Modern UI**: Clean, intuitive interface matching the design specifications

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

## Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Running the App

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Web Browser
```bash
npm run web
```

## Project Structure

```
src/
├── screens/           # Screen components
│   ├── LoginScreen.js
│   ├── DashboardScreen.js
│   ├── BatchesScreen.js
│   ├── QRScannerScreen.js
│   ├── ProfileScreen.js
│   └── BatchDetailScreen.js
├── components/        # Reusable components
├── contexts/          # React contexts
│   └── AuthContext.js
├── services/          # API services
└── utils/            # Utility functions
```

## User Roles

The app supports six different user roles, each with a customized interface:

1. **Farmer**: Upload harvest data, view analytics, generate QR codes
2. **Processor**: Scan batches, update processing, perform quality checks
3. **Distributor**: Track shipments, update location, generate logistics reports
4. **Retailer**: Scan products, update inventory, verify products
5. **Consumer**: Scan products, track origin, view purchase history
6. **Regulator**: Verify batches, audit trails, compliance reports

## Quick Login (Demo)

For testing purposes, you can use these demo credentials:
- Username: `farmer`, `processor`, `distributor`, `retailer`, `consumer`, `regulator`
- Password: `password`

## Development

The app uses:
- **React Native** with Expo for cross-platform development
- **React Navigation** for navigation
- **Expo Camera** for QR code scanning
- **AsyncStorage** for local data persistence
- **React Context** for state management

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Troubleshooting

1. **Camera permissions**: Make sure to grant camera permissions when prompted
2. **Metro bundler issues**: Try clearing the cache with `expo start -c`
3. **Dependencies**: If you encounter issues, try deleting `node_modules` and running `npm install` again

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Test on both iOS and Android
4. Update documentation as needed
