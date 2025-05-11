# Vaccination Management System - Backend

## 🚀 Project Overview

This is the backend of the Vaccination Management System, built using Node.js, Express, and MongoDB. It provides secure APIs for managing students, vaccination drives, and user authentication.

## 🛠️ Tech Stack

* **Backend Framework:** Node.js + Express
* **Database:** MongoDB (Cloud - MongoDB Atlas)
* **Authentication:** JWT (JSON Web Token)
* **API Documentation:** [Postman Documentation](https://documenter.getpostman.com/view/6868293/2sB2jAa7hR)

## 📁 Project Structure

```
├── config             # Configuration files (DB, JWT)
├── controllers        # API request handlers
├── middleware         # Custom middleware (Auth, Error handling)
├── models             # Mongoose models (Student, Drive, Vaccine, User)
├── routes             # Express API routes
├── utils              # Utility functions
├── swagger.js         # Swagger setup for API docs
├── server.js          # Application entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd vaccination-management-backend

# Install dependencies
npm install
```

### Environment Variables

* Create a `.env` file in the root directory.
* Add the following variables:

```
NODE_ENV = development
PORT = 5000
MONGODB_URI = mongodb+srv://vaccinateAdmin:TZKlNEhIe8Y1sezi@itzzmeakhi.jezihye.mongodb.net/vaccinate-db
JWT_SECRET = abcd123@789
```

### Running the Application

```bash
# Start the development server
npm run server

# The app will be available at http://localhost:5000
```

## 📝 Usage

* Access the API documentation at the provided Postman link.

  https://documenter.getpostman.com/view/6868293/2sB2jAa7hR
  

## 📸 Screenshots

* (Add screenshots of API responses using Postman)

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`feature/new-feature`).
3. Make your changes.
4. Create a Pull Request.

## 📄 License

This project is licensed under the MIT License.
