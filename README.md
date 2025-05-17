# Airbnb Clone

A full-stack web application that replicates core Airbnb functionality, allowing users to browse property listings, save favorites, and hosts to manage their property listings.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templates), TailwindCSS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Express-session, Bcrypt
- **Validation**: Express-validator

## Features

### Guest Features
- Browse property listings
- View detailed property information
- Save favorite properties
- Manage bookings
- User authentication (register, login, logout)

### Host Features
- Add new property listings
- Edit existing property listings
- Delete property listings
- View all hosted properties

## Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install dependencies
```
npm install
```

3. Make sure MongoDB is installed and running on your system

4. Start the application
```
npm start
```

This will start both the TailwindCSS compiler and the Node.js server concurrently.

## Project Structure

- **app.js**: Main application entry point
- **controller/**: Contains controller logic
  - **auth.js**: Authentication controller (login, register, logout)
  - **host.js**: Host functionality controller (add, edit, delete properties)
  - **store.js**: Store controller for browsing and interacting with listings
  - **error.js**: Error handling controller
- **model/**: Database models
  - **User.js**: User model with authentication details
  - **Home.js**: Property listing model
- **routes/**: Express routes
  - **authRouter.js**: Authentication routes
  - **hostRouter.js**: Host functionality routes
  - **storeRouter.js**: Store routes for browsing listings
  - **errorRouter.js**: Error handling routes
- **views/**: EJS templates
  - **auth/**: Authentication views
  - **host/**: Host functionality views
  - **store/**: Store views for browsing listings
  - **partials/**: Reusable view components
- **public/**: Static assets
- **utils/**: Utility functions

## Usage

### As a Guest
1. Register a new account or login
2. Browse available properties
3. View detailed information about properties
4. Save properties to favorites
5. Manage bookings

### As a Host
1. Register a new account as a host or login
2. Add new properties with details (name, price, location, photo)
3. Edit existing properties
4. Delete properties
5. View all your listed properties

## Development

To run the application in development mode:
```
npm run dev
```

To compile TailwindCSS:
```
npm run tailwind
```

## License

ISC