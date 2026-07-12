# Engineering Principles

## Principle 1

Microservices are not a goal.

They are a solution to scaling and organizational problems.

---

## Principle 2

Every technology exists because of a problem.

Examples

Slow Database
↓

Redis

Many Services
↓

API Gateway

Many Containers
↓

Docker Compose

Deployment Automation
↓

CI/CD

---

## Principle 3

Every piece of data should have exactly one owner.

Example

Products
↓

Product Service

Orders
↓

Order Service

Payments
↓

Payment Service

---

## Principle 4

Historical data should usually be immutable.

Examples

- Orders
- Payments
- Invoices
- Audit Logs

These represent history and should not change after creation.

---

## Principle 5

Never trust the client.

The server is the source of truth.

The server should always validate:

- Price
- Quantity
- Discounts
- User Role
- Payment Amount

---

## Principle 6

Business comes before technology.

Always ask:

"What business problem am I solving?"

before asking

"What technology should I use?"

---

## Principle 7

Microservices are objects at system scale.

Object

↓

Fields

↓

Methods

↓

Private Data

↓

Public Methods

Microservice

↓

Database

↓

API

↓

Private Implementation

↓

Public Interface