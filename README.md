# Getting Started

### Before installation
- Add the environment variables on this Privnote: https://privnote.com/TA35ojwc#zrXkntNtq to your .env file. These environment variables contain the credentials to connect to a Postgres database set up in Vercel

### Running the app locally.
From the project root (no need to enter backend or frontend separately), run:
- Run ```npm install``` to install all dependencies
- Then ```npm start``` to start both backend and frontend concurrently.
- If you want to run tests run ```npm test``

---

## Backend

### Technology Stack
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Validation**: Zod schema validation
- **Testing**: Jest with comprehensive unit tests
- **Error Handling**: Centralized error management with custom HttpError class

### Technical Decisions

**TypeScript**: Chosen for enterprise-grade type safety, enhanced developer experience with IntelliSense, and compile-time error detection. Enables better code maintainability and reduces runtime errors in production environments.

**PostgreSQL + Sequelize**: Migrated from JSON file storage to PostgreSQL for ACID compliance, concurrent access handling, and data integrity. Sequelize ORM provides type-safe database operations, migrations, and relationship management while abstracting SQL complexity.

**Zod Validation**: Selected for runtime type validation with compile-time TypeScript integration. Provides consistent validation schemas shared between frontend and backend, eliminating type mismatches and ensuring data integrity at API boundaries.

**Express.js**: Upgraded from server-json to Express for production-ready HTTP server capabilities, middleware ecosystem, and proper request/response handling. Enables structured routing, error handling, and scalability for enterprise applications.

### Architecture
```
src/
├── controllers/     # Business logic handlers
├── models/         # Sequelize data models
├── routes/         # API route definitions
├── middleware/     # Express middleware (validation, error handling)
├── validators/     # Zod validation schemas
├── utils/          # Utility functions
├── constants/      # Application constants
├── lib/           # Custom libraries (HttpError)
└── database/      # Database configuration
```

### Controllers

#### TaskController
Handles all task-related operations with comprehensive error handling:

- **`getAllTasks`**: Retrieves all tasks from database
- **`getTaskById`**: Fetches specific task by ID with 404 handling
- **`createTask`**: Creates new tasks with data validation
- **`updateTask`**: Updates existing tasks with partial data support
- **`deleteTask`**: Removes tasks with existence verification

Each controller method implements proper HTTP status codes and error responses.

### Validation System

**Zod Schema Validation**:
- **Input Validation**: All request bodies validated against Zod schemas
- **Type Safety**: Automatic TypeScript type inference from schemas
- **Custom Validators**: Date validation with business logic (due dates must be future)
- **Error Messages**: Detailed, user-friendly validation error messages

**Validation Middleware**:
- Centralized validation using `validate()` middleware
- Automatic error transformation to HttpError format
- Request body replacement with validated/transformed data

### Centralized Error Handling

**Error Management Architecture**:
- **Custom HttpError Class**: Extends Error with HTTP status codes
- **catchAsync Wrapper**: Automatically catches async errors and passes to error handler
- **Centralized Error Handler**: Single middleware for all error processing
- **Context-Aware Logging**: Errors logged with controller function names
- **Dual API Support**: Different error formats for legacy vs. new API versions

**Error Flow**:
1. Controllers throw HttpError instances
2. catchAsync wrapper catches async errors
3. Error handler processes and formats responses
4. Contextual logging for debugging

### Unit Testing

**Comprehensive Test Coverage**:
- **Controller Tests**: All CRUD operations with success/error scenarios
- **Middleware Tests**: Error handling, validation, and utility functions
- **Mock Strategy**: Database and external dependencies mocked
- **Test Structure**: Arrange-Act-Assert pattern with clear test descriptions

**Test Categories**:
- **Unit Tests**: Individual function testing with mocked dependencies
- **Integration Tests**: Full request/response cycle testing
- **Error Scenarios**: Comprehensive error condition coverage
- **Edge Cases**: Boundary conditions and invalid inputs

### API Endpoints

**Task Management**:
- `GET /api/v1/tasks` - Retrieve all tasks
- `GET /api/v1/tasks/:id` - Get specific task
- `POST /api/v1/tasks` - Create new task
- `PATCH /api/v1/tasks/:id` - Update existing task
- `DELETE /api/v1/tasks/:id` - Delete task

**Legacy Support**:
- All endpoints available at root level with deprecation warnings

### Database Schema

**Tasks Table**:
- `id`: Primary key (auto-increment)
- `created`: Creation timestamp (auto-generated)
- `title`: Task title (required, max 100 chars)
- `description`: Optional task description (max 2000 chars)
- `complete`: Boolean completion status (default: false)
- `due`: Due date (must be future date)

---

## Frontend

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Form Management**: React Hook Form with Zod validation
- **State Management**: Local component state with custom hooks

### Architecture
```
src/
├── components/
│   ├── forms/          # Form components with validation
│   ├── layouts/        # Layout components
│   ├── sections/       # Feature-specific components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── validators/        # Zod validation schemas
└── interfaces/        # TypeScript type definitions
```

### Key Components

#### TaskManager (Main Page)
- **State Management**: Centralized state for modals, selected tasks, and UI state
- **API Integration**: Direct fetch calls with proper error handling
- **User Feedback**: Toast notifications for all operations
- **Modal Management**: Coordinated modal state for create/update/delete operations

#### TaskForm
- **Form Validation**: React Hook Form with Zod resolver
- **Dual Mode**: Create and update modes with shared validation
- **Date Handling**: Proper datetime-local input formatting
- **Loading States**: Visual feedback during form submission

#### Custom Hooks
- **useFetchData**: Reusable data fetching with loading/error states

### Validation & Type Safety

**Frontend Validation**:
- **Shared Schemas**: Identical Zod schemas between frontend and backend
- **Form Integration**: React Hook Form with Zod resolver
- **Real-time Validation**: Immediate feedback on form errors
- **Type Inference**: Automatic TypeScript types from validation schemas
---

## Development Practices

### Code Quality
- **ESLint Configuration**: TypeScript rules with strict linting
- **Prettier Formatting**: Consistent code style across codebase
- **Comprehensive Documentation**: Inline documentation and README
- **Git Workflow**: Feature branch development with clear commit history

### Database Setup
```bash
# Run migrations
npx sequelize-cli db:migrate

# Seed data (optional)
npx sequelize-cli db:seed:all
```