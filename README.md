# 🐾 PawConnect

> **Connecting Pets with Loving Homes ❤️**

PawConnect is a full-stack pet adoption web application designed to simplify the pet adoption process by connecting people looking to adopt pets with pet owners who want to find suitable adopters.

Users can register and log in, browse available pets, view detailed pet information, add their own pets, submit adoption requests, track their requests, and manage adoption requests received for their pets.

---

## 📌 Project Overview

Finding a suitable pet for adoption can be difficult when information is scattered across different platforms.

PawConnect provides a centralized platform where:

- Users can discover pets available for adoption.
- Pet owners can list their pets.
- Interested users can submit adoption requests.
- Pet owners can review adoption requests.
- Applicants can track the status of their requests.
- Approved pets are automatically marked as adopted.
- Other pending requests for an adopted pet are automatically rejected.

The application follows a full-stack architecture using React for the frontend, Node.js and Express.js for the backend, and MongoDB for database management.

---

# 🎯 Project Objectives

The main objectives of PawConnect are:

- To simplify the pet adoption process.
- To provide a centralized platform for pet adoption.
- To allow users to easily discover available pets.
- To allow pet owners to list and manage their pets.
- To provide a structured adoption request system.
- To maintain secure user authentication and authorization.
- To track adoption request status.
- To provide a user-friendly adoption experience.
- To connect pet owners with potential adopters.

---

# ✨ Features

## 👤 User Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- User role support
- Secure access to protected operations

---

## 🐶 Pet Management

Users can add and manage pets available for adoption.

### Pet information includes:

- Pet name
- Species
- Breed
- Age
- Gender
- Color
- Vaccination status
- Location
- Description
- Pet image
- Adoption status

### Available functionality:

- Add a pet
- View available pets
- View detailed pet information
- View pets added by the logged-in user
- Display pet adoption status
- Display pet images
- Display pet information

---

## ❤️ Adoption Requests

Potential adopters can submit requests for pets.

### Applicants can:

- Submit an adoption request.
- View their submitted adoption requests.
- Track adoption request status.
- View application details.
- See whether their request is pending, approved, or rejected.

### Pet owners can:

- View adoption requests received for their pets.
- Review applicant information.
- Approve adoption requests.
- Reject adoption requests.

---

## 🔄 Adoption Status Management

Adoption requests support three statuses:

```text
Pending
Approved
Rejected
Pending

The adoption request has been submitted and is waiting for the pet owner's decision.

Approved

The pet owner has approved the adoption request.

When an adoption request is approved:

The request becomes Approved.
The corresponding pet becomes adopted.
All other pending requests for the same pet become Rejected.
Rejected

The pet owner has rejected the adoption request.

🔐 Authentication & Authorization

PawConnect uses JWT authentication to protect user-specific operations.

The application ensures that:

Unauthenticated users cannot access protected operations.
Users can view their own adoption requests.
Pet owners can manage requests for their own pets.
Unauthorized users cannot access another user's requests.
Only the pet owner or administrator can approve or reject an adoption request.
Users cannot submit an adoption request for their own pet.
🏗️ System Architecture
                    ┌─────────────────────┐
                    │        User         │
                    │     Web Browser     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     React + Vite    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             ┌─────────────┐       ┌─────────────┐
             │ JWT         │       │ Controllers │
             │ Middleware  │       │             │
             └─────────────┘       └──────┬──────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │  Mongoose   │
                                    │   Models    │
                                    └──────┬──────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │   MongoDB   │
                                    └─────────────┘
🛠️ Technology Stack
Frontend
React.js
Vite
React Router
JavaScript
CSS
Backend
Node.js
Express.js
REST API
Database
MongoDB
Mongoose
Authentication
JSON Web Token (JWT)
Development Tools
Visual Studio Code
Git
GitHub
Postman
📁 Project Structure
PawConnect/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Pets.jsx
│   │   │   ├── PetDetails.jsx
│   │   │   ├── AdoptionRequest.jsx
│   │   │   ├── MyPets.jsx
│   │   │   └── MyAdoptions.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── petController.js
│   │   └── adoptionController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Pet.js
│   │   └── AdoptionRequest.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── petRoutes.js
│   │   └── adoptionRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── uploads/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
🚀 Getting Started
1. Clone the Repository
git clone https://github.com/Ujwalashetty18/PawConnect.git
Move into the project directory:

cd PawConnect
💻 Frontend Setup

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally run at:

http://localhost:5173
⚙️ Backend Setup

Open another terminal and navigate to the backend:

cd backend

Install dependencies:

npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start the backend:

npm start

Or, if the project uses nodemon:

npm run dev

The backend will normally run at:

http://localhost:5000
🗄️ Database Design

PawConnect uses MongoDB as its database and Mongoose as the ODM.

Main Collections
Users
Pets
AdoptionRequests
User → Pet Relationship

A user can add multiple pets.

User
 │
 ├──────► Pet
 ├──────► Pet
 └──────► Pet
User → Adoption Request Relationship

A user can submit multiple adoption requests.

User
 │
 ├──────► AdoptionRequest
 ├──────► AdoptionRequest
 └──────► AdoptionRequest
Pet → Adoption Request Relationship

A pet can receive multiple adoption requests.

Pet
 │
 ├──────► AdoptionRequest
 ├──────► AdoptionRequest
 └──────► AdoptionRequest
🔌 API Documentation
Authentication API
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
Pet API
Method	Endpoint	Description
GET	/api/pets	Get available pets
GET	/api/pets/:id	Get pet by ID
GET	/api/pets/my-pets	Get logged-in user's pets
POST	/api/pets	Add a new pet
Adoption API
Method	Endpoint	Description
POST	/api/adoptions	Create adoption request
GET	/api/adoptions	Get sent and received requests
GET	/api/adoptions/:id	Get a specific request
PUT	/api/adoptions/:id/status	Approve or reject request

Protected endpoints require a valid JWT token.

❤️ Adoption Flow
User Login
    │
    ▼
Browse Pets
    │
    ▼
View Pet Details
    │
    ▼
Submit Adoption Request
    │
    ▼
Request = Pending
    │
    ▼
Pet Owner Reviews Request
    │
    ├──────────────────┐
    ▼                  ▼
 Approve             Reject
    │                  │
    ▼                  ▼
Pet = Adopted      Request = Rejected
    │
    ▼
Other Pending Requests
    │
    ▼
Rejected
🔐 Authentication Flow
User
 │
 ▼
Register / Login
 │
 ▼
Backend validates credentials
 │
 ▼
JWT Token Generated
 │
 ▼
Token stored in Frontend
 │
 ▼
Token sent with protected API requests
 │
 ▼
Authentication Middleware
 │
 ▼
Authorized Request
🧪 Testing

The application should be tested for the following scenarios.

Authentication
 User registration
 User login
 Invalid login
 Protected route without authentication
Pet Management
 Add pet
 View pets
 View pet details
 View My Pets
 Display pet image
 Display pet status
Adoption
 Submit adoption request
 View submitted request
 Owner receives request
 Approve request
 Reject request
 Pet changes to adopted after approval
 Other pending requests are rejected
Validation
 Missing required fields
 Duplicate pending request
 Requesting own pet
 Invalid pet ID
 Unauthorized request access
📸 Screenshots

Screenshots of the completed application can be added below.

🏠 Home Page

<img width="1914" height="870" alt="image" src="https://github.com/user-attachments/assets/9e64b05d-cb91-49ba-8ad6-e4cfbdf0fcef" />


🔐 Login

Add screenshot here.

🐾 Pets

Add screenshot here.

🐶 Pet Details

Add screenshot here.

➕ Add Pet

Add screenshot here.

🐾 My Pets

Add screenshot here.

❤️ Adoption Request

Add screenshot here.

📋 My Adoption Requests

Add screenshot here.

📥 Received Adoption Requests

Add screenshot here.

🚧 Future Enhancements

The following features can be added in future versions:

✏️ Edit pet information
🗑️ Delete pets
🔍 Advanced pet search and filtering
🔔 Notifications
💬 Chat between adopter and pet owner
📍 Location-based pet discovery
⭐ Ratings and reviews
👨‍💼 Advanced admin dashboard
📊 Adoption analytics
📱 Mobile application
🎯 Project Goals

PawConnect aims to make the pet adoption process:

Simple
Accessible
Organized
Transparent
User-friendly

The platform provides a structured way for pet owners and potential adopters to interact through adoption requests.
## 🌐 Live Demo

https://pawconnect-frontend-ntlu.onrender.com
👩‍💻 Author

## 🚀 Deployment

PawConnect is deployed using Render.

- Frontend: Render Static Site
- Backend: Render Web Service
- Database: MongoDB

Ujwala Shetty

Computer Science & Engineering Student

PawConnect — Pet Adoption Platform

Connecting pets with loving homes. ❤️

📄 License

This project was developed as an academic/project application.

⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
