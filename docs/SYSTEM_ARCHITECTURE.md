# System Architecture

## Overview

Shelfd follows a client-server architecture using React for the frontend, Spring Boot for the backend, and PostgreSQL for data storage.

```text
+------------------+
| React Frontend   |
+------------------+
          |
          | HTTP Requests
          |
          v
+------------------+
| Spring Boot API  |
+------------------+
          |
          | JPA/Hibernate
          |
          v
+------------------+
| PostgreSQL DB    |
+------------------+
```

---

## Frontend Layer

Responsibilities:

* User Interface
* Authentication Forms
* Shelf Management Pages
* Analytics Dashboard
* Public Shelf Discovery

Technologies:

* React
* TypeScript
* HTML
* CSS

---

## Backend Layer

Responsibilities:

* Authentication
* Business Logic
* Shelf Management
* Media Management
* Public Shelf Ratings
* Analytics Generation

Technologies:

* Spring Boot
* Spring Security
* Spring Data JPA
* Lombok

---

## Database Layer

Responsibilities:

* Store Users
* Store Shelves
* Store Media Entries
* Store Ratings
* Store Profile Information

Technology:

* PostgreSQL

---

## Security Architecture

```text
Client Login
      |
      v
Spring Security
      |
      v
Authentication Service
      |
      v
Database Verification
```

Features:

* Password Encryption
* Secure Authentication
* Role-Based Authorization (Optional Future Feature)
