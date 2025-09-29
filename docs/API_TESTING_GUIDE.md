# C.A.K.E API Testing Guide

## Overview

This guide provides a complete API testing workflow to ensure all M5.5 functionality is thoroughly validated, including Tasks, Clients, Users, and Feedback management.

## Testing Tools

### 1. Swagger UI
- **URL**: `http://localhost:3000/api-docs`
- **Purpose**: Interactive API documentation and testing

### 2. Postman Collection
- **File**: `docs/C.A.K.E_API_Collection.json`
- **Purpose**: Complete API test collection

### 3. Thunder Client (VS Code Extension)
- **Purpose**: Lightweight API testing tool

## Testing Workflow

### Step 1: Environment Setup

1. **Start Server**
   ```bash
   cd server
   npm start
   ```

2. **Verify Server Running**
   - Visit: `http://localhost:3000/healthz`
   - Expected response: `{"status":"OK","message":"C.A.K.E server is running"}`

### Step 2: Authentication Testing

#### 2.1 Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Test Manager",
  "email": "manager@test.com",
  "password": "password123",
  "role": "manager"
}
```

**Test Cases**:
- ✅ Successful registration
- ✅ Duplicate email error
- ✅ Missing required fields error
- ✅ Password length validation

#### 2.2 Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "manager@test.com",
  "password": "password123"
}
```

**Test Cases**:
- ✅ Successful login and token return
- ✅ Wrong password
- ✅ Non-existent user

#### 2.3 Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Step 3: Client Management Testing

#### 3.1 Create Client
```http
POST /clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Test Client",
  "contact": {
    "email": "client@test.com",
    "phone": "+1234567890",
    "address": "123 Test St"
  },
  "tier": "premium"
}
```

**Test Cases**:
- ✅ Successful client creation (Manager/Leader only)
- ✅ Missing required fields error
- ✅ Unauthorized access (Member role)
- ✅ Duplicate email validation
- ✅ No permission to create (different roles)

#### 3.2 Get Client List
```http
GET /clients?page=1&limit=10
Authorization: Bearer <token>
```

**Test Cases**:
- ✅ Successful list retrieval
- ✅ Pagination functionality
- ✅ Search functionality
- ✅ Role permission validation

#### 3.3 Update Client
```http
PUT /clients/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Client Name",
  "tier": "enterprise"
}
```

#### 3.4 Delete Client
```http
DELETE /clients/:id
Authorization: Bearer <token>
```

### Step 4: Task Management Testing

#### 4.1 Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Test Task",
  "description": "This is a test task",
  "clientId": "<client_id>",
  "assigneeIds": ["<user_id>"],
  "priority": "medium",
  "estimateHours": 8,
  "revenue": 1000
}
```

**Test Cases**:
- ✅ Successful task creation
- ✅ Missing required fields error
- ✅ Invalid clientId
- ✅ Role permission validation

#### 4.2 Get Task List
```http
GET /tasks?page=1&limit=10
Authorization: Bearer <token>
```

**Test Cases**:
- ✅ Successful list retrieval
- ✅ Pagination functionality
- ✅ Status filtering
- ✅ Priority filtering
- ✅ Client filtering
- ✅ Search functionality
- ✅ Role permission validation

#### 4.3 Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "actualHours": 4
}
```

**Test Cases**:
- ✅ Successful task update
- ✅ Status change automatically sets timestamps
- ✅ Permission validation (only creator/assigner/assignee can update)

#### 4.4 Get Task Statistics
```http
GET /tasks/stats/overview
Authorization: Bearer <token>
```

### Step 5: User Management Testing

#### 5.1 Get User List
```http
GET /users
Authorization: Bearer <token>
```

**Test Cases**:
- ✅ Only manager can access
- ✅ Other roles return 403

#### 5.2 Get Specific User
```http
GET /users/:id
Authorization: Bearer <token>
```

## RBAC Permission Testing

### Manager Permissions
- ✅ Can manage all users
- ✅ Can manage all clients
- ✅ Can manage all tasks
- ✅ Can assign tasks to anyone

### Leader Permissions
- ✅ Can view all tasks
- ✅ Can assign tasks
- ✅ Can change task priority
- ✅ Cannot manage users

### Member Permissions
- ✅ Can only view assigned tasks
- ✅ Can only update own task status
- ✅ Cannot assign tasks to others

## Data Validation Testing

### Required Fields Validation
- ✅ User registration missing required fields
- ✅ Client creation missing required fields
- ✅ Task creation missing required fields

### Data Format Validation
- ✅ Email format validation
- ✅ Password length validation
- ✅ Numeric field validation

### Business Logic Validation
- ✅ Task status change logic
- ✅ Automatic timestamp setting
- ✅ Related data integrity

## Error Handling Testing

### HTTP Status Codes
- ✅ 200: Success
- ✅ 201: Created successfully
- ✅ 400: Bad request
- ✅ 401: Unauthorized
- ✅ 403: Forbidden
- ✅ 404: Resource not found
- ✅ 500: Server error

### Error Messages
- ✅ Clear error descriptions
- ✅ Appropriate error codes
- ✅ Validation error details

## Performance Testing

### Basic Performance
- ✅ Response time < 500ms
- ✅ Pagination functionality normal
- ✅ Large data processing

### Concurrency Testing
- ✅ Multiple users simultaneous operations
- ✅ Data consistency

## Testing Checklist

### Authentication Features (M5.5 ✅)
- [x] User registration with validation
- [x] User login with JWT tokens
- [x] Token validation middleware
- [x] Role-based permission checking

### Client Management (M5.5 ✅)
- [x] Create client (Manager/Leader only)
- [x] Get client list with pagination
- [x] Update client (Manager/Leader only)
- [x] Delete client (Manager/Leader only)
- [x] Search and filter functionality

### Task Management (M5.5 ✅)
- [x] Create task with auto-generated numbers
- [x] Get task list with filtering and sorting
- [x] Update task (Manager/Leader + Task Creator)
- [x] Delete task (Manager only)
- [x] Task statistics and analytics
- [x] Status management with RBAC

### User Management (M5.5 ✅)
- [x] Get user list (Manager only)
- [x] Get user details
- [x] Create user (Manager only)
- [x] Update user (Manager only)
- [x] Delete user (Manager only)
- [x] Role permission validation

### Feedback Management (M5.5 ✅)
- [x] Create feedback (Manager/Leader only)
- [x] Get feedback list with filtering
- [x] Update feedback (Manager/Leader only)
- [x] Delete feedback (Manager/Leader only)
- [x] Feedback types and priorities
- [x] Score validation (1-5)

### System Features (M5.5 ✅)
- [x] Health check endpoint
- [x] Comprehensive error handling
- [x] Data validation with Mongoose
- [x] RBAC permissions across all endpoints
- [x] API documentation with Swagger
- [x] Database seeding for development

## Test Report Template

### Test Results Summary
- **Total Test Cases**: XX
- **Passed**: XX
- **Failed**: XX
- **Success Rate**: XX%

### Issues Found
1. **Issue Description**
   - Severity: High/Medium/Low
   - Impact Scope: Functionality/Performance/Security
   - Suggested Fix: Specific recommendations

### Improvement Suggestions
1. **Functionality improvement suggestions**
2. **Performance optimization suggestions**
3. **Security suggestions**

## Next Steps

After completing API testing:
1. Fix discovered issues
2. Update API documentation
3. Proceed to M5 development
4. Or implement Basic UI/UX
