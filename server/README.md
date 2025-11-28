# 🏥 Hospital Management System - Backend

Backend API server for the Hospital Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

### Run

```bash
npm start
```

Server runs on `http://localhost:5000`

## 📡 API Endpoints

See main [README.md](../README.md) for complete API documentation.

## 🏗 Architecture

- **Multi-Tenant**: Database-per-tenant architecture
- **RESTful API**: Standard REST endpoints
- **JWT Authentication**: Token-based auth
- **Role-Based Access**: Different permissions per role

## 📦 Dependencies

- Express.js - Web framework
- MongoDB/Mongoose - Database
- JWT - Authentication
- bcryptjs - Password hashing
- Helmet - Security
- CORS - Cross-origin support

