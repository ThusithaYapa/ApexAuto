# Apex Auto Mods – Backend API

Node.js + Express backend with MongoDB for Apex Auto Mods Garage.

## Setup

1. **Install dependencies**
   ```bash
   cd back-end
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`
   - Set `MONGODB_URI` (e.g. `mongodb://localhost:27017/apex-auto-mods`)
   - Set `JWT_SECRET` (strong random string for production)

3. **Run MongoDB** (local or Atlas), then start the server:
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:4000` (or `PORT` from `.env`).

4. **Seed services** (optional):
   ```bash
   npm run seed
   ```

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register (body: `name`, `email`, `password`) |
| POST | `/auth/login` | Login (body: `email`, `password`) – returns JWT |
| GET | `/auth/profile` | Get current user (header: `Authorization: Bearer <token>`) |

### Customization
| Method | Path | Description |
|--------|------|-------------|
| GET | `/services` | List all modification services |
| POST | `/builds` | Save a build (auth; body: `carModel`, `color`, `selectedParts`) |
| GET | `/builds/:userId` | Get saved builds for user (auth; own userId only) |

## Collections (MongoDB)

- **users**: `name`, `email`, `passwordHash` (bcrypt)
- **services**: `name`, `description`, `price`
- **builds**: `userId`, `carModel`, `color`, `selectedParts`, `createdAt`

Authentication: JWT in `Authorization: Bearer <token>`.
