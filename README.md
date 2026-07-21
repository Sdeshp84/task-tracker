# Task Tracker - Cloudflare Full-Stack

A modern, serverless task management application deployed entirely on Cloudflare.

## 🏗️ Architecture

- **Frontend**: React 18 + Vite → Cloudflare Pages
- **Backend**: Cloudflare Workers (Serverless)
- **Database**: Cloudflare D1 (Serverless SQLite)
- **Hosting**: All on Cloudflare (single platform)

## ✨ Features

- ✅ Create, read, update, and delete tasks
- 📅 Set due dates for tasks
- 🎯 Set task priorities (Low, Medium, High)
- ⚠️ Automatic overdue highlighting
- ✔️ Mark tasks as complete
- 📱 Responsive design
- ⚡ Serverless (no servers to manage)
- 🚀 Auto-scaling
- 🔒 Built-in security

## 📁 Project Structure

```
task-tracker/
├── src/
│   └── index.js              # Cloudflare Workers backend
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── ...
│   ├── vite.config.js
│   └── package.json
├── wrangler.toml             # Cloudflare Workers config
├── schema.sql                # D1 database schema
├── package.json
└── README.md
```

## 🚀 Setup & Deployment

### Prerequisites
- Node.js 18+
- Cloudflare account (free tier works!)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
cd client
npm install
cd ..
```

### 2. Create Cloudflare D1 Database

```bash
# Create the database
wrangler d1 create task-tracker

# Copy the database_id from the output and update wrangler.toml
```

### 3. Initialize Database Schema

```bash
# Run the schema
wrangler d1 execute task-tracker --file schema.sql
```

### 4. Deploy

```bash
# Deploy everything at once
npm run deploy:all

# Or separately:
npm run build:client      # Build frontend
npm run deploy:worker     # Deploy backend
```

### 5. Update Cloudflare Pages

Your Pages project should point to the root repository. The build will:
1. Build the React frontend to `client/dist`
2. Deploy static files to Pages
3. Workers automatically handle `/api/*` routes

## 🔧 Configuration

### wrangler.toml
- Add your Cloudflare `account_id`
- Update D1 `database_id` after creation
- Customize environment variables as needed

### API Endpoints

All endpoints are served by Cloudflare Workers:

- **GET** `/api/tasks` - Get all tasks
- **GET** `/api/tasks/:id` - Get a single task
- **POST** `/api/tasks` - Create a new task
- **PUT** `/api/tasks/:id` - Update a task
- **DELETE** `/api/tasks/:id` - Delete a task

### Example Request

```bash
curl -X POST https://task-tracker.pages.dev/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task tracker app",
    "dueDate": "2024-12-31",
    "priority": "high"
  }'
```

## 🗄️ Database Schema

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

## 💻 Development

### Local Development

```bash
# Terminal 1: Start Workers in dev mode
npm run dev

# Terminal 2: Start client dev server
cd client
npm run dev
```

The frontend dev server proxies to `http://localhost:8787` for API calls.

### Testing

```bash
# Build client
npm run build:client

# Deploy to staging
wrangler deploy --env staging
```

## 📊 Monitoring

View your Cloudflare Workers analytics:
- Dashboard → Workers → task-tracker
- Real-time request logs
- Performance metrics
- Error tracking

## 🔒 Security

- CORS headers configured
- Input validation on backend
- SQL injection protection (parameterized queries)
- No sensitive data in frontend

## 💰 Costs

- **Cloudflare Pages**: Free (frontend)
- **Cloudflare Workers**: Free tier (1M requests/month)
- **D1 Database**: Free tier (3GB storage, unlimited reads/writes)

**Total Cost**: $0/month on free tier!

## 🚀 Production Deployment

```bash
# Deploy to production
wrangler deploy --env production

# Your app is live at: https://task-tracker.pages.dev
```

## 📝 Notes

- D1 provides built-in backups
- Auto-scaling handles traffic spikes
- Global CDN for fast response times
- No database migrations needed

## 🛠️ Troubleshooting

### API not responding
1. Check `wrangler.toml` has correct `database_id`
2. Verify D1 database exists: `wrangler d1 list`
3. Check Worker logs: `wrangler tail`

### Database schema errors
1. Reset and reinitialize: `wrangler d1 execute task-tracker --file schema.sql`
2. Check table exists: `wrangler d1 execute task-tracker --command "SELECT * FROM tasks LIMIT 1"`

### Pages not updating
1. Manually trigger redeploy in Cloudflare Pages dashboard
2. Check build logs for errors
3. Verify `client/dist` exists

## 📚 Resources

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [Pages Documentation](https://developers.cloudflare.com/pages/)
- [itty-router](https://github.com/kwhitley/itty-router)

## License

MIT

## Author

Created with ❤️ for serverless enthusiasts
