# Elev8

A premium multi-vendor lifestyle marketplace built with a modern microservices architecture.

## Vision

Elev8 aims to deliver a premium shopping experience inspired by leading lifestyle brands while serving as a production-ready software engineering project that demonstrates scalable system design and modern backend architecture.

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- Redis

### Infrastructure
- Docker
- Docker Compose
- NGINX API Gateway

### Storage
- AWS S3

### Payments
- Razorpay

## Architecture

```
React Frontend
       │
       ▼
NGINX API Gateway
       │
       ▼
Microservices
       │
       ▼
PostgreSQL + Redis
```

## Current Progress

### ✅ Sprint 0 — Project Planning
- Project vision finalized
- Tech stack selected
- Microservices architecture designed
- Development workflow established

### ✅ Sprint 1 — Core Backend Foundation
- Express application setup
- Docker & Docker Compose configuration
- PostgreSQL integration
- JWT Authentication
- Role-based Authorization
- Environment configuration
- API Gateway setup (NGINX)
- OpenAPI/Scalar documentation
- Health check endpoints

### 🚧 Sprint 2 — Core Services
- User Service
- Product Service
- Inventory Service
- Cart Service
- Image uploads (AWS S3)

### ⏳ Upcoming
- Order Service
- Razorpay Integration
- Notification Service
- Search Service
- Admin Dashboard
- CI/CD Pipeline
- Kubernetes Deployment

## Project Status

🚧 **Actively under development**