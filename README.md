# RomifyAssignmentBackend

A Node.js + TypeScript backend for task and user management, using Express, PostgreSQL, and JWT authentication.

## Features

- User signup & login with JWT authentication
- Task CRUD operations (create, read, update, delete)
- Input validation with Joi
- Secure password hashing with bcrypt
- PostgreSQL database integration
- CORS support for frontend integration
- Environment-based configuration

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/AtharvaEdlawar/RomifyAssignmentBackend.git
   cd RomifyAssignmentBackend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env` and update with your PostgreSQL credentials and JWT secret.

4. **Set up the database:**
   - Create a PostgreSQL database and required tables (`users`, `tasks`).

5. **Run the server in development:**
   ```sh
   npm run dev
   ```

   The server will start on the port specified in `.env` (default: 4000).

### Build for Production

```sh
npm run build
node dist/server.js
```

## API Endpoints

### Auth

- `POST /task/login/signup` — User signup
- `POST /task/login` — User login

### Tasks

- `GET /task/` — Get all tasks (with pagination, search, user_id)
- `GET /task/:id` — Get task by ID
- `POST /task/` — Create a new task
- `PUT /task/:id` — Update a task
- `DELETE /task/:id` — Delete a task

## Project Structure

```
src/
  config/           # Database config
  controller/       # Route controllers
  routes/           # Express routes
  service/          # Business logic
  validation/       # Joi schemas
  server.ts         # App entry point
```

## Environment Variables

See `.env` for all required variables:

- `PORT`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `JWT_SECRET`
- `ALLOWED_ORIGINS`

## License

MIT

---