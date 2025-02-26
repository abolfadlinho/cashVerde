# CashVerde

## Overview

**CashVerde** is a React Native app built with TypeScript, Firebase, and Firestore that promotes recycling through an incentive-based system. Users can deposit recyclables into smart disposing machines, scan a QR code to earn points, and redeem these points as money or vouchers for eco-friendly products.

**Presentation**
📺 **Watch the video:** [Click here](https://drive.google.com/file/d/1gMNA6X_WW-s47Rz-LAZemvKeIUdFrh1q/view?usp=drive_link)

## Features

✅ **Recycling Rewards** – Users scan a QR code after disposing recyclables to earn points.  
✅ **Redeem Points** – Convert points into cash or eco-friendly vouchers.  
✅ **Machine Locator** – View nearby recycling machines on a **map view**.  
✅ **Maintenance Logs & Warnings** – Users can check machine maintenance logs and receive warnings for unavailable machines.  
✅ **Competitions & Community** – Users compete with friends and communities based on **monthly points** gained.  
✅ **User Authentication** – Secure login and account management.

## Tech Stack

- **Frontend:** React Native (TypeScript)
- **Backend & Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Mapping:** Google Maps API

## Installation & Setup

### Prerequisites

- Node.js installed
- Firebase account & Firestore setup
- Google Maps API key (for map view)

### Steps

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd cashverde
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure Firebase:
   - Create a `.env` file and add your Firebase credentials
   - Example:
     ```env
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     ```
4. Start the development server:
   ```sh
   npm start
   ```

## Contributing

Feel free to submit issues or pull requests to improve the app! 🚀

## License

MIT License
