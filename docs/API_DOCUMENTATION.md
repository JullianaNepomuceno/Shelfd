# API Documentation

## Base URL

```http
/api
```

---

## Authentication

### Register User

```http
POST /auth/register
```

Request Body:

```json
{
  "username": "jane_doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "User registered successfully"
}
```

---

### Login User

```http
POST /auth/login
```

Request Body:

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "jwt_token"
}
```

---

## Shelves

### Get User Shelves

```http
GET /shelves
```

### Create Shelf

```http
POST /shelves
```

Request Body:

```json
{
  "name": "My Favorite Books",
  "isPublic": true
}
```

### Update Shelf

```http
PUT /shelves/{id}
```

### Delete Shelf

```http
DELETE /shelves/{id}
```

---

## Media

### Get Media Entries

```http
GET /media
```

### Add Media Entry

```http
POST /media
```

Request Body:

```json
{
  "title": "The Hobbit",
  "type": "BOOK",
  "creator": "J.R.R. Tolkien",
  "status": "IN_PROGRESS",
  "rating": 5
}
```

### Update Media Entry

```http
PUT /media/{id}
```

### Delete Media Entry

```http
DELETE /media/{id}
```

---

## Public Shelves

### Browse Public Shelves

```http
GET /public-shelves
```

### Rate Public Shelf

```http
POST /public-shelves/{id}/rating
```

Request Body:

```json
{
  "rating": 5
}
```
