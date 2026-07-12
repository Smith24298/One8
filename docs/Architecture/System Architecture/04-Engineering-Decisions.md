# Engineering Decisions

## Decision 1

Architecture

Selected:

Microservices

Reason:

- Independent deployment
- Independent scaling
- Clear ownership
- Resume value

Trade-off:

- Increased complexity

---

## Decision 2

Authentication

JWT

Google OAuth

Refresh Tokens

Reason

Stateless authentication.

---

## Decision 3

API Gateway

NGINX

Reason

Single entry point for all services.

---

## Decision 4

Source of Truth

PostgreSQL

Reason

Redis is only a cache.

Database always wins.

---

## Decision 5

Historical Data

Orders are immutable.

Product updates should not affect historical orders.

---

## Decision 6

Communication

Services communicate through APIs initially.

Later

RabbitMQ Events.

---

## Decision 7

Payment

Order Service only knows

Payment Status

Payment Service hides

- Razorpay IDs
- Stripe IDs
- Webhooks
- Signatures

Reason

Abstraction.