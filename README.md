![Employee Management App Logo](./src/assets/icon.png)

# Employee Management App  
## Built with Ionic & Angular  

## Overview  
A mobile application designed to streamline employee information management and workflows, with secure authentication and offline-ready storage.  

## Features  
- Employee directory with search and filtering  
- Profile management (update personal and job details)  
- Task assignment and tracking  
- Real-time updates with push notifications  
- Secure login with **credentials and biometric authentication (fingerprint)**  
- Offline data persistence using **SQLite** for local memory 

## Screenshots
![Employee Management App Logo](./src/assets/ema%20screenshot.png)

## Technologies Used  
- **Ionic Framework** – hybrid mobile app development  
- **Angular** – frontend framework for UI and workflows  
- **SQLite** – local database for offline storage and caching  
- **Capacitor Plugins** – device integration (biometrics, storage)  
- **TypeScript** – strongly typed development  
- **SCSS/CSS** – responsive styling  
- **Node.js** – runtime environment  

## Future planed updates
- **REST APIs** – backend integration for employee data and tasks  

## Installation  
```bash
npm install
ionic serve
```

## Requirements
- Node.js 14+

- Ionic CLI 5+

- Angular 12+

## Usage
Run ionic serve to start the development server and open in your browser.
```bash
ionic serve
```
For mobile deployment, 
use ionic 
```bash
capacitor run android or 
ionic capacitor run ios.
```

## License
MIT