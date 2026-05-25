# OpenTask — Agent Operating System

An AI-powered engineering task management system where AI agents autonomously execute development tasks while humans stay in control of critical decisions.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Stack](https://img.shields.io/badge/stack-NestJS%20%2B%20Next.js-blue)
![DB](https://img.shields.io/badge/database-SQLite%20%2F%20PostgreSQL-lightgrey)

---

## What It Does

OpenTask closes the loop between task creation and delivery:

```
Create Task  →  Start Agent  →  Agent Executes  →  Request Human Approval  →  Task Completed
```

1. **Human creates a task** via the web UI
2. **AI agent picks it up**, transitions through planning → in_progress
3. **Agent runs autonomously** (powered by OpenCode / oh-my-openagent)
4. **Agent requests approval** when done — task enters `waiting_approval`
5. **Human reviews** in the Approvals Queue and approves or rejects
6. **Task is marked completed** — full audit trail preserved

---

## Architecture

```
web/        Next.js 14 App Router  (TypeScript, Tailwind, shadcn/ui, React Query)
api/        NestJS backend         (TypeScript, TypeORM, Socket.io, EventEmitter2)
```

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Backend   | NestJS, TypeORM, SQLite (PostgreSQL-ready)      |
| Realtime  | WebSocket via Socket.io (`/ws` namespace)       |
| Agent     | OpenCode SDK (stub mode for local dev)          |
| State     | Typed state machine with strict transition rules|

---

## Task State Machine

```
pending → planning → in_progress → waiting_approval → completed
                  ↘              ↘ blocked ↗         ↘ failed
```

Transitions are strictly validated — no illegal state jumps allowed.

---

## Quick Start

```bash
# Backend (SQLite, no infra needed)
cd api
npm install
npm run start:dev
# → http://localhost:3001

# Frontend
cd web
npm install
npm run dev
# → http://localhost:3000
```

### With PostgreSQL + Redis (optional)

```bash
docker-compose up postgres redis -d
# Set DATABASE_URL in api/.env
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/projects` | Create project |
| `GET`  | `/api/v1/projects` | List projects |
| `POST` | `/api/v1/tasks` | Create task |
| `GET`  | `/api/v1/tasks/:id` | Get task |
| `POST` | `/api/v1/agents/:taskId/start` | Start AI agent on task |
| `POST` | `/api/v1/approvals` | Request approval |
| `GET`  | `/api/v1/approvals` | List approvals |
| `POST` | `/api/v1/approvals/:id/approve` | Approve |
| `POST` | `/api/v1/approvals/:id/reject` | Reject |

---

## WebSocket Events

Connect to `ws://localhost:3001/ws` and subscribe with:
```js
socket.emit('subscribe:task', { taskId })
socket.on('event', (payload) => { ... })
```

Event types: `agent.started`, `agent.planning`, `agent.coding`, `agent.testing`, `agent.completed`, `approval.requested`, `approval.approved`, `task.status_changed`

---

## Project Structure

```
api/src/
├── agents/          Agent runner, OpenCode provider, stub simulator
├── approvals/       Approval request/review lifecycle
├── tasks/           Task CRUD + state machine
├── events/          Typed event bus + persistence
├── gateway/         WebSocket gateway (/ws namespace)
└── common/          Shared enums, interfaces, DTOs

web/src/
├── app/             Next.js App Router pages
│   ├── projects/    Project list + task board
│   ├── approvals/   Approval queue
│   └── dashboard/   Overview
├── hooks/           React Query data hooks
├── components/      UI components (shadcn/ui based)
└── lib/             API client, socket, types
```

---

## Environment Variables

### API (`api/.env`)
```env
DATABASE_URL=     # PostgreSQL URL (optional, falls back to SQLite)
OPENCODE_URL=     # OpenCode server URL (default: http://127.0.0.1:4096)
PORT=3001
```

### Web (`web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

---

## Development Notes

- **Stub mode**: When OpenCode is not running, the agent simulator fires a realistic 7-second event sequence (thinking → planning → coding → testing → completed) and auto-requests approval
- **SQLite default**: Zero-infra local dev. Switch to PostgreSQL by setting `DATABASE_URL`
- **Hot reload**: Both `api` and `web` support hot reload in dev mode

---

## License

MIT
