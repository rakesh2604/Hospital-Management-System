# 🏥 Hospital Management System

*Transforming Healthcare, Empowering Lives Every Day*

<div align="center">

![Static Badge](https://img.shields.io/badge/tech-content-blue)
![Static Badge](https://img.shields.io/badge/Tech-JAVASCRIPT%2099.7%25-blue)
![Static Badge](https://img.shields.io/badge/languages-3-blue)

Built with the tools and technologies:

![Static Badge](https://img.shields.io/badge/Express.js-black)
![Static Badge](https://img.shields.io/badge/Node.js-green)
![Static Badge](https://img.shields.io/badge/MongoDB-brightgreen)
![Static Badge](https://img.shields.io/badge/React-blue)
![Static Badge](https://img.shields.io/badge/MaterialUI-blueviolet)
![Static Badge](https://img.shields.io/badge/Vite-yellow)
![Static Badge](https://img.shields.io/badge/Axios-purple)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Installation](#-installation)
  - [Environment Variables](#-environment-variables)
  - [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
  - [Backend (Render)](#-backend-render)
  - [Frontend (Vercel)](#-frontend-vercel)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏥 Overview

Hospital Management System is a **full-stack, multi-tenant healthcare platform** built with the MERN stack, designed to streamline hospital operations while ensuring data security and scalability. It offers a modular architecture that supports seamless growth and maintenance, with dedicated backend services and a responsive React-based frontend.

### ⭐ Why Hospital Management System?

This project empowers healthcare providers with a secure, scalable solution for managing patient records, vitals, prescriptions, and staff workflows. The system is designed for rural healthcare facilities and can be easily adopted by hospitals of any size.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Hospital Self-Registration**: Public endpoint for hospitals to register and get their tenant ID
- **JWT-based Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for different user roles
- **Multi-Tenant Isolation**: Complete data isolation between hospitals

### 👥 Patient Management
- **Patient Registration**: Complete patient profile with demographics
- **Patient Search & Filter**: Quick access to patient records
- **Patient History**: Comprehensive view of all patient interactions
- **Patient Details**: Detailed view with vitals, prescriptions, and medical history

### 📊 Vitals Tracking
- **Real-time Vitals Recording**: Blood pressure, temperature, pulse, SpO2, weight
- **Vitals History**: Complete timeline of patient vitals
- **Role-based Access**: Nurses and doctors can record vitals

### 💊 Prescription Management
- **Digital Prescriptions**: Create and manage prescriptions
- **Medicine Management**: Track dosage, frequency, duration, and instructions
- **Print Prescriptions**: Generate printable PDF prescriptions
- **Prescription History**: Complete prescription records per patient

### 📈 Analytics Dashboard
- **Real-time Statistics**: Total patients, today's admissions, prescriptions
- **Visual Charts**: Pie charts for gender distribution, bar charts for patient registrations
- **Recent Activity**: Latest vitals and patient registrations
- **Performance Metrics**: Key performance indicators for hospital management

### 🎨 User Interface
- **Modern Landing Page**: Professional SaaS-style landing page
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Material UI Components**: Beautiful, accessible UI components
- **Intuitive Navigation**: Easy-to-use interface for all user roles

---

## 🛠 Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database (with Mongoose ODM)
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Material-UI (MUI)**: Component library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **React-to-Print**: PDF generation

---

## 🏗 Architecture

### Multi-Tenant Architecture
The system uses a **database-per-tenant** approach:
- Each hospital gets its own isolated MongoDB database
- Tenant ID is used to route requests to the correct database
- Complete data isolation between hospitals
- Scalable architecture that supports unlimited hospitals

### Backend Structure
```
server/
├── src/
│   ├── config/          # Database and multi-tenant configuration
│   ├── middleware/      # Authentication and tenant resolution
│   └── modules/         # Feature modules
│       ├── auth/        # Authentication & user management
│       ├── patients/    # Patient CRUD operations
│       ├── vitals/       # Vitals recording and history
│       ├── prescriptions/ # Prescription management
│       ├── stats/        # Analytics and dashboard stats
│       └── tenants/      # Hospital registration
├── index.js             # Server entry point
└── package.json
```

### Frontend Structure
```
client/
├── src/
│   ├── api/            # API configuration (axios)
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Entry point
├── vercel.json         # Vercel deployment config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local or MongoDB Atlas account)
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rakesh2604/Hospital-Management-System
cd Hospital-Management-System
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Install frontend dependencies**
```bash
cd ../client
npm install
```

### Environment Variables

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port (optional, defaults to 5000)
PORT=5000

# Node Environment
NODE_ENV=development
```

#### Frontend (`client/.env`)
Create a `.env` file in the `client` directory:

```env
# API URL (for local development)
VITE_API_URL=http://localhost:5000/api

# For production, this will be set in Vercel
# VITE_API_URL=https://your-backend.onrender.com/api
```

### Running the Application

1. **Start the backend server**
```bash
cd server
node index.js
# or
npm start
```

The server will run on `http://localhost:5000`

2. **Start the frontend development server**
```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173` (or the next available port)

3. **Access the application**
- Open your browser and navigate to `http://localhost:5173`
- Register a new hospital or login with existing credentials

---

## 📡 API Documentation

### Base URL
- **Local**: `http://localhost:5000/api`
- **Production**: `https://your-backend.onrender.com/api`

### Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Additionally, all requests require the tenant ID in the header:
```
x-tenant-id: <tenant-id>
```

### Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user (requires tenant context)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user details (protected)

#### Hospital Registration (Public)
- `POST /api/tenants/register` - Register a new hospital
  ```json
  {
    "hospitalName": "City Care Hospital",
    "address": "123 Main St",
    "adminName": "John Doe",
    "adminEmail": "admin@citycare.com",
    "password": "password123",
    "licenseNumber": "LIC123456"
  }
  ```

#### Patients
- `GET /api/patients` - Get all patients (protected)
- `GET /api/patients/:id` - Get patient by ID (protected)
- `POST /api/patients` - Create new patient (protected)
- `PUT /api/patients/:id` - Update patient (protected)
- `DELETE /api/patients/:id` - Delete patient (protected)

#### Vitals
- `POST /api/vitals` - Record vitals (protected, requires NURSE/DOCTOR role)
- `GET /api/vitals/patient/:patientId` - Get vitals history for a patient (protected)

#### Prescriptions
- `POST /api/prescriptions` - Create prescription (protected, requires DOCTOR role)
- `GET /api/prescriptions/patient/:patientId` - Get prescriptions for a patient (protected)

#### Statistics
- `GET /api/stats/dashboard` - Get dashboard statistics (protected)

---

## 🚀 Deployment

### Backend (Render)

1. **Create a Render account** and connect your GitHub repository

2. **Create a new Web Service**
   - **Root Directory**: `server`
   - **Build Command**: (leave empty or `npm install`)
   - **Start Command**: `npm start`
   - **Environment**: Node

3. **Add Environment Variables**
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: `production`
   - `PORT`: (automatically set by Render)

4. **Deploy**
   - Render will automatically deploy on every push to your main branch
   - Note your backend URL (e.g., `https://your-app.onrender.com`)

### Frontend (Vercel)

1. **Create a Vercel account** and connect your GitHub repository

2. **Import Project**
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variables**
   - `VITE_API_URL`: Your Render backend URL + `/api`
     - Example: `https://your-app.onrender.com/api`

4. **Deploy**
   - Vercel will automatically deploy on every push
   - Your app will be live at `https://your-app.vercel.app`

### Post-Deployment

1. **Update CORS** (Optional but recommended)
   - In `server/index.js`, replace `origin: '*'` with your Vercel domain:
   ```javascript
   app.use(cors({
     origin: 'https://your-app.vercel.app',
     credentials: true,
   }));
   ```

2. **Test the deployment**
   - Visit your Vercel URL
   - Register a new hospital
   - Test all features

---

## 📁 Project Structure

```
Hospital-Management-System/
├── server/                 # Backend application
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── middleware/    # Auth & tenant middleware
│   │   └── modules/        # Feature modules
│   ├── scripts/            # Seed scripts
│   ├── index.js            # Server entry point
│   └── package.json
├── client/                 # Frontend application
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # React components
│   │   └── pages/         # Page components
│   ├── vercel.json        # Vercel config
│   └── package.json
├── README.md
└── package.json           # Root package.json
```

---

## 👥 User Roles

The system supports the following user roles with different permissions:

- **SUPER_ADMIN**: Full system access (for platform administrators)
- **HOSPITAL_ADMIN**: Full access within their hospital
- **DOCTOR**: Can view patients, record vitals, create prescriptions
- **NURSE**: Can view patients, record vitals
- **PHARMACIST**: Can view prescriptions
- **RECEPTIONIST**: Can register and view patients

---

## 🧪 Seeding Data

To seed initial data for testing:

```bash
# Seed demo hospital
cd server
node scripts/seed.js

# Seed rural hospital
node scripts/seed_rural.js
```

Default credentials:
- **Email**: `admin@phc.com` or `admin@rural.com`
- **Password**: `password123`
- **Tenant ID**: `phc_demo` or `phc_rural`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🆘 Support

For support, email your-email@example.com or open an issue in the repository.

---

## 🙏 Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- React team for the amazing framework
- All contributors who helped improve this project

---

<div align="center">

**Made with ❤️ for healthcare providers**

[⭐ Star this repo](https://github.com/rakesh2604/Hospital-Management-System) | [🐛 Report Bug](https://github.com/rakesh2604/Hospital-Management-System/issues) | [💡 Request Feature](https://github.com/rakesh2604/Hospital-Management-System/issues)

</div>
