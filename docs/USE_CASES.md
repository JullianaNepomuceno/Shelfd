# Use Cases
___

## Use Case 1: Register Account

### Actor

User

### Preconditions

* User is not logged in.

### Main Flow

1. User opens registration page.
2. User enters username, email, and password.
3. System validates information.
4. System creates account.
5. User is redirected to login page.

### Postconditions

* User account is created.

---

## Use Case 2: Create Shelf

### Actor

Authenticated User

### Preconditions

* User is logged in.

### Main Flow

1. User selects "Create Shelf".
2. User enters shelf name.
3. User chooses public or private visibility.
4. System saves shelf.

### Postconditions

* New shelf appears in user's profile.

---

## Use Case 3: Add Media

### Actor

Authenticated User

### Preconditions

* User owns a shelf.

### Main Flow

1. User opens a shelf.
2. User clicks "Add Media".
3. User enters media details.
4. User selects status and rating.
5. System stores media entry.

### Postconditions

* Media item is added to shelf.

---

## Use Case 4: Update Progress

### Actor

Authenticated User

### Preconditions

* Media item exists.

### Main Flow

1. User opens media entry.
2. User changes status.
3. User saves changes.

### Postconditions

* Progress is updated.

---

## Use Case 5: Share Shelf

### Actor

Authenticated User

### Preconditions

* User owns a shelf.

### Main Flow

1. User opens shelf settings.
2. User enables public visibility.
3. System publishes shelf.

### Postconditions

* Other users can view shelf.

---

## Use Case 6: Rate Public Shelf

### Actor

Authenticated User

### Preconditions

* Public shelf exists.

### Main Flow

1. User browses public shelves.
2. User selects a shelf.
3. User submits rating.
4. System stores rating.

### Postconditions

* Shelf rating is updated.
