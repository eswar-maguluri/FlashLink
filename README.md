# FlashLink

FlashLink is a distributed URL shortening platform built using FastAPI, React, PostgreSQL, Redis, Kafka, Docker, Prometheus, and Grafana.

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
- Grafana Dashboards
- Dockerized Deployment

---

## Live Demo

### Frontend

https://flash-link-26.vercel.app

### Backend API

https://flashlink-api.onrender.com

### API Documentation

https://flashlink-api.onrender.com/docs


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
- Grafana Dashboards
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
- Grafana

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
                                │
                                ▼
                     ┌────────────────────────┐
                     │        Grafana         │
                     └────────────────────────┘
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
- Grafana

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

Python • FastAPI • React • PostgreSQL • Redis • Kafka • Docker • Prometheus • Grafana


<img width="1920" height="934" alt="Login Page" src="https://github.com/user-attachments/assets/4844aded-de33-4811-b1ff-431072e90aec" />

<img width="1920" height="935" alt="Registration Page" src="https://github.com/user-attachments/assets/2df48723-08ed-4f78-a9a1-ff6d4fd7ed3b" />

<img width="1910" height="993" alt="Dashboard" src="https://github.com/user-attachments/assets/6f022591-8be5-4162-9aec-d55269434ceb" />

<img width="1907" height="581" alt="Analytics Dashboard" src="https://github.com/user-attachments/assets/9e2690b5-1d80-476a-9c87-8d9e14adb9dd" />

<img width="1912" height="923" alt="Grafana Dashboard" src="https://github.com/user-attachments/assets/957d4a38-d0be-4f5a-b01e-7594efc9660e" />

<img width="1894" height="929" alt="Swagger API Docs" src="https://github.com/user-attachments/assets/e210f6cb-88ad-4b97-b1f6-f5a7dc9c6ac5" />
