# Database Schema

## Entity Relationship Overview

```text
User
 ├── Shelf
 │     ├── Media
 │     └── ShelfRating
 │
 └── UserProfile
```

---

## User

| Column     | Type      |
| ---------- | --------- |
| id         | Long      |
| username   | String    |
| email      | String    |
| password   | String    |
| created_at | Timestamp |

---

## Shelf

| Column     | Type      |
| ---------- | --------- |
| id         | Long      |
| name       | String    |
| is_public  | Boolean   |
| user_id    | Long      |
| created_at | Timestamp |

Relationship:

* Many Shelves belong to One User

---

## Media

| Column   | Type    |
| -------- | ------- |
| id       | Long    |
| title    | String  |
| type     | Enum    |
| creator  | String  |
| status   | Enum    |
| rating   | Integer |
| shelf_id | Long    |

Media Types:

* BOOK
* COMIC
* MOVIE
* TV_SHOW
* GAME

Status Types:

* PLANNED
* IN_PROGRESS
* COMPLETED

Relationship:

* Many Media Entries belong to One Shelf

---

## Shelf Rating

| Column   | Type    |
| -------- | ------- |
| id       | Long    |
| rating   | Integer |
| user_id  | Long    |
| shelf_id | Long    |

Relationship:

* User rates Shelf
* Shelf receives many Ratings

---

## User Profile

| Column          | Type   |
| --------------- | ------ |
| id              | Long   |
| bio             | String |
| profile_picture | String |
| user_id         | Long   |

Relationship:

* One User has One Profile
