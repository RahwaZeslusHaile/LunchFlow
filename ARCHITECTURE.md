# LunchFlow Architecture

## MVC Pattern

```
Client Request
    ↓
Routes (API endpoints)
    ↓
Middleware (Auth & Permissions)
    ↓
Controllers (Business logic)
    ↓
Models (Data operations)
    ↓
Response
```

## File Structure

```
backend/src/
│
├── models/              # Data Layer
│   ├── User.js         # User data & operations
│   └── Order.js        # Order data & operations
│
├── controllers/         # Business Logic
│   ├── authController.js
│   ├── userController.js
│   ├── orderController.js
│   └── paymentController.js
│
├── routes/             # API Endpoints
│   ├── auth.js
│   ├── users.js
│   ├── orders.js
│   └── payments.js
│
├── middleware/         # Security
│   ├── auth.js        # JWT verification
│   └── authorize.js   # Permission checks
│
└── utils/
    └── roles.js       # Roles & permissions
```

## Roles & Permissions

| Feature | Admin | Volunteer |
|---------|-------|-----------|
| Manage users | ✅ | ❌ |
| Assign payments | ✅ | ❌ |
| Full dashboard | ✅ | ❌ |
| Create orders | ✅ | ✅ |
| Review orders | ✅ | ✅ |
| Place orders | ✅ | ✅ |
| View all orders | ✅ | Own only |

## Permission-Based UI

Single app, different views based on permissions:

```jsx
function Dashboard() {
  const permissions = usePermissions();
  
  return (
    <div>
      {permissions.includes('manage_users') && <UserManagement />}
      {permissions.includes('assign_payment') && <PaymentPanel />}
      {permissions.includes('create_orders') && <OrderForm />}
    </div>
  );
}
```

## API Flow Example

**Creating an Order:**
```
POST /api/orders
  ↓
authenticate() - Verify JWT
  ↓
requirePermission('create_orders') - Check permission
  ↓
orderController.createOrder() - Validate input
  ↓
Order.create() - Save data
  ↓
Return JSON response
```

**Admin-only Payment:**
```
POST /api/payments/order/:id
  ↓
authenticate()
  ↓
requirePermission('assign_payment') - Admin only
  ↓
paymentController.assignPayment()
  ↓
Order.assignPayment()
  ↓
Return JSON response
```

## Implementation Steps

1. **Models** - Define data structure & operations
2. **Controllers** - Implement business logic
3. **Routes** - Define API endpoints
4. **Middleware** - Add auth & permission checks
5. **Frontend** - Conditional rendering based on permissions
