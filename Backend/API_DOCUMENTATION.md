# Mid-Day Programming Club (MDPC) API Documentation

This document provides comprehensive information about the MDPC backend API endpoints, authentication, and data structures to help frontend developers integrate with the backend services.

## Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [User Management](#user-management)
5. [Member Management](#member-management)
6. [Blog Management](#blog-management)
7. [Event Management](#event-management)
8. [Contest Management](#contest-management)
9. [Resource Management](#resource-management)
10. [Codeforces Integration](#codeforces-integration)
11. [Error Handling](#error-handling)
12. [File Upload](#file-upload)
13. [Backend File Structure](#backend-file-structure)

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:4000/api/v1
```

For production, this will change to the deployed server URL.

## Authentication

The API uses JWT (JSON Web Token) for authentication.

### Token Management

- **Access Token**: Short-lived token (1 day) for API access
- **Refresh Token**: Long-lived token (30 days) to get new access tokens

Tokens are automatically stored in HTTP-only cookies when logging in, but they're also returned in the response body for clients that can't use cookies.

### Authentication Headers

For endpoints requiring authentication, include either:

1. **Cookie-based authentication** (automatically handled by browsers)

   OR

2. **Bearer token in Authorization header**:
   ```
   Authorization: Bearer <your_access_token>
   ```

### Role-Based Access

The API implements role-based access control:

- **Public**: Endpoints accessible without authentication
- **Protected**: Requires valid user authentication
- **Admin-only**: Requires admin role

## Response Format

All API responses follow a consistent format:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Operation successful",
  "success": true
}
```

- `statusCode`: HTTP status code
- `data`: Response payload
- `message`: Human-readable message
- `success`: Boolean indicating success/failure

## User Management

### Register a New User

- **URL**: `/users/register`
- **Method**: `POST`
- **Authentication**: None
- **Description**: Create a new user account
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "programmingHandles": {
      "codeforces": "john_cf"
    }
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "user": {
        "_id": "614c5b68e987f321d8e9a4b2",
        "name": "John Doe",
        "email": "john@example.com",
        "programmingHandles": {
          "codeforces": "john_cf"
        },
        "role": "user",
        "isMember": false,
        "createdAt": "2023-09-23T15:32:24.103Z",
        "updatedAt": "2023-09-23T15:32:24.103Z"
      }
    },
    "message": "User registered successfully",
    "success": true
  }
  ```

### Login User

- **URL**: `/users/login`
- **Method**: `POST`
- **Authentication**: None
- **Description**: Authenticate a user and get access tokens
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "614c5b68e987f321d8e9a4b2",
        "name": "John Doe",
        "email": "john@example.com",
        "programmingHandles": {
          "codeforces": "john_cf"
        },
        "role": "user",
        "isMember": false
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "User logged in successfully",
    "success": true
  }
  ```

### Refresh Access Token

- **URL**: `/users/refresh-token`
- **Method**: `POST`
- **Authentication**: None (requires refresh token)
- **Description**: Get a new access token using refresh token
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "Access token refreshed successfully",
    "success": true
  }
  ```

### Logout User

- **URL**: `/users/logout`
- **Method**: `POST`
- **Authentication**: Required
- **Description**: Invalidate user's session
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "User logged out successfully",
    "success": true
  }
  ```

### Get User Profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Get logged-in user's profile
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "614c5b68e987f321d8e9a4b2",
        "name": "John Doe",
        "email": "john@example.com",
        "programmingHandles": {
          "codeforces": "john_cf"
        },
        "role": "user",
        "isMember": false,
        "avatar": "/uploads/images/users/avatar-123456.jpg"
      }
    },
    "message": "User profile fetched successfully",
    "success": true
  }
  ```

### Update User Profile

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Authentication**: Required
- **Description**: Update logged-in user's profile
- **Request Body**: FormData with the following fields
  ```
  name: "Updated Name"
  programmingHandles: { "codeforces": "updated_handle" }
  avatar: <file>  // Optional file upload
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "614c5b68e987f321d8e9a4b2",
        "name": "Updated Name",
        "email": "john@example.com",
        "programmingHandles": {
          "codeforces": "updated_handle"
        },
        "role": "user",
        "isMember": false,
        "avatar": "/uploads/images/users/avatar-123456.jpg"
      }
    },
    "message": "User profile updated successfully",
    "success": true
  }
  ```

### Get All Users (Admin Only)

- **URL**: `/users`
- **Method**: `GET`
- **Authentication**: Admin only
- **Description**: Get a list of all users with pagination and filters
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
  - `role`: Filter by role ("admin" or "user")
  - `isMember`: Filter by membership status ("true" or "false")
  - `search`: Search in name or email
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "users": [
        {
          "_id": "614c5b68e987f321d8e9a4b2",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "user",
          "isMember": false
        }
        // More users...
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalUsers": 42,
        "totalPages": 5
      }
    },
    "message": "Users fetched successfully",
    "success": true
  }
  ```

### Update User Status (Admin Only)

- **URL**: `/users/:id/status`
- **Method**: `PATCH`
- **Authentication**: Admin only
- **Description**: Update a user's status
- **Request Body**:
  ```json
  {
    "status": "active" // Options: "pending", "active", "inactive"
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "614c5b68e987f321d8e9a4b2",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "status": "active"
      }
    },
    "message": "User status updated to active successfully",
    "success": true
  }
  ```

## Member Management

Members represent club membership applications and approved members.

### Apply for Membership

- **URL**: `/members/apply`
- **Method**: `POST`
- **Authentication**: None
- **Description**: Submit a club membership application
- **Request Body**: FormData with the following fields
  ```
  name: "John Doe"
  email: "john@example.com"
  phone: "1234567890"
  session: "2023-2024"
  roll: "CSE2301"
  department: "Computer Science"
  programmingHandles: { "codeforces": "john_cf", "vjudge": "john_vj" }
  photo: <file>  // Optional file upload
  ```
- **Response**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "member": {
        "_id": "614c5d23f8a72b1f45e73a1c",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "session": "2023-2024",
        "roll": "CSE2301",
        "department": "Computer Science",
        "programmingHandles": {
          "codeforces": "john_cf",
          "vjudge": "john_vj"
        },
        "photo": "/uploads/images/members/photo-123456.jpg",
        "status": "pending",
        "createdAt": "2023-09-23T15:39:31.543Z",
        "updatedAt": "2023-09-23T15:39:31.543Z"
      }
    },
    "message": "Membership application submitted successfully, awaiting approval",
    "success": true
  }
  ```

### Get All Members (Admin Only)

- **URL**: `/members`
- **Method**: `GET`
- **Authentication**: Admin only
- **Description**: Get all membership applications with pagination and filters
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
  - `status`: Filter by status ("pending", "active", "inactive")
  - `department`: Filter by department
  - `session`: Filter by session
  - `search`: Search in name, email, or roll
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "members": [
        {
          "_id": "614c5d23f8a72b1f45e73a1c",
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "1234567890",
          "session": "2023-2024",
          "roll": "CSE2301",
          "department": "Computer Science",
          "status": "pending",
          "user": {
            "_id": "614c5b68e987f321d8e9a4b2",
            "name": "John Doe",
            "email": "john@example.com"
          }
        }
        // More members...
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalMembers": 25,
        "totalPages": 3
      }
    },
    "message": "Members fetched successfully",
    "success": true
  }
  ```

### Get Member Details (Admin Only)

- **URL**: `/members/:id`
- **Method**: `GET`
- **Authentication**: Admin only
- **Description**: Get a specific member's details
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "member": {
        "_id": "614c5d23f8a72b1f45e73a1c",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "session": "2023-2024",
        "roll": "CSE2301",
        "department": "Computer Science",
        "programmingHandles": {
          "codeforces": "john_cf",
          "vjudge": "john_vj"
        },
        "photo": "/uploads/images/members/photo-123456.jpg",
        "status": "pending",
        "user": {
          "_id": "614c5b68e987f321d8e9a4b2",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    },
    "message": "Member fetched successfully",
    "success": true
  }
  ```

### Update Member Status (Admin Only)

- **URL**: `/members/:id/status`
- **Method**: `PATCH`
- **Authentication**: Admin only
- **Description**: Update a member's status (approve/reject membership)
- **Request Body**:
  ```json
  {
    "status": "active" // Options: "pending", "active", "inactive"
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "member": {
        "_id": "614c5d23f8a72b1f45e73a1c",
        "name": "John Doe",
        "email": "john@example.com",
        "status": "active",
        "joinDate": "2023-09-25T10:15:30.000Z"
      }
    },
    "message": "Member approved successfully",
    "success": true
  }
  ```

### Delete Member (Admin Only)

- **URL**: `/members/:id`
- **Method**: `DELETE`
- **Authentication**: Admin only
- **Description**: Delete a member/application
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Member deleted successfully",
    "success": true
  }
  ```

## Blog Management

### Create Blog Post

- **URL**: `/blogs`
- **Method**: `POST`
- **Authentication**: Required
- **Description**: Create a new blog post (automatically set to pending status)
- **Request Body**: FormData with the following fields
  ```
  title: "Understanding Dynamic Programming"
  content: "Dynamic programming is..."
  category: "Algorithms"
  tags: ["algorithms", "dynamic programming", "optimization"]
  summary: "A brief introduction to dynamic programming concepts"
  image: <file>  // Optional file upload
  ```
- **Response**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "blog": {
        "_id": "614c60a1e23d7f32c9b8e5a3",
        "title": "Understanding Dynamic Programming",
        "content": "Dynamic programming is...",
        "author": {
          "_id": "614c5b68e987f321d8e9a4b2",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "category": "Algorithms",
        "tags": ["algorithms", "dynamic programming", "optimization"],
        "status": "pending",
        "summary": "A brief introduction to dynamic programming concepts",
        "image": "/uploads/images/blogs/image-123456.jpg",
        "createdAt": "2023-09-23T15:54:41.302Z",
        "updatedAt": "2023-09-23T15:54:41.302Z"
      }
    },
    "message": "Blog created successfully and pending approval",
    "success": true
  }
  ```

### Get All Blogs

- **URL**: `/blogs`
- **Method**: `GET`
- **Authentication**: None (public blogs) / Admin (for all blogs)
- **Description**: Get blogs with pagination and filters (public API shows only approved blogs)
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
  - `status`: Filter by status (admin only, "pending", "approved", "rejected")
  - `category`: Filter by category
  - `tag`: Filter by tag
  - `author`: Filter by author ID
  - `search`: Search in title or content
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "blogs": [
        {
          "_id": "614c60a1e23d7f32c9b8e5a3",
          "title": "Understanding Dynamic Programming",
          "summary": "A brief introduction to dynamic programming concepts",
          "author": {
            "_id": "614c5b68e987f321d8e9a4b2",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "category": "Algorithms",
          "tags": ["algorithms", "dynamic programming", "optimization"],
          "status": "approved",
          "image": "/uploads/images/blogs/image-123456.jpg",
          "publishedDate": "2023-09-24T09:30:15.000Z",
          "createdAt": "2023-09-23T15:54:41.302Z",
          "updatedAt": "2023-09-24T09:30:15.000Z"
        }
        // More blogs...
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalBlogs": 18,
        "totalPages": 2
      }
    },
    "message": "Blogs fetched successfully",
    "success": true
  }
  ```

### Get Blog Details

- **URL**: `/blogs/:id`
- **Method**: `GET`
- **Authentication**: None (approved blogs) / Author or Admin (any status)
- **Description**: Get a specific blog post
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "blog": {
        "_id": "614c60a1e23d7f32c9b8e5a3",
        "title": "Understanding Dynamic Programming",
        "content": "Dynamic programming is...",
        "author": {
          "_id": "614c5b68e987f321d8e9a4b2",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "category": "Algorithms",
        "tags": ["algorithms", "dynamic programming", "optimization"],
        "status": "approved",
        "summary": "A brief introduction to dynamic programming concepts",
        "image": "/uploads/images/blogs/image-123456.jpg",
        "publishedDate": "2023-09-24T09:30:15.000Z",
        "createdAt": "2023-09-23T15:54:41.302Z",
        "updatedAt": "2023-09-24T09:30:15.000Z"
      }
    },
    "message": "Blog fetched successfully",
    "success": true
  }
  ```

### Update Blog

- **URL**: `/blogs/:id`
- **Method**: `PUT`
- **Authentication**: Required (must be author or admin)
- **Description**: Update a blog post (note: if non-admin user updates, status resets to "pending")
- **Request Body**: FormData with the following fields
  ```
  title: "Updated Dynamic Programming Guide"
  content: "Updated content..."
  category: "Algorithms"
  tags: ["algorithms", "dynamic programming", "optimization", "examples"]
  summary: "A comprehensive guide to dynamic programming with examples"
  image: <file>  // Optional file upload
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "blog": {
        "_id": "614c60a1e23d7f32c9b8e5a3",
        "title": "Updated Dynamic Programming Guide",
        "content": "Updated content...",
        "author": {
          "_id": "614c5b68e987f321d8e9a4b2",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "category": "Algorithms",
        "tags": [
          "algorithms",
          "dynamic programming",
          "optimization",
          "examples"
        ],
        "status": "pending",
        "summary": "A comprehensive guide to dynamic programming with examples",
        "image": "/uploads/images/blogs/image-789012.jpg"
      }
    },
    "message": "Blog updated successfully",
    "success": true
  }
  ```

### Delete Blog

- **URL**: `/blogs/:id`
- **Method**: `DELETE`
- **Authentication**: Required (must be author or admin)
- **Description**: Delete a blog post
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Blog deleted successfully",
    "success": true
  }
  ```

### Update Blog Status (Admin Only)

- **URL**: `/blogs/:id/status`
- **Method**: `PATCH`
- **Authentication**: Admin only
- **Description**: Update blog's approval status
- **Request Body**:
  ```json
  {
    "status": "approved" // Options: "pending", "approved", "rejected"
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "blog": {
        "_id": "614c60a1e23d7f32c9b8e5a3",
        "title": "Updated Dynamic Programming Guide",
        "status": "approved",
        "publishedDate": "2023-09-25T14:25:30.000Z"
      }
    },
    "message": "Blog approved successfully",
    "success": true
  }
  ```

## Event Management

### Create Event (Admin Only)

- **URL**: `/events`
- **Method**: `POST`
- **Authentication**: Admin only
- **Description**: Create a new event
- **Request Body**: FormData with the following fields
  ```
  title: "Competitive Programming Workshop"
  description: "Learn competitive programming techniques..."
  date: "2023-10-15"
  time: "14:00"
  venue: "CSE Building, Room 301"
  type: "workshop"  // Options: "workshop", "seminar", "competition", "other"
  registrationOpen: true
  registrationDeadline: "2023-10-14"
  maxParticipants: 50
  status: "upcoming"  // Options: "upcoming", "ongoing", "completed", "cancelled"
  image: <file>  // Optional file upload
  ```
- **Response**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "event": {
        "_id": "614c6503a5b3e18f7c1d4f2e",
        "title": "Competitive Programming Workshop",
        "description": "Learn competitive programming techniques...",
        "date": "2023-10-15T00:00:00.000Z",
        "time": "14:00",
        "venue": "CSE Building, Room 301",
        "type": "workshop",
        "registrationOpen": true,
        "registrationDeadline": "2023-10-14T00:00:00.000Z",
        "maxParticipants": 50,
        "status": "upcoming",
        "participants": [],
        "image": "/uploads/images/events/image-123456.jpg",
        "createdAt": "2023-09-23T16:12:19.756Z",
        "updatedAt": "2023-09-23T16:12:19.756Z"
      }
    },
    "message": "Event created successfully",
    "success": true
  }
  ```

### Get All Events

- **URL**: `/events`
- **Method**: `GET`
- **Authentication**: None
- **Description**: Get events with pagination and filters
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
  - `status`: Filter by status ("upcoming", "ongoing", "completed", "cancelled")
  - `type`: Filter by event type ("workshop", "seminar", "competition", "other")
  - `fromDate`: Filter events from this date
  - `toDate`: Filter events until this date
  - `registrationOpen`: Filter by registration status ("true" or "false")
  - `search`: Search in title or description
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "events": [
        {
          "_id": "614c6503a5b3e18f7c1d4f2e",
          "title": "Competitive Programming Workshop",
          "description": "Learn competitive programming techniques...",
          "date": "2023-10-15T00:00:00.000Z",
          "time": "14:00",
          "venue": "CSE Building, Room 301",
          "type": "workshop",
          "registrationOpen": true,
          "registrationDeadline": "2023-10-14T00:00:00.000Z",
          "maxParticipants": 50,
          "status": "upcoming",
          "participants": [],
          "image": "/uploads/images/events/image-123456.jpg"
        }
        // More events...
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalEvents": 8,
        "totalPages": 1
      }
    },
    "message": "Events fetched successfully",
    "success": true
  }
  ```

### Get Event Details

- **URL**: `/events/:id`
- **Method**: `GET`
- **Authentication**: None
- **Description**: Get details of a specific event
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "event": {
        "_id": "614c6503a5b3e18f7c1d4f2e",
        "title": "Competitive Programming Workshop",
        "description": "Learn competitive programming techniques...",
        "date": "2023-10-15T00:00:00.000Z",
        "time": "14:00",
        "venue": "CSE Building, Room 301",
        "type": "workshop",
        "registrationOpen": true,
        "registrationDeadline": "2023-10-14T00:00:00.000Z",
        "maxParticipants": 50,
        "status": "upcoming",
        "participants": [
          {
            "_id": "614c5b68e987f321d8e9a4b2",
            "name": "John Doe",
            "email": "john@example.com"
          }
          // More participants...
        ],
        "image": "/uploads/images/events/image-123456.jpg"
      },
      "isRegistered": true
    },
    "message": "Event fetched successfully",
    "success": true
  }
  ```

### Update Event (Admin Only)

- **URL**: `/events/:id`
- **Method**: `PUT`
- **Authentication**: Admin only
- **Description**: Update an existing event
- **Request Body**: FormData with the following fields
  ```
  title: "Updated Competitive Programming Workshop"
  description: "Updated description..."
  date: "2023-10-16"
  time: "15:00"
  venue: "CSE Building, Room 302"
  type: "workshop"
  registrationOpen: true
  registrationDeadline: "2023-10-15"
  maxParticipants: 60
  status: "upcoming"
  image: <file>  // Optional file upload
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "event": {
        "_id": "614c6503a5b3e18f7c1d4f2e",
        "title": "Updated Competitive Programming Workshop",
        "description": "Updated description...",
        "date": "2023-10-16T00:00:00.000Z",
        "time": "15:00",
        "venue": "CSE Building, Room 302",
        "type": "workshop",
        "registrationOpen": true,
        "registrationDeadline": "2023-10-15T00:00:00.000Z",
        "maxParticipants": 60,
        "status": "upcoming"
      }
    },
    "message": "Event updated successfully",
    "success": true
  }
  ```

### Delete Event (Admin Only)

- **URL**: `/events/:id`
- **Method**: `DELETE`
- **Authentication**: Admin only
- **Description**: Delete an event
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Event deleted successfully",
    "success": true
  }
  ```

### Register for Event

- **URL**: `/events/:id/register`
- **Method**: `POST`
- **Authentication**: Required
- **Description**: Register the current user for an event
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Registered for event successfully",
    "success": true
  }
  ```

### Cancel Event Registration

- **URL**: `/events/:id/register`
- **Method**: `DELETE`
- **Authentication**: Required
- **Description**: Cancel the current user's registration for an event
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Event registration canceled successfully",
    "success": true
  }
  ```

## Contest Management

### Create Contest (Admin Only)

- **URL**: `/contests`
- **Method**: `POST`
- **Authentication**: Admin only
- **Description**: Create a new programming contest
- **Request Body**: FormData with the following fields
  ```
  title: "Weekly Problem Solving Contest"
  description: "Solve algorithmic problems..."
  date: "2023-10-20"
  time: "18:00"
  duration: "120" // In minutes
  platform: "Codeforces"
  difficultyLevel: "Intermediate"
  registrationStatus: true
  registrationDeadline: "2023-10-20T12:00:00.000Z"
  contestLink: "https://codeforces.com/contests/1234"
  contestType: "individual"  // Options: "individual", "team"
  status: "upcoming"  // Options: "upcoming", "ongoing", "completed", "cancelled"
  image: <file>  // Optional file upload
  ```
- **Response**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "contest": {
        "_id": "614c6a920f7e2b3d45c61a8b",
        "title": "Weekly Problem Solving Contest",
        "description": "Solve algorithmic problems...",
        "date": "2023-10-20T00:00:00.000Z",
        "time": "18:00",
        "duration": "120",
        "platform": "Codeforces",
        "difficultyLevel": "Intermediate",
        "registrationStatus": true,
        "registrationDeadline": "2023-10-20T12:00:00.000Z",
        "contestLink": "https://codeforces.com/contests/1234",
        "contestType": "individual",
        "status": "upcoming",
        "participants": [],
        "image": "/uploads/images/contests/image-123456.jpg",
        "createdAt": "2023-09-23T16:36:18.123Z",
        "updatedAt": "2023-09-23T16:36:18.123Z"
      }
    },
    "message": "Contest created successfully",
    "success": true
  }
  ```

### Get All Contests

- **URL**: `/contests`
- **Method**: `GET`
- **Authentication**: None
- **Description**: Get contests with pagination and filters
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
  - `status`: Filter by status ("upcoming", "ongoing", "completed", "cancelled")
  - `platform`: Filter by platform
  - `contestType`: Filter by contest type ("individual", "team")
  - `difficultyLevel`: Filter by difficulty level
  - `fromDate`: Filter contests from this date
  - `toDate`: Filter contests until this date
  - `registrationStatus`: Filter by registration status ("true" or "false")
  - `search`: Search in title or description
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "contests": [
        {
          "_id": "614c6a920f7e2b3d45c61a8b",
          "title": "Weekly Problem Solving Contest",
          "description": "Solve algorithmic problems...",
          "date": "2023-10-20T00:00:00.000Z",
          "time": "18:00",
          "duration": "120",
          "platform": "Codeforces",
          "difficultyLevel": "Intermediate",
          "registrationStatus": true,
          "registrationDeadline": "2023-10-20T12:00:00.000Z",
          "contestLink": "https://codeforces.com/contests/1234",
          "contestType": "individual",
          "status": "upcoming",
          "participants": [],
          "image": "/uploads/images/contests/image-123456.jpg"
        }
        // More contests...
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalContests": 12,
        "totalPages": 2
      }
    },
    "message": "Contests fetched successfully",
    "success": true
  }
  ```

### Get Contest Details

- **URL**: `/contests/:id`
- **Method**: `GET`
- **Authentication**: None
- **Description**: Get details of a specific contest
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "contest": {
        "_id": "614c6a920f7e2b3d45c61a8b",
        "title": "Weekly Problem Solving Contest",
        "description": "Solve algorithmic problems...",
        "date": "2023-10-20T00:00:00.000Z",
        "time": "18:00",
        "duration": "120",
        "platform": "Codeforces",
        "difficultyLevel": "Intermediate",
        "registrationStatus": true,
        "registrationDeadline": "2023-10-20T12:00:00.000Z",
        "contestLink": "https://codeforces.com/contests/1234",
        "contestType": "individual",
        "status": "upcoming",
        "participants": [
          {
            "user": "614c5b68e987f321d8e9a4b2",
            "rank": null,
            "score": null
          }
          // More participants...
        ],
        "image": "/uploads/images/contests/image-123456.jpg",
        "resultsData": {
          "problems": [],
          "standings": []
        }
      },
      "isRegistered": true
    },
    "message": "Contest fetched successfully",
    "success": true
  }
  ```

### Update Contest (Admin Only)

- **URL**: `/contests/:id`
- **Method**: `PUT`
- **Authentication**: Admin only
- **Description**: Update an existing contest
- **Request Body**: FormData with the following fields
  ```
  title: "Updated Weekly Contest"
  description: "Updated description..."
  date: "2023-10-21"
  time: "19:00"
  duration: "180"
  platform: "Codeforces"
  difficultyLevel: "Advanced"
  registrationStatus: true
  registrationDeadline: "2023-10-21T12:00:00.000Z"
  contestLink: "https://codeforces.com/contests/1235"
  contestType: "individual"
  status: "upcoming"
  image: <file>  // Optional file upload
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "contest": {
        "_id": "614c6a920f7e2b3d45c61a8b",
        "title": "Updated Weekly Contest",
        "description": "Updated description...",
        "date": "2023-10-21T00:00:00.000Z",
        "time": "19:00",
        "duration": "180",
        "platform": "Codeforces",
        "difficultyLevel": "Advanced",
        "registrationStatus": true,
        "registrationDeadline": "2023-10-21T12:00:00.000Z",
        "contestLink": "https://codeforces.com/contests/1235",
        "contestType": "individual",
        "status": "upcoming"
      }
    },
    "message": "Contest updated successfully",
    "success": true
  }
  ```

### Delete Contest (Admin Only)

- **URL**: `/contests/:id`
- **Method**: `DELETE`
- **Authentication**: Admin only
- **Description**: Delete a contest
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Contest deleted successfully",
    "success": true
  }
  ```

### Register for Contest

- **URL**: `/contests/:id/register`
- **Method**: `POST`
- **Authentication**: Required
- **Description**: Register the current user for a contest
- **Request Body**: (For team contests only)
  ```json
  {
    "teamName": "Code Masters",
    "teamMembers": ["614c5b68e987f321d8e9a4b2", "614c5b92e987f321d8e9a4b3"]
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Registered for contest successfully",
    "success": true
  }
  ```

### Add Contest Results (Admin Only)

- **URL**: `/contests/:id/results`
- **Method**: `POST`
- **Authentication**: Admin only
- **Description**: Add results for a completed contest
- **Request Body**:
  ```json
  {
    "problems": [
      {
        "name": "Problem A",
        "id": "A",
        "difficulty": "Easy"
      },
      {
        "name": "Problem B",
        "id": "B",
        "difficulty": "Medium"
      }
      // More problems...
    ],
    "standings": [
      {
        "user": "614c5b68e987f321d8e9a4b2",
        "rank": 1,
        "score": 200,
        "problemResults": [
          {
            "problemId": "A",
            "verdict": "Accepted",
            "points": 100,
            "time": 15
          },
          {
            "problemId": "B",
            "verdict": "Accepted",
            "points": 100,
            "time": 45
          }
        ]
      }
      // More participant results...
    ]
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "contest": {
        "_id": "614c6a920f7e2b3d45c61a8b",
        "title": "Updated Weekly Contest",
        "status": "completed",
        "resultsData": {
          "problems": [
            {
              "name": "Problem A",
              "id": "A",
              "difficulty": "Easy"
            },
            {
              "name": "Problem B",
              "id": "B",
              "difficulty": "Medium"
            }
          ],
          "standings": [
            {
              "user": "614c5b68e987f321d8e9a4b2",
              "rank": 1,
              "score": 200,
              "problemResults": [
                {
                  "problemId": "A",
                  "verdict": "Accepted",
                  "points": 100,
                  "time": 15
                },
                {
                  "problemId": "B",
                  "verdict": "Accepted",
                  "points": 100,
                  "time": 45
                }
              ]
            }
          ]
        }
      }
    },
    "message": "Contest results added successfully",
    "success": true
  }
  ```

## Resource Management

### Create Resource (Admin Only)

- **URL**: `/resources`
- **Method**: `POST`
- **Authentication**: Admin only
- **Description**: Create a new learning resource
- **Request Body**: FormData with the following fields
  ```
  title: "Complete Guide to Graph Algorithms"
  category: "algorithm"  // Options: "algorithm", "data_structure", "math", "programming_language", "competitive_programming", "miscellaneous"
  level: "intermediate"  // Options: "beginner", "intermediate", "advanced"
  tags: ["graphs", "algorithms", "dfs", "bfs"]
  content: "This guide covers graph traversal algorithms..."
  externalLinks: [
    {"title": "Visualizing BFS", "url": "https://example.com/bfs-visualization"}
  ]
  file: <file>  // Optional file upload
  ```
- **Response**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "resource": {
        "_id": "614c7239d8b2e94a31f0c7d6",
        "title": "Complete Guide to Graph Algorithms",
        "category": "algorithm",
        "level": "intermediate",
        "tags": ["graphs", "algorithms", "dfs", "bfs"],
        "content": "This guide covers graph traversal algorithms...",
        "externalLinks": [
          {
            "title": "Visualizing BFS",
            "url": "https://example.com/bfs-visualization"
          }
        ],
        "author": {
          "_id": "614c5b68e987f321d8e9a4b2",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "file": "/uploads/resources/file-123456.pdf",
        "createdAt": "2023-09-23T17:05:45.781Z",
        "updatedAt": "2023-09-23T17:05:45.781Z"
      }
    },
    "message": "Resource created successfully",
    "success": true
  }
  ```

### Get All Resources

- **URL**: `/resources`
- **Method**: `GET`
- **Authentication**: None
- **Description**: Get resources with pagination and filters
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
  - `category`: Filter by category
  - `level`: Filter by difficulty level
  - `tag`: Filter by tag
  - `search`: Search in title, content or tags
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "resources": [
        {
          "_id": "614c7239d8b2e94a31f0c7d6",
          "title": "Complete Guide to Graph Algorithms",
          "category": "algorithm",
          "level": "intermediate",
          "tags": ["graphs", "algorithms", "dfs", "bfs"],
          "content": "This guide covers graph traversal algorithms...",
          "externalLinks": [
            {
              "title": "Visualizing BFS",
              "url": "https://example.com/bfs-visualization"
            }
          ],
          "author": {
            "_id": "614c5b68e987f321d8e9a4b2",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "file": "/uploads/resources/file-123456.pdf"
        }
        // More resources...
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalResources": 25,
        "totalPages": 3
      },
      "metadata": {
        "categories": [
          "algorithm",
          "data_structure",
          "math",
          "programming_language",
          "competitive_programming",
          "miscellaneous"
        ],
        "levels": ["beginner", "intermediate", "advanced"]
      }
    },
    "message": "Resources fetched successfully",
    "success": true
  }
  ```

### Get Resource Details

- **URL**: `/resources/:id`
- **Method**: `GET`
- **Authentication**: None
- **Description**: Get details of a specific resource
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "resource": {
        "_id": "614c7239d8b2e94a31f0c7d6",
        "title": "Complete Guide to Graph Algorithms",
        "category": "algorithm",
        "level": "intermediate",
        "tags": ["graphs", "algorithms", "dfs", "bfs"],
        "content": "This guide covers graph traversal algorithms...",
        "externalLinks": [
          {
            "title": "Visualizing BFS",
            "url": "https://example.com/bfs-visualization"
          }
        ],
        "author": {
          "_id": "614c5b68e987f321d8e9a4b2",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "file": "/uploads/resources/file-123456.pdf",
        "createdAt": "2023-09-23T17:05:45.781Z",
        "updatedAt": "2023-09-23T17:05:45.781Z"
      }
    },
    "message": "Resource fetched successfully",
    "success": true
  }
  ```

### Update Resource (Admin Only)

- **URL**: `/resources/:id`
- **Method**: `PUT`
- **Authentication**: Admin only
- **Description**: Update an existing resource
- **Request Body**: FormData with the following fields
  ```
  title: "Updated Guide to Graph Algorithms"
  category: "algorithm"
  level: "advanced"
  tags: ["graphs", "algorithms", "dfs", "bfs", "dijkstra", "a-star"]
  content: "Updated content covering more advanced topics..."
  externalLinks: [
    {"title": "Visualizing BFS", "url": "https://example.com/bfs-visualization"},
    {"title": "Interactive Dijkstra", "url": "https://example.com/dijkstra"}
  ]
  file: <file>  // Optional file upload
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "resource": {
        "_id": "614c7239d8b2e94a31f0c7d6",
        "title": "Updated Guide to Graph Algorithms",
        "category": "algorithm",
        "level": "advanced",
        "tags": ["graphs", "algorithms", "dfs", "bfs", "dijkstra", "a-star"],
        "content": "Updated content covering more advanced topics...",
        "externalLinks": [
          {
            "title": "Visualizing BFS",
            "url": "https://example.com/bfs-visualization"
          },
          {
            "title": "Interactive Dijkstra",
            "url": "https://example.com/dijkstra"
          }
        ],
        "author": {
          "_id": "614c5b68e987f321d8e9a4b2",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "file": "/uploads/resources/file-789012.pdf"
      }
    },
    "message": "Resource updated successfully",
    "success": true
  }
  ```

### Delete Resource (Admin Only)

- **URL**: `/resources/:id`
- **Method**: `DELETE`
- **Authentication**: Admin only
- **Description**: Delete a resource
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Resource deleted successfully",
    "success": true
  }
  ```

## Codeforces Integration

The API provides integration with the Codeforces platform to display user and problem data.

### Get Organization Leaderboard

- **URL**: `/codeforces/leaderboard`
- **Method**: `GET`
- **Authentication**: None
- **Description**: Get leaderboard data for organization members (e.g., jkkniu)
- **Query Parameters**:
  - `organization`: Organization name (default: "jkkniu")
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "handle": "CuriousLearner",
        "rating": 1842,
        "maxRating": 1950,
        "rank": "expert",
        "organization": "jkkniu",
        "contestCount": 25
      },
      {
        "handle": "tamjid",
        "rating": 1560,
        "maxRating": 1602,
        "rank": "specialist",
        "organization": "jkkniu",
        "contestCount": 18
      }
      // More users...
    ],
    "message": "Organization leaderboard fetched successfully",
    "success": true
  }
  ```

### Get User Dashboard Data

- **URL**: `/codeforces/user/:handle`
- **Method**: `GET`
- **Authentication**: None
- **Description**: Get comprehensive dashboard data for a specific Codeforces user
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "userInfo": {
        "handle": "tamjid",
        "rating": 1560,
        "maxRating": 1602,
        "rank": "specialist",
        "titlePhoto": "https://userpic.codeforces.org/no-title.jpg",
        "contribution": 15
      },
      "problemStats": {
        "totalSolved": 387,
        "lastWeekSolved": 12
      },
      "contestStats": {
        "totalParticipated": 18
      },
      "ratingHistory": [
        {
          "contestId": 1852,
          "contestName": "Codeforces Round #888 (Div. 3)",
          "date": "2023-08-20",
          "rank": 1250,
          "oldRating": 1520,
          "newRating": 1560
        }
        // More rating history entries...
      ],
      "recentContests": [
        {
          "contestId": 1852,
          "contestName": "Codeforces Round #888 (Div. 3)",
          "date": "2023-08-20",
          "rank": 1250,
          "oldRating": 1520,
          "newRating": 1560,
          "ratingChange": 40
        },
        {
          "contestId": 1836,
          "contestName": "Codeforces Round #881 (Div. 3)",
          "date": "2023-06-18",
          "rank": 2105,
          "oldRating": 1602,
          "newRating": 1520,
          "ratingChange": -82
        }
        // More recent contest entries (typically last 5)...
      ]
    },
    "message": "User dashboard data fetched successfully",
    "success": true
  }
  ```

### Get Problem Distribution Data

- **URL**: `/codeforces/problems/distribution`
- **Method**: `GET`
- **Authentication**: None
- **Description**: Get problem distribution data for visualization (bar charts)
- **Query Parameters**:
  - `index`: Filter by problem index (A, B, C, D, ..., N)
  - `contestType`: Filter by contest type (All Types, Div. 1, Div. 2, Div. 3, Div. 4, etc.)
  - `timing`: Filter by time period (Last Week, Last Month, Last 3 Months, etc.)
- **Response**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "ratingDistribution": {
        "800": 245,
        "900": 220,
        "1000": 198,
        "1100": 187,
        "1200": 165,
        // More rating ranges...
        "3500": 5
      },
      "indexDistribution": {
        "A": 425,
        "B": 410,
        "C": 390,
        "D": 320,
        "E": 280,
        // More indices...
        "N": 15
      },
      "totalProblems": 2850
    },
    "message": "Problem distribution data fetched successfully",
    "success": true
  }
  ```

## Error Handling

All API endpoints use standardized error responses:

```json
{
  "status": "error",
  "message": "Error message here",
  "errors": ["Detailed error explanation"],
  "stack": "Stack trace (in development mode only)"
}
```

Common HTTP status codes:

- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `409` - Conflict (resource already exists)
- `500` - Internal Server Error

## File Upload

Certain endpoints accept file uploads. Use multipart/form-data for these requests:

### Supported File Types

- **Images**: For user avatars, member photos, blog images, event images, contest images

  - Allowed formats: jpg, jpeg, png, gif
  - Max size: 5MB

- **Documents**: For resources
  - Allowed formats: pdf, doc, docx, ppt, pptx, txt, md, and image formats
  - Max size: 5MB

### File Storage Structure

Files are stored in the following directory structure:

```
/public/uploads/
  ├── images/
  │   ├── users/        - User avatars
  │   ├── members/      - Member profile photos
  │   ├── blogs/        - Blog post images
  │   ├── events/       - Event images
  │   └── contests/     - Contest images
  └── resources/        - Resource files (PDFs, documents, etc.)
```

File URLs in API responses are relative paths that should be appended to your base server URL.

## Backend File Structure

The backend codebase follows a modular architecture with clear separation of concerns. Below is the directory structure of the backend application:

```
/Backend
  ├── package.json         - Project dependencies and scripts
  ├── .env                 - Environment variables (not in repository)
  ├── API_DOCUMENTATION.md - This documentation file
  ├── Readme.md            - Project overview and setup instructions
  ├── public/              - Static files served directly
  │   └── uploads/         - Uploaded files (images, documents)
  └── src/                 - Source code
      ├── app.js           - Express app configuration
      ├── server.js        - Server initialization
      ├── constants.js     - Application constants
      ├── controllers/     - Route handlers
      │   ├── user.controller.js
      │   ├── member.controller.js
      │   ├── blog.controller.js
      │   ├── event.controller.js
      │   ├── contest.controller.js
      │   ├── resource.controller.js
      │   └── codeforces.controller.js
      ├── db/              - Database connection and setup
      │   └── db.js
      ├── middlewares/     - Express middlewares
      │   ├── auth.middleware.js
      │   ├── error.middleware.js
      │   └── validators/  - Request validation
      │       ├── user.validator.js
      │       ├── member.validator.js
      │       ├── blog.validator.js
      │       ├── event.validator.js
      │       ├── contest.validator.js
      │       └── resource.validator.js
      ├── models/          - MongoDB schema definitions
      │   ├── user.model.js
      │   ├── member.model.js
      │   ├── blog.model.js
      │   ├── event.model.js
      │   ├── contest.model.js
      │   └── resource.model.js
      ├── routes/          - API route definitions
      │   ├── user.routes.js
      │   ├── member.routes.js
      │   ├── blog.routes.js
      │   ├── event.routes.js
      │   ├── contest.routes.js
      │   ├── resource.routes.js
      │   └── codeforces.routes.js
      ├── services/        - Business logic and external integrations
      │   └── codeforces.service.js
      └── utils/           - Shared utilities
          ├── ApiError.js
          ├── ApiResponse.js
          ├── asyncHandler.js
          └── fileUpload.js
```

### Key Components

1. **Controllers**: Handle HTTP requests, validate inputs, and return appropriate responses. They use services and models to perform business logic.

2. **Models**: Define MongoDB schemas and provide methods for data manipulation.

3. **Routes**: Define API endpoints and connect them to controllers.

4. **Middlewares**: Perform tasks like authentication, error handling, and request validation.

5. **Services**: Contain complex business logic and integrations with external systems like Codeforces API.

6. **Utils**: Shared utility functions and classes used across the application.

### Development Workflow

When adding new features:

1. Create or update the database model in `/src/models/`
2. Implement business logic in the appropriate controller in `/src/controllers/`
3. Define routes in `/src/routes/`
4. Add validation rules in `/src/middlewares/validators/`
5. For external integrations, create dedicated services in `/src/services/`
6. Update this documentation with new endpoints and request/response formats
