# Domain Ownership

## Auth Service

Responsible For

- Registration
- Login
- JWT
- Refresh Tokens
- Google OAuth
- Password Reset

Should NOT Own

- Products
- Orders
- Payments
- Cart

---

## Product Service

Responsible For

- Products
- Categories
- Variants
- Images
- Search

Should NOT Own

- Payments
- Cart
- Authentication

---

## Cart Service

Responsible For

- Customer Cart
- Cart Items

Should NOT Own

- Authentication
- Inventory
- Payments

---

## Order Service

Responsible For

- Orders
- Order Status
- Order History

Should NOT Own

- Payment Gateway Logic
- Authentication

---

## Payment Service

Responsible For

- Razorpay
- Stripe
- Webhooks
- Refunds
- Payment Verification

Should NOT Own

- Product Data
- Inventory

---

## Notification Service

Responsible For

- Emails
- Push Notifications
- Discount Alerts
- Wishlist Notifications

Should NOT Own

- Product Database

Should receive events from other services.

---

## Review Service

Responsible For

- Ratings
- Reviews

Should NOT Own

- Payments

---

## Analytics Service

Consumes data from all services.

Responsible For

- Revenue
- Sales
- Reports
- Dashboard