# 05 - Microservice Foundation

> Sprint 1 - Infrastructure Complete

---

# Goal

Build the complete infrastructure before implementing business logic.

**Engineering Principle**

> Think → Design → Decision → Code

---

# Overall Architecture

```
Browser
    │
    ▼
NGINX API Gateway
    │
    ├────────► Auth Service
    ├────────► Product Service
    └────────► Order Service
```

Clients only know the API Gateway.

Backend services remain private.

---

# NGINX

## events

Responsible for:

- Worker Processes
- TCP Connections

---

## http

Responsible for:

- Reverse Proxy
- Routing
- Headers
- Compression
- MIME Types

---

## upstream

A named backend server group.

Example

```nginx
upstream product {
    server product-service:5002;
}
```

Benefits

- Load Balancing
- Easy Scaling
- Single place to update backend servers

---

## server

Public web server.

```
listen 80;
```

Receives incoming requests.

---

## location

Routes requests.

```nginx
location /api/products/ {
    proxy_pass http://product;
}
```

NGINX only knows

```
/api/products
```

Express handles

```
/products/search
/products/latest
/products/:id
```

---

# Docker

Each service has its own Dockerfile.

Reason:

Each service owns its own runtime.

Example

```
Gateway
    ↓
NGINX

Auth
    ↓
Node.js

AI
    ↓
Python
```

One container.

One responsibility.

---

# Docker Compose

Responsibilities

- Start containers
- Create Docker Network
- Configure environment variables
- Connect services

Example

```yaml
environment:
  PORT: 5001
  NODE_ENV: development
```

Configuration belongs in Compose.

Secrets belong in `.env`.

---

# Docker DNS

Containers communicate using service names.

```
auth-service

product-service

order-service
```

Instead of

```
192.168.x.x
```

Docker resolves names automatically.

---

# Express Architecture

```
index.js

↓

app.js

↓

routes

↓

controllers

↓

services

↓

database
```

## index.js

Starts HTTP server.

```
app.listen(...)
```

---

## app.js

Creates Express app.

Registers middleware.

Registers routes.

Exports app.

---

## routes

Only maps endpoints.

```
GET /health

↓

healthController
```

No business logic.

---

## controllers

Handle Request → Response.

Business logic will later move into services.

---

# Standard Folder Structure

```
src/

├── index.js
├── app.js

├── config/
├── controllers/
├── routes/
├── services/
├── middleware/
├── validations/
├── utils/
├── errors/
```

Every service follows the same structure.

---

# Health Endpoint

Every service exposes

```
GET /api/.../health
```

Purpose

- Verify service is running
- Verify Docker network
- Verify API Gateway routing

No database required.

---

# Docker Lessons

Never copy

```
node_modules
```

inside Docker images.

Use

```
.dockerignore
```

Docker installs dependencies inside the Linux container.

---

# Engineering Principles Learned

- Single Responsibility Principle
- Separation of Concerns
- One Service → One Responsibility
- One Docker Image → One Runtime
- Prefer Official Docker Images
- API Gateway hides internal services
- Docker DNS instead of IP Addresses
- Test Infrastructure before Business Logic

---

# Sprint Status

✅ Docker

✅ Docker Compose

✅ Docker DNS

✅ NGINX

✅ Reverse Proxy

✅ API Gateway

✅ Express Foundation

✅ Health Endpoints

✅ First Git Commit

---

# Key Takeaway

> Build the foundation before building features.

Infrastructure is the backbone of every scalable system.