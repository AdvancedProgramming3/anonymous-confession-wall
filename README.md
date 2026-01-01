# Anonymous Confession & Advice Wall

## Overview
A simple web application for users to register, log in, and post anonymous confessions or advice. Users can view all posts and like them. Posts are anonymous to the public, using Java Servlets, JDBC, MySQL, and a React/Next.js frontend.

## Features
- User registration and login/logout
- Post anonymous confessions or advice (login required)
- View all posts
- Like posts
- Database persistence

**Not Included:** User profiles, comments, admin moderation, JWT/OAuth.

## Technology Stack
### Backend
- Java Servlets
- JDBC
- Relational Database (MySQL)
- HTTP Sessions (for login)
- JSON (REST API)

### Frontend
- React or Next.js
- Fetch API
- Plain CSS

### Tools
- Git & GitHub
- Postman (API testing)

## Database Design
### Table: users
| Column     | Type      | Description    |
|------------|-----------|----------------|
| id         | INT (PK)  | Auto-increment |
| username   | VARCHAR   | Unique         |
| password   | VARCHAR   | Hashed         |
| created_at | TIMESTAMP | Auto           |

### Table: confessions
| Column     | Type      | Description             |
|------------|-----------|-------------------------|
| id         | INT (PK)  | Auto-increment          |
| content    | TEXT      | Confession text         |
| likes      | INT       | Default 0               |
| user_id    | INT (FK)  | References users        |
| created_at | TIMESTAMP | Auto                    |

### Table: advice
| Column     | Type      | Description             |
|------------|-----------|-------------------------|
| id         | INT (PK)  | Auto-increment          |
| content    | TEXT      | Advice text             |
| likes      | INT       | Default 0               |
| user_id    | INT (FK)  | References users        |
| created_at | TIMESTAMP | Auto                    |
| confession_id | INT (FK) | References confession |

**Note:** `user_id` is never exposed in API responses for anonymity.

## API Endpoints
Base URL: `/api`

### Authentication
- **POST /auth/register**  
  Request: `{ "username": "john", "password": "123456" }`

- **POST /auth/login** (creates HTTP session)

- **POST /auth/logout**

### Confessions
- **POST /confessions** (login required, create)

- **GET /confessions** (get all)

- **POST /confessions/{id}/like** (like)

### Advice
- **POST /advice** (login required, create)

- **GET /advice** (get all)

- **POST /advice/{id}/like** (like)

## API Response Model (Example)
```json
{
  "id": 1,
  "content": "I feel lost about my future",
  "likes": 3,
  "createdAt": "2025-12-20T10:30:00"
}
```
