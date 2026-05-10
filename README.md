# Week 09 — Mongoose API

A small **Node.js** learning project: an **Express** REST API backed by **MongoDB** via **Mongoose**. It models a simple **users → posts** relationship (each post belongs to one user) and exposes CRUD-style endpoints under `/api`.

## Idea

The goal is to practice:

- Connecting Express to MongoDB with Mongoose.
- Defining **schemas** and **models** (`user`, `post`) with references (`post.userId` → `user`).
- Building route → controller → service layers for **users** and **posts**.
- Enforcing rules in the service layer (duplicate email, unique post content, **only the post owner** can update or delete a post).

The API returns JSON envelopes shaped like `{ success, message, data }` for most operations.

## Tech stack

| Piece        | Role                                      |
| ------------ | ----------------------------------------- |
| Node.js (ES modules) | `import` / `export`, `"type": "module"` |
| Express 5    | HTTP server and routing                   |
| Mongoose 9   | ODM for MongoDB                           |
| dotenv       | Loads `config/.env`                       |

## Prerequisites

- **Node.js** (v18+ recommended; project runs on current Node LTS).
- **MongoDB** reachable via URI (local install, Atlas, or Docker).

## Setup

1. **Clone** the repository and install dependencies:

   ```bash
   npm install
   ```

2. **Environment variables** — create `config/.env` (this path is gitignored). Example:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/your-db-name
   ```

   The app reads configuration from `config/env.service.js` (`PORT`, `MONGODB_URI`).

3. **Run in development** (uses `nodemon` if installed globally or add it as a devDependency):

   ```bash
   npm run dev
   ```

   The server listens on the configured `PORT` (see console log).

> **Note:** Ensure `nodemon` is available (`npm install -D nodemon` if `npm run dev` fails). You can also run `node src/main.js` directly.

## Project layout

```
├── config/
│   └── env.service.js          # dotenv + exported env object
├── src/
│   ├── main.js                 # entry: calls bootstrap()
│   ├── app.controller.js       # Express app, middleware, routes mount
│   ├── database/
│   │   └── connection.js       # mongoose.connect
│   ├── models/
│   │   ├── user.model.js
│   │   └── post.model.js
│   └── modules/
│       ├── user/
│       │   ├── user.route.js
│       │   ├── user.controller.js
│       │   └── user.service.js
│       └── post/
│           ├── post.route.js
│           ├── post.controller.js
│           └── post.service.js
├── package.json
└── README.md
```

## API overview

Base URL for resources: **`/api`**.

Health check (no `/api` prefix):

| Method | Path             | Description        |
| ------ | ---------------- | ------------------ |
| GET    | `/getHealthApp`  | Plain text “alive” response |

### Users (`/api/user`)

| Method | Path           | Description |
| ------ | -------------- | ----------- |
| GET    | `/api/user`    | List users (password omitted in responses). |
| GET    | `/api/user/:id`| Get one user by MongoDB `_id`. |
| POST   | `/api/user`    | Create user. Body: `userName`, `email`, `password`, `phone`. Rejects duplicate `email`. |
| PATCH  | `/api/user/:id`| Update user. Body: `userName`, `email`, `password`, `phone`. |
| DELETE | `/api/user/:id`| Delete user by id. |

### Posts (`/api/post`)

| Method | Path            | Description |
| ------ | --------------- | ----------- |
| GET    | `/api/post`     | List posts; `userId` is populated with user fields (password omitted). |
| GET    | `/api/post/:id` | Get one post by id (populated author). |
| POST   | `/api/post`     | Create post. Body: `title`, `content`, `userId`. `content` must be unique. `userId` must reference an existing user. |
| PATCH  | `/api/post/:id` | Update post. Body: `userId` (owner), optional `title`, `content`. Only the **owner** `userId` can update; content uniqueness is enforced vs other posts. |
| DELETE | `/api/post/:id` | Delete post. Body: `userId` (owner). Only the **owner** can delete. |

Send JSON with header `Content-Type: application/json` for POST/PATCH/DELETE bodies.

## Data model (high level)

**User**

- `userName`, `email` (unique), `password`, `phone`
- Timestamps: `createdAt`, `updatedAt`

**Post**

- `title`, `content` (unique across posts)
- `userId`: ObjectId reference to `user`
- Timestamps: `createdAt`, `updatedAt`

## Security note (learning context)

Passwords are stored and handled as plain strings in this exercise. For production you would hash passwords (e.g. bcrypt), use authentication (JWT/session), and avoid trusting `userId` from the body without verifying identity.

## License

ISC (see `package.json`).
