# SprintFlow - Project Management SaaS Backend API

**A robust, scalable, and secure REST API for managing projects, sprints, tasks, and team collaboration with real-time activity tracking and Stripe payment integration.**

---

##  **Project Overview**

SprintFlow is an enterprise-grade Project Management System built as a RESTful API. It enables organizations to manage projects, coordinate sprints, assign tasks, track progress, and handle payments seamlessly. The system supports three distinct roles (Admin, Manager, Member) with strict role-based access control.

### **Key Features**

 **User Authentication** - Email/Password registration + Google OAuth login  
 **Role-Based Access Control** - 3 roles with granular permissions  
 **Project Management** - Create, organize, and manage projects  
 **Sprint Planning** - Organize work into time-boxed sprints  
 **Task Management** - Full CRUD with status transitions and assignments  
 **Subtasks** - Break down tasks into smaller, manageable units  
 **Comments & Collaboration** - Task-level discussions  
 **Stripe Payment Integration** - Real payment processing with webhooks  
 **Input Validation** - Zod-based server-side validation  
 **Error Handling** - Structured JSON error responses  
 **Database Transactions** - Ensuring data consistency  
 **Soft Deletes** - Safe data deletion with recovery capability  

---

##  **Tech Stack**

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Language** | TypeScript | Type-safe development |
| **Framework** | Express.js 5.x | REST API framework |
| **Database** | PostgreSQL 14+ | Relational database |
| **ORM** | Prisma | Database ORM with migrations |
| **Validation** | Zod | Input validation schemas |
| **Authentication** | JWT + Google OAuth2 | Auth mechanism |
| **Payments** | Stripe | Payment processing |
| **Code Quality** | Biome | Linting & formatting |
| **Security** | Helmet, CORS | Security headers & protection |
| **Rate Limiting** | express-rate-limit | API abuse prevention |
| **Caching** | Redis | Performance optimization |

---

### **Key Tables**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **User** | System users | id, email, password, name, role, status |
| **Organization** | Company/team organization | id, name, description, status |
| **Project** | Projects within organizations | id, name, status, projectId |
| **Sprint** | Time-boxed sprints | id, name, status, startDate, endDate |
| **Task** | Work items | id, title, status, priority, assigneeId |
| **Subtask** | Task breakdowns | id, title, isDone, taskId |
| **Comment** | Task discussions | id, content, userId, taskId |
| **ActivityLog** | Audit trail | id, action, userId, details, timestamp |
| **Subscription** | Payment records | id, status, amount, stripeId |

---

##  **Authentication & Authorization**

### **Three Roles with Permissions**

```
┌─────────────────────────────────────────────────────────┐
│                    ROLES & PERMISSIONS                  │
├─────────────────────────────────────────────────────────┤
│ ADMIN                                                   │
│  • Create/delete organizations                          │
│  • Manage all users and permissions                     │
│  • View system-wide statistics                          │
│  • Access audit logs                                    │
│  • Manage subscriptions                                 │
├─────────────────────────────────────────────────────────┤
│ MANAGER                                                 │
│  • Create and manage projects                           │
│  • Create sprints and tasks                             │
│  • Assign tasks to team members                         │
│  • View project analytics                               │
│  • Manage team members                                  │
├─────────────────────────────────────────────────────────┤
│ MEMBER                                                  │
│  • View assigned tasks                                  │
│  • Update task status                                   │
│  • Add comments to tasks                                │
│  • View project information                             │
│  • Create subtasks                                      │
└─────────────────────────────────────────────────────────┘
```

### **Authentication Flow**

1. **Register** → User creates account with email/password
2. **Login** → User receives JWT access + refresh tokens
3. **Authenticate** → Client sends Bearer token in Authorization header
4. **Verify** → Middleware validates token and role
5. **Authorize** → Route handler checks role permissions
6. **Refresh** → Expired access token refreshed using refresh token

---

##  **API ENDPOINTS (37+ Total)**

### ** Authentication (6 Endpoints)**

#### Register User
```
POST /api/v1/auth/register

```

#### Login User
```
POST /api/v1/auth/login

```

#### Get Current User
```
GET /api/v1/auth/me

```

#### Refresh Token
```
POST /api/v1/auth/refresh-token

```

#### Google OAuth Login
```
POST /api/v1/auth/google

```

#### Logout
```
POST /api/v1/auth/logout

```

---

### ** Project Management (5 Endpoints)**

#### Create Project
```
POST /api/v1/projects

```

#### Get All Projects
```
GET /api/v1/projects?page=1&limit=10&status=ACTIVE

```

#### Get Single Project
```
GET /api/v1/projects/:id

```

#### Update Project
```
PATCH /api/v1/projects/:id

```

#### Delete Project (Soft Delete)
```
DELETE /api/v1/projects/:id

```

---

### ** Sprint Management (3 Endpoints)**

#### Create Sprint
```
POST /api/v1/sprints

```

#### Get Sprints by Project
```
GET /api/v1/sprints/project/:projectId

```

#### Update Sprint Status
```
PATCH /api/v1/sprints/:id/status

```

---

### ** Task Management (9 Endpoints)**

#### Create Task
```
POST /api/v1/tasks

```

#### Get All Tasks
```
GET /api/v1/tasks?page=1&limit=10&status=TODO&priority=HIGH

```

#### Get My Assigned Tasks
```
GET /api/v1/tasks/my-assigned

```

#### Get Single Task
```
GET /api/v1/tasks/:id

```

#### Update Task
```
PATCH /api/v1/tasks/:id

```

#### Update Task Status
```
PATCH /api/v1/tasks/:id/status

```

#### Assign Task
```
POST /api/v1/tasks/:id/assign

```

#### Unassign Task
```
POST /api/v1/tasks/:id/unassign

```

#### Delete Task (Soft Delete)
```
DELETE /api/v1/tasks/:id

```

---

### ** Subtask Management (4 Endpoints)**

#### Create Subtask
```
POST /api/v1/subtasks

```

#### Get Subtasks by Task
```
GET /api/v1/subtasks/task/:taskId

```

#### Toggle Subtask
```
PATCH /api/v1/subtasks/:id/toggle

```

#### Delete Subtask
```
DELETE /api/v1/subtasks/:id

```

---

### ** Comment Management (2 Endpoints)**

#### Add Comment
```
POST /api/v1/comments

```

#### Get Task Comments
```
GET /api/v1/comments/task/:taskId

```

---

### ** Payment Integration (3 Endpoints)**

#### Initiate Payment
```
POST /api/v1/payments/initiate

```

#### Confirm Payment
```
POST /api/v1/payments/confirm

```

#### Get Payment Status
```
GET /api/v1/payments/:id

```

---

### ** User Management (5 Endpoints)**

#### Get My Profile
```
GET /api/v1/users/me

```

#### Update My Profile
```
PATCH /api/v1/users/me

```

#### Get All Users (Admin/Manager)
```
GET /api/v1/users?page=1&limit=10

```

#### Update User Role (Admin)
```
PATCH /api/v1/users/:id/role

```

#### Get Admin Dashboard Stats (Admin)
```
GET /api/v1/users/admin/stats

```

---

##  **Security Features**

 **Password Hashing** - bcryptjs with 10 salt rounds  
 **JWT Authentication** - Secure token-based authentication  
 **Role-Based Authorization** - Middleware-enforced permissions  
 **Rate Limiting** - 100 requests per 15 minutes per IP  
 **CORS Configuration** - Whitelist trusted domains  
 **Security Headers** - Helmet.js for security headers  
 **Input Validation** - Zod schema validation on all inputs  
 **SQL Injection Prevention** - Prisma parameterized queries  
 **Soft Deletes** - Data recovery capability  
 **Activity Logging** - Comprehensive audit trail  

---

##  **Error Handling & Validation**

### **Error Response Format**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```


##  **Database Features**

 **Relationships** - Proper foreign key constraints  
 **Indexing** - Indexes on frequently queried fields  
 **Transactions** - ACID compliance for data operations  
 **Migrations** - Prisma migrations for schema versioning  
 **Constraints** - Unique, not-null, check constraints  
 **Cascading** - Cascade delete for related records  
 **Soft Deletes** - Timestamp-based soft deletes  
 **Activity Logs** - Complete audit trail  

---

##  **Getting Started**

### **Prerequisites**
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### **Installation**

```bash
# Clone repository
git clone https://github.com/hasan-soft/sprintflow-backend.git
cd sprintflow-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma migrate dev
npx prisma generate

# Run development server
npm run dev
```

### **Environment Variables**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sprintflow_db
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_key
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=5000
```

---

##  **Demo Credentials**

```
Email: admin@example.com
Password: Admin@123456
Role: ADMIN
```

---

##  **Live API**

**Note:** Live URL will be provided on Vercel/Render deployment

Example:
```
https://sprintflow-backend.vercel.app
```

---


##  **Project Structure**

```
src/
├── app/
│   ├── config/          # Configuration
│   ├── middleware/      # Express middleware
│   ├── module/          # Feature modules
│   │   ├── auth/        # Authentication
│   │   ├── user/        # User management
│   │   ├── project/     # Projects
│   │   ├── sprint/      # Sprints
│   │   ├── task/        # Tasks
│   │   ├── subtask/     # Subtasks
│   │   ├── comment/     # Comments
│   │   └── payment/     # Payments
│   └── utils/           # Utility functions
├── generated/           # Prisma generated files
├── lib/                 # Library files
├── app.ts               # Express app setup
└── server.ts            # Server entry point

prisma/
├── schema/              # Database schema
└── migrations/          # Database migrations
```

---

##  ** Links **

```
Project Name: 

Backend Repo: 

Live API: 

API Docs: 


Admin Email: 

Admin Password: 
```

---

##  **Requirements Compliance**

| Requirement | Status | Details |
|-------------|--------|---------|
| Minimum 20 APIs |  Complete | 37+ endpoints implemented |
| 3 Distinct Roles |  Complete | Admin, Manager, Member |
| JWT + Google OAuth |  Complete | Both implemented |
| Payment Integration |  Complete | Stripe with webhooks |
| Database Design |  Complete | PostgreSQL + Prisma |
| Input Validation |  Complete | Zod schemas |
| Error Handling |  Complete | Structured responses |
| Soft Deletes |  Complete | Timestamp-based |
| Activity Logging |  Complete | Comprehensive audit trail |
| Git Commits |  Complete | 22+ meaningful commits |
| Deployment |  Ready | Vercel/Render configured |
| Documentation |  Complete | This README |

---

##  **Key Learnings & Design Decisions**

### **Modular Architecture**
Each feature is organized in its own module with controller, service, route, and validation layers for maintainability.

### **Database Transactions**
Critical operations use Prisma transactions to ensure data consistency and prevent race conditions.

### **Activity Logging**
Every significant action is logged in the ActivityLog table for comprehensive audit trails.

### **Soft Deletes**
Records are marked as deleted using `isDeleted` flag and `deletedAt` timestamp for data recovery.

### **Role-Based Access Control**
Middleware enforces strict role-based authorization on all protected endpoints.

### **Input Validation**
Zod schemas validate all inputs at the API layer before processing.

---

## **Support & Documentation**

For detailed API testing, import the Postman collection and follow the documented examples for each endpoint.

---