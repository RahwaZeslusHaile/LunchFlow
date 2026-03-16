# LunchFlow Backend

MVC Architecture with Role-Based Access Control

## Structure

```
backend/src/
├── app.js              # Express app
├── server.js           # Entry point
├── controllers/        # Business logic
├── models/             # Data layer
├── routes/             # API endpoints
├── middleware/         # Auth & authorization
└── utils/              # Helpers
```

## Roles

**Admin**
- Manage users
- Assign payments
- Full dashboard
- All volunteer permissions

**Volunteer**
- Create orders
- Review orders
- Place orders

## API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
```

### Users (Admin only)
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Orders
```
GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id
PATCH  /api/orders/:id/review
PATCH  /api/orders/:id/place
DELETE /api/orders/:id
```

### Payments (Admin only)
```
POST   /api/payments/order/:orderId
GET    /api/payments/order/:orderId
PUT    /api/payments/order/:orderId
DELETE /api/payments/order/:orderId
```

## Setup

```bash
npm install bcryptjs jsonwebtoken
```

Create `.env`:
```
JWT_SECRET=your-secret-key
PORT=5000
```

Run:
```bash
npm run dev
```

## Frontend Integration

Login returns permissions:
```json
{
  "user": {"id": 1, "name": "User", "role": "admin"},
  "token": "jwt-token",
  "permissions": ["manage_users", "assign_payment", ...]
}
```

Use in UI:
```jsx
{permissions.includes('manage_users') && <AdminPanel />}
```

## Request Flow

```
Client → Route → Auth → Controller → Model → Response
```
