# Task Tracker

A full-stack task management application built with React, Node.js/Express, and SQLite. Create, update, delete, and manage tasks with due dates and priorities. Tasks that are overdue are highlighted automatically.

## Features

- ✅ Create, read, update, and delete tasks
- 📅 Set due dates for tasks
- 🎯 Set task priorities (Low, Medium, High)
- ⚠️ Automatic overdue highlighting
- ✔️ Mark tasks as complete
- 📱 Responsive design
- 💾 SQLite database
- 🎨 Beautiful UI with Tailwind-inspired styling

## Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Styling**: CSS3

## Project Structure

```
task-tracker/
├── server.js                 # Express server & API endpoints
├── package.json             # Backend dependencies
├── tasks.db                 # SQLite database (generated)
└── client/
    ├── package.json         # Frontend dependencies
    ├── vite.config.js       # Vite configuration
    ├── index.html           # HTML entry point
    └── src/
        ├── main.jsx         # React entry point
        ├── App.jsx          # Main app component
        ├── App.css          # App styles
        └── components/
            ├── TaskForm.jsx
            ├── TaskForm.css
            ├── TaskList.jsx
            ├── TaskList.css
            ├── TaskCard.jsx
            └── TaskCard.css
```

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Sdeshp84/task-tracker.git
cd task-tracker

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Development Mode

Run both backend and frontend simultaneously:

```bash
# Terminal 1 - Start the backend server
npm run dev

# Terminal 2 - Start the frontend dev server (from client directory)
cd client
npm run dev
```

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173` (Vite default)

### 3. Build for Production

```bash
# Build the frontend
npm run build

# This builds the React app to client/dist
```

### 4. Production Server

```bash
# The Express server will serve the built frontend automatically
npm start
```

Visit `http://localhost:3001` in your browser.

## API Endpoints

### Tasks

- **GET** `/api/tasks` - Get all tasks
- **GET** `/api/tasks/:id` - Get a single task
- **POST** `/api/tasks` - Create a new task
- **PUT** `/api/tasks/:id` - Update a task
- **DELETE** `/api/tasks/:id` - Delete a task

### Request/Response Examples

**Create Task:**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task tracker app",
    "dueDate": "2024-12-31",
    "priority": "high"
  }'
```

**Response:**
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the task tracker app",
  "dueDate": "2024-12-31",
  "priority": "high",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Database Schema

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  dueDate TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
)
```

## Deployment to Cloudflare

### Option 1: Cloudflare Pages (Frontend Only)

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Connect your GitHub repo to Cloudflare Pages
3. Set build command: `npm run build`
4. Set publish directory: `client/dist`

### Option 2: Cloudflare Workers (Full Stack)

For a full-stack deployment with serverless functions, you'll need to adapt the Express app to use Cloudflare Workers format.

### Option 3: Traditional Hosting + Cloudflare Proxy

1. Deploy to traditional hosting (Heroku, Railway, Render, etc.)
2. Use Cloudflare as a DNS proxy for performance and security

## Usage

1. **Create a Task**: Fill in the form on the left with task details and click "Add Task"
2. **View Tasks**: Active tasks appear on the right, organized by status
3. **Edit a Task**: Click the edit icon on any task card to modify it
4. **Complete a Task**: Click the circle icon to mark a task as complete
5. **Delete a Task**: Click the trash icon to remove a task
6. **Due Dates**: Tasks with past due dates are highlighted in red

## Features Details

### Overdue Detection
Tasks are automatically marked as overdue if the due date has passed and the task is still pending. They appear with a red highlight and pulsing animation.

### Priority Levels
- **High** (Red): Urgent tasks
- **Medium** (Orange): Standard tasks
- **Low** (Green): Non-urgent tasks

### Task States
- **Pending**: Active tasks to be completed
- **Completed**: Finished tasks with visual distinction

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: Full responsive support

## Future Enhancements

- [ ] User authentication
- [ ] Task categories/tags
- [ ] Recurring tasks
- [ ] Task reminders/notifications
- [ ] Dark mode
- [ ] Drag and drop reordering
- [ ] Subtasks
- [ ] Task sharing

## License

MIT

## Author

Created with ❤️ for task management enthusiasts
