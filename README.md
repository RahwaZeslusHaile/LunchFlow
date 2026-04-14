# 🍱 LunchFlow - CYF Lunch Order Management System

A full-stack application to help CodeYourFuture London plan and manage lunch orders efficiently.

The system replaces the current manual process (Slack messages, spreadsheets, and repeated discussions) with a centralized workflow tool that tracks lunch planning, assigns responsibilities, and notifies volunteers when action is required.

---

## 📋 Table of Contents

- [Problem](#-problem)
- [Solution](#-solution)
- [MVP Features](#-mvp-features)
- [User Roles](#-user-roles)
- [Dietary Requirements](#-dietary-requirements)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Design](#-database-design)
- [Lunch Order Workflow](#-lunch-order-workflow)
- [Notifications](#-notifications)
- [Data Privacy](#-data-privacy)
- [Testing](#-testing)
- [Deployment](#-deployment)

---

## 📌 Problem

Organising lunch at the CodeYourFuture London office involves many steps and people:

- Checking leftover food
- Estimating attendance across multiple courses
- Collecting dietary requirements
- Creating a food order
- Reviewing the order
- Placing the order manually on the supermarket website
- Receiving the delivery
- Gathering feedback

### Current Challenges

The current manual and fragmented process leads to:

- **Duplicated work** across volunteers
- **Confusion about responsibilities** and task ownership
- **Lack of visibility** on order status
- **Repeated requests** for dietary requirements

---

## 🎯 Solution

This application automates the lunch planning workflow by:

- ✅ Tracking lunch orders
- ✅ Assigning tasks to volunteers
- ✅ Storing food options and dietary defaults
- ✅ Notifying users when action is required
- ✅ Providing a dashboard to view the current order status

> **Note:** Supermarket ordering will still be manual, but the system will manage everything leading up to it.

---


## ✨ Key Integrations

### ✉️ Email Notifications

- The backend uses **Nodemailer** to send emails (e.g., volunteer invites, order summaries).
- Configure your email credentials in `.env`:
    ```
    EMAIL_USER=your_gmail_address
    EMAIL_PASS=your_gmail_app_password
    FRONTEND_URL=http://localhost:5173
    ```
- See `backend/src/services/mailService.js` for implementation details.

### 🤖 AI Order Suggestions

- The backend integrates with **Google Generative AI (Gemini)** to suggest optimal order quantities.
- Configure your Gemini API key in `.env`:
    ```
    GEMINI_API_KEY=your_google_generative_ai_key
    ```
- See `backend/src/services/geminiService.js` for how AI is used to generate order suggestions.

---

## 🚀 MVP Features

### Lunch Order Workflow

- Create a new lunch order
- Apply default dietary requirements
- Build an order from predefined food categories
- Assign volunteers to different stages
- Review the order
- Mark the order as placed
- Track delivery

### Dashboard

Users can see:

- Current lunch orders
- Order status
- Assigned volunteers
- Tasks that need action

### Notifications

Users receive notifications when:

- A task is assigned to them
- An order needs review
- An order is ready to be placed

Notifications may be sent via:

- Email

---

## 👥 User Roles

### Admin

CYF staff responsible for managing the system.

**Permissions:**
- Add users
- Assign payment responsibility
- Complete orders

### Volunteer

Volunteers help plan and manage lunch orders.

**Permissions:**
- Create lunch orders
- Build food lists
- Review orders
- Place orders manually

---

## 🍽 Dietary Requirements

To reduce repetitive data collection, the system uses default dietary requirements.

**Default options:**
- Vegetarian
- Halal

These cover most common needs and can be adjusted when necessary.

---

## 🏗 System Architecture

### Tech Stack

- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (or another relational database)


---

## ⚙️ Getting Started

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:4000` by default.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on Vite's default local URL.

### 3) Run both with Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

---

## 📂 Project Structure

### Backend

```
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   └── utils/
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── styles/
└── package.json
```

---

## 🗄 Database Design

### Users


### Orders


### Food Categories

**Examples:**

### Food Items

### Order Items

## 🔄 Lunch Order Workflow

```
Planning
    ↓
Dietary Requirements
    ↓
Create Order List
    ↓
Review Order
    ↓
Order Placed (manual supermarket order)
    ↓
Delivery
```

Each stage can be assigned to a different volunteer, and notifications will be sent when the next action is required.

---

## 🔔 Notifications

The system will notify users when:

- A lunch order is created
- A review is required
- An order is ready to be placed
- The delivery stage is approaching

**Possible integrations:**
- Email

---

## 🔐 Data Privacy

Personal trainee information must be protected.

### Privacy Rules

- Trainee data only visible to lunch organisers
- Venue information visible to CYF community
- No sensitive data exposed publicly
- Authentication and role-based permissions will be implemented

---

## 🧪 Testing

The project will include:

- Backend API tests
- Frontend component tests
- Integration tests for the order workflow

---

## 🚀 Deployment

The application should be easy for CYF volunteers to maintain and deploy.

*platform:**
- Coolify

---

## 📝 License

This project is maintained by CodeYourFuture London.

---

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for the CodeYourFuture community**
