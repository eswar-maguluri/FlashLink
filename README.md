# FlashLink

FlashLink is a distributed URL shortening platform built using FastAPI, React, PostgreSQL, Redis, Kafka, Docker, Prometheus.

The platform enables users to generate short URLs, manage links, track analytics, and monitor system activity through an integrated dashboard.

---

## Overview

FlashLink provides a secure and scalable platform for URL shortening while demonstrating modern backend engineering concepts such as distributed ID generation, caching, event-driven architecture, monitoring, and cloud deployment.

The project includes:

- User Authentication using JWT
- URL Shortening with Base62 Encoding
- Snowflake Distributed ID Generation
- URL Analytics and Click Tracking
- Redis Caching Layer
- Kafka Event Streaming Architecture
- Prometheus Monitoring
- Dockerized Deployment

---

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Protected API Routes

### URL Management

- Create Short URLs
- View User URLs
- Delete URLs
- Personalized Dashboard

### Analytics

- Total Click Tracking
- Unique Visitor Tracking
- Recent Click Activity
- Analytics Dashboard

### Performance & Scalability

- Snowflake ID Generation
- Base62 URL Encoding
- Redis Caching Support
- Rate Limiting Support

### Monitoring

- Prometheus Metrics
- API Monitoring

---

## Technology Stack

### Frontend

- React
- React Router
- Axios
- CSS

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database

- PostgreSQL (Neon)

### Cache Layer

- Redis

### Event Streaming

- Apache Kafka

### Monitoring

- Prometheus

### DevOps

- Docker
- Docker Compose
- GitHub Actions

### Deployment

- Vercel
- Render
- Neon PostgreSQL

---

## System Architecture

```text
                            ┌─────────────┐
                            │    Users    │
                            └──────┬──────┘
                                   │
                                   ▼
                     ┌────────────────────────┐
                     │    React Frontend      │
                     │       (Vercel)         │
                     └──────────┬─────────────┘
                                │
                                ▼
                     ┌────────────────────────┐
                     │     FastAPI Backend    │
                     │       (Render)         │
                     └──────┬─────┬─────┬─────┘
                            │     │     │
             ┌──────────────┘     │     └──────────────┐
             ▼                    ▼                    ▼

    ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
    │ PostgreSQL     │  │ Redis Cache    │  │ Kafka Producer │
    │    (Neon)      │  │                │  │                │
    └────────────────┘  └────────────────┘  └───────┬────────┘
                                                     │
                                                     ▼

                                           ┌────────────────┐
                                           │ Kafka Consumer │
                                           └───────┬────────┘
                                                   │
                                                   ▼

                                         ┌──────────────────┐
                                         │ Analytics Events │
                                         └──────────────────┘

                                ▼
                     ┌────────────────────────┐
                     │      Prometheus        │
                     └──────────┬─────────────┘
```

---

## URL Creation Workflow

```text
User
 │
 ▼
Submit Original URL
 │
 ▼
FastAPI Backend
 │
 ▼
Snowflake ID Generator
 │
 ▼
Base62 Encoding
 │
 ▼
Generate Short Code
 │
 ▼
Store in PostgreSQL
 │
 ▼
Return Short URL
```

---

## URL Redirection Workflow

```text
User Clicks Short URL
          │
          ▼
      FastAPI API
          │
          ▼
    Redis Cache Check
      │          │
      │          │
      ▼          ▼

 Cache Hit    Cache Miss
      │          │
      │          ▼
      │    PostgreSQL Lookup
      │          │
      └────► Cache Result
                 │
                 ▼
          Track Analytics
                 │
                 ▼
          Redirect User
```

---

## API Endpoints

### Authentication

| Method | Endpoint |
|----------|----------|
| POST | /auth/register |
| POST | /auth/login |

### URL Management

| Method | Endpoint |
|----------|----------|
| POST | /shorten |
| GET | /my-urls |
| DELETE | /url/{id} |
| GET | /r/{short_code} |

### Analytics

| Method | Endpoint |
|----------|----------|
| GET | /analytics/{short_code} |

### Monitoring

| Method | Endpoint |
|----------|----------|
| GET | /metrics |

---

## Project Structure

```text
FlashLink
│
├── .github
│
├── app
│   ├── api
│   ├── cache
│   ├── core
│   ├── database
│   ├── dependencies
│   ├── kafka
│   ├── middleware
│   ├── monitoring
│   ├── models
│   └── schemas
│
├── dashboard
│
├── docker
│
├── frontend
│
├── monitoring
│
├── scripts
│
├── tests
│
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── requirements.txt
└── README.md
```

---

## Security Features

- JWT Authentication
- Password Hashing with BCrypt
- Protected Routes
- User-Specific URL Ownership
- Input Validation with Pydantic

---

## Monitoring & Observability

FlashLink integrates Prometheus and Grafana to monitor:

- URLs Created
- Total Redirects
- Cache Hits
- Cache Misses
- API Health
- System Metrics

---

## Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- Neon PostgreSQL

### Monitoring

- Prometheus

---

## Future Enhancements

- Custom Short URLs
- QR Code Generation
- URL Expiration
- Device Analytics
- Geo Analytics
- Real-Time Event Processing
- Advanced Kafka Streaming
- Click Fraud Detection
- Team Workspaces

---

## Key Concepts Demonstrated

- Distributed Systems
- URL Shortening Algorithms
- Snowflake ID Generation
- Base62 Encoding
- REST API Development
- Authentication & Authorization
- PostgreSQL Database Design
- Redis Caching
- Kafka Event Streaming
- Monitoring & Observability
- Docker Containerization
- Cloud Deployment

---

## Author

**Eswar Maguluri**

B.Sc Computer Science

Full Stack Developer

Python • FastAPI • React • PostgreSQL • Redis • Kafka • Docker • Prometheus
