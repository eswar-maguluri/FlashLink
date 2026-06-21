# FlashLink

FlashLink is a backend-focused URL shortening platform built with FastAPI, PostgreSQL, and Redis. The project is designed to explore scalable backend architecture, efficient URL management, distributed identifier generation, caching strategies, and secure API development.

The objective of FlashLink is not only to provide URL shortening functionality but also to serve as a practical implementation of modern backend engineering concepts and system design principles.

---

## Overview

FlashLink enables users to generate compact, shareable URLs while maintaining a clean and extensible architecture for future enhancements such as analytics, caching, monitoring, and distributed processing.

The project focuses on:

* URL shortening and redirection
* Authentication and security
* Distributed ID generation
* Database optimization
* High-performance caching
* Scalable backend architecture

---

## Technology Stack

### Backend

* Python
* FastAPI
* Uvicorn

### Database

* PostgreSQL

### Cache

* Redis

### Authentication

* JWT Authentication
* Password Hashing

### Development Tools

* Git
* GitHub

---

## Architecture

FlashLink follows a modular architecture that separates application concerns into dedicated layers for APIs, business logic, database access, caching, security, and schemas.

```text
FlashLink
│
├── app
│   ├── api
│   ├── cache
│   ├── core
│   ├── db
│   ├── dependencies
│   ├── middleware
│   └── schemas
│
├── main.py
├── requirements.txt
└── README.md
```

This structure improves maintainability, scalability, and ease of development.

---

## Core Components

### URL Shortening

Converts long URLs into compact and shareable links using Base62 encoding.

### Snowflake ID Generator

Generates unique, time-sortable identifiers suitable for scalable applications and distributed environments.

### Authentication System

Provides secure user authentication using JWT-based access tokens and password hashing.

### Redis Integration

Supports high-speed caching to improve performance and reduce database load.

### PostgreSQL Storage

Stores user data, URLs, and application metadata using a relational database system.

---

## API Endpoints

### Authentication

```http
POST /auth/register
POST /auth/login
```

### URL Services

```http
POST /shorten
GET /{short_id}
GET /analytics/{short_id}
```

Endpoint availability may vary depending on the current development stage.

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/eswar-maguluri/FlashLink.git
cd FlashLink
```

### Create a Virtual Environment

```bash
python -m venv .venv
```

### Activate the Environment

Windows:

```bash
.venv\Scripts\activate
```

Linux/macOS:

```bash
source .venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file and configure the required settings:

```env
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
SECRET_KEY=your_secret_key
```

### Run the Application

```bash
uvicorn main:app --reload
```

### API Documentation

```text
http://localhost:8000/docs
```

---

## Development Status

FlashLink is currently under active development. The project foundation, authentication utilities, Snowflake ID generation, Redis integration, and database configuration have been established. Additional functionality including complete URL management, analytics, caching optimizations, and deployment tooling will be added as development progresses.

---

## Learning Objectives

This project is being developed to gain hands-on experience with:

* Backend Development
* REST API Design
* FastAPI
* PostgreSQL
* Redis
* Authentication & Security
* System Design
* Scalable Architecture
* Performance Optimization

---

## Author

**Eswar Maguluri**

GitHub: https://github.com/eswar-maguluri
