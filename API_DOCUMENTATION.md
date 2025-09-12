# AWCH Backend API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
Currently, the API does not require authentication.

## Error Handling
All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Resource created
- `400` - Bad request
- `404` - Resource not found
- `500` - Server error

Error responses include a message field explaining the error:
```json
{
  "message": "Error message details"
}
```

## Endpoints

### Submissions

#### Get all submissions
Returns a list of all submissions sorted by creation date (newest first).

- **URL**: `/api/submissions`
- **Method**: `GET`
- **URL Parameters**: None
- **Data Parameters**: None
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "john@example.com",
        "message": "This is a sample message",
        "status": "pending",
        "createdAt": "2023-06-22T10:30:45.123Z"
      },
      ...
    ]
    ```
- **Error Response**:
  - **Code**: 500
  - **Content**: `{ "message": "Error message" }`
- **Sample Call**:
  ```javascript
  fetch('http://localhost:5000/api/submissions')
    .then(response => response.json())
    .then(data => console.log(data));
  ```

#### Get a specific submission
Returns a single submission by ID.

- **URL**: `/api/submissions/:id`
- **Method**: `GET`
- **URL Parameters**: 
  - `id=[MongoDB ObjectId]` - The ID of the submission
- **Data Parameters**: None
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "This is a sample message",
      "status": "pending",
      "createdAt": "2023-06-22T10:30:45.123Z"
    }
    ```
- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "message": "Submission not found" }`
  - **Code**: 500
  - **Content**: `{ "message": "Error message" }`
- **Sample Call**:
  ```javascript
  fetch('http://localhost:5000/api/submissions/60d21b4667d0d8992e610c85')
    .then(response => response.json())
    .then(data => console.log(data));
  ```

#### Create a new submission
Creates a new submission.

- **URL**: `/api/submissions`
- **Method**: `POST`
- **URL Parameters**: None
- **Data Parameters**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "This is a sample message"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "This is a sample message",
      "status": "pending",
      "createdAt": "2023-06-22T10:30:45.123Z"
    }
    ```
- **Error Response**:
  - **Code**: 400
  - **Content**: `{ "message": "Error message" }`
- **Sample Call**:
  ```javascript
  fetch('http://localhost:5000/api/submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: "John Doe",
      email: "john@example.com",
      message: "This is a sample message"
    })
  })
    .then(response => response.json())
    .then(data => console.log(data));
  ```

#### Update a submission
Updates a submission's status.

- **URL**: `/api/submissions/:id`
- **Method**: `PATCH`
- **URL Parameters**: 
  - `id=[MongoDB ObjectId]` - The ID of the submission
- **Data Parameters**:
  ```json
  {
    "status": "approved"
  }
  ```
  Status must be one of: "pending", "reviewed", "approved", "rejected"
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "This is a sample message",
      "status": "approved",
      "createdAt": "2023-06-22T10:30:45.123Z"
    }
    ```
- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "message": "Submission not found" }`
  - **Code**: 400
  - **Content**: `{ "message": "Error message" }`
- **Sample Call**:
  ```javascript
  fetch('http://localhost:5000/api/submissions/60d21b4667d0d8992e610c85', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: "approved"
    })
  })
    .then(response => response.json())
    .then(data => console.log(data));
  ```

#### Delete a submission
Deletes a submission.

- **URL**: `/api/submissions/:id`
- **Method**: `DELETE`
- **URL Parameters**: 
  - `id=[MongoDB ObjectId]` - The ID of the submission
- **Data Parameters**: None
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ "message": "Submission deleted" }`
- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "message": "Submission not found" }`
  - **Code**: 500
  - **Content**: `{ "message": "Error message" }`
- **Sample Call**:
  ```javascript
  fetch('http://localhost:5000/api/submissions/60d21b4667d0d8992e610c85', {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => console.log(data));
  ```

## Testing the API

You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- cURL commands
- JavaScript fetch API (as shown in samples)

## Data Model

### Submission

| Field     | Type     | Description                                           |
|-----------|----------|-------------------------------------------------------|
| _id       | ObjectId | Unique identifier (auto-generated)                    |
| name      | String   | Name of the person submitting (required)              |
| email     | String   | Email of the person submitting (required)             |
| message   | String   | Content of the submission (required)                  |
| status    | String   | Status of the submission (default: "pending")         |
| createdAt | Date     | Timestamp when submission was created (auto-generated)|

The status field can have the following values:
- "pending" - New submission, not yet reviewed
- "reviewed" - Submission has been seen but not decided on
- "approved" - Submission has been accepted
- "rejected" - Submission has been declined 