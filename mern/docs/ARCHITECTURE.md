# Rocket Elevators Admin Dashboard - Architecture Documentation

## Project Overview
This is a full-stack MERN (MongoDB, Express, React, Node.js) application that serves as an admin dashboard for managing Rocket Elevators sales agents, transactions, and generating performance reports.

---

## Directory Structure

```
mern/
├── server/                 # Node.js backend API server
│   ├── config.env         # Environment variables (not in git)
│   ├── server.js          # Express app entry point
│   ├── package.json       # Server dependencies
│   ├── db/
│   │   └── connection.js  # MongoDB connection setup
│   ├── models/            # Mongoose schemas
│   │   ├── User.js        # User/login model
│   │   ├── Agent.js       # Sales agent model
│   │   ├── Transaction.js # Transaction records model
│   │   └── Session.js     # Session token model
│   └── routes/            # API endpoints
│       ├── auth.js        # Authentication endpoints
│       ├── agent.js       # Agent CRUD endpoints
│       ├── transaction.js # Transaction endpoints
│       ├── report.js      # Analytics/reporting endpoints
│       ├── session.js     # Session management endpoints
│       └── record.js      # Legacy employee records endpoints
│
└── client/                # React frontend application
    ├── vite.config.js     # Vite build tool configuration
    ├── package.json       # Frontend dependencies
    ├── index.html         # HTML entry point
    ├── public/            # Static assets (served at root /)
    │   ├── index.html     # Static landing page
    │   └── assets/        # Images, fonts, CSS
    └── src/
        ├── main.jsx       # React app entry point with router
        ├── App.jsx        # Root app component with layout
        ├── index.css      # Global styles
        ├── components/    # React components
        │   ├── Home.jsx                # Dashboard landing page
        │   ├── Login.jsx               # Authentication form
        │   ├── Navbar.jsx              # Top navigation bar
        │   ├── RequireAuth.jsx         # Route protection
        │   ├── Unauthorized.jsx        # Access denied page
        │   ├── RecordList.jsx          # Agent list table
        │   ├── Record.jsx              # Agent form (create/edit)
        │   ├── Transaction.jsx         # Transaction management
        │   ├── Report.jsx              # Analytics dashboard
        │   ├── ToastContainer.jsx      # Notification system
        │   └── RocketElevatorsSection.jsx # Placeholder component
        ├── context/       # React Context for global state
        │   ├── AuthContext.jsx         # Authentication state
        │   └── ToastContext.jsx        # Notification state
        ├── hooks/         # Custom React hooks
        │   ├── useAuth.js              # Authentication hook
        │   └── useToast.js             # Notification hook
        ├── utils/         # Utility functions
        │   └── cookieUtils.js          # Cookie/session management
        └── styles/        # Component-specific stylesheets

```

---

## Technology Stack

### Backend
- **Node.js + Express**: HTTP server and API routing
- **MongoDB + Mongoose**: NoSQL database and ORM
- **JWT (jsonwebtoken)**: Token-based authentication
- **CORS**: Cross-origin request handling
- **UUID**: Unique session token generation

### Frontend
- **React 19**: UI component library
- **React Router**: Client-side routing
- **React Bootstrap**: UI component framework
- **Chart.js + react-chartjs-2**: Data visualization
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Prettier**: Code formatter
- **ESLint**: Code linting

---

## API Routes

### Authentication (`/auth`)
- `POST /auth/login` - Authenticate user, return JWT token

### Agent Management (`/agent`)
- `GET /agent` - Get all agents
- `GET /agent/:id` - Get single agent by ID
- `POST /agent` - Create new agent
- `PATCH /agent/:id` - Update agent
- `DELETE /agent/:id` - Delete agent

### Session Management (`/session`)
- `POST /session/:user_id` - Create session token
- `GET /session/validate_token` - Validate and get user from token

### Transactions (`/transaction`)
- `GET /transaction/transaction-data?page=X` - Get paginated transactions
- `POST /transaction` - Create new transaction

### Reports (`/report`)
- `GET /report/report-data` - Get chart data (bar chart by agent, line chart daily trends)

### Legacy Records (`/record`)
- `GET /record` - Get all employee records
- `GET /record/:id` - Get single record
- `POST /record` - Create record
- `PATCH /record/:id` - Update record
- `DELETE /record/:id` - Delete record

---

## Authentication Flow

```
1. User visits /admin/login
2. enters credentials (email/password)
3. Login component sends POST to /auth/login
4. Backend validates and returns JWT token + user info
5. Frontend calls POST /session/:user_id to create session
6. Backend stores token in Session collection with TTL (24 hours)
7. Frontend saves token to cookies (secure, httponly-like)
8. Auth context stores user data in app state
9. Protected routes check RequireAuth guard
10. On subsequent visits, app validates token with /session/validate_token
11. Tokens auto-expire after 24 hours (MongoDB TTL index)
```

---

## Data Models

### User
```javascript
{
  first_name: String,
  last_name: String,
  email: String (unique),
  password: String // plaintext (should be hashed in production)
}
```

### Agent
```javascript
{
  first_name: String,
  last_name: String,
  region: String,
  rating: Number (0-100),
  fees: Number,
  sales: Number // updated when transactions are created
}
```

### Transaction
```javascript
{
  amount: Number (min: 0.01),
  agent_id: ObjectId (references Agent),
  createdAt: Date (auto-indexed for sorting)
}
```

### Session
```javascript
{
  session_token: String (UUID, unique),
  user_id: ObjectId (references User),
  createdAt: Date (expires after 24 hours via TTL)
}
```

---

## Key Features

### 1. **Protected Routes**
- All `/admin/*` routes require authentication
- `RequireAuth` component redirects to login if not authenticated
- Session validation on app startup

### 2. **Agent Management**
- View all agents in a sortable table
- Create new agents with form validation
- Edit existing agents
- Delete agents with confirmation modal

### 3. **Transaction Tracking**
- Create transactions linked to specific agents
- Automatic agent sales total updates
- Paginated transaction list (10 per page)
- Agent selection dropdown

### 4. **Reporting & Analytics**
- Bar chart: Total transaction amount by agent
- Line chart: Daily transaction trends (past 14 days)
- Real-time data aggregation from database

### 5. **Toast Notifications**
- Global notification system
- Auto-dismiss after 3 seconds
- Manual close button
- Success/Error/Warning/Info types

---

## Development Workflow

### Starting the Development Environment

**Backend:**
```bash
cd mern/server
npm install
npm run dev
# Runs on http://localhost:3000 (or configured PORT)
```

**Frontend:**
```bash
cd mern/client
npm install
npm run dev
# Runs on http://localhost:5173
# API requests proxied to http://localhost:3000
```

### Building for Production

**Client:**
```bash
cd mern/client
npm run build
# Creates optimized build in dist/ directory
# Served from /admin path in production
```

### Code Quality

**Format code:**
```bash
npm run format  # Uses Prettier
```

**Lint code:**
```bash
cd mern/client
npm run lint  # Uses ESLint
```

---

## Environment Variables

### Server (config.env)
```
ATLAS_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
PORT=3000
JWT_SECRET=your-secret-key
```

### Client (Vite proxying)
- Proxies all `/auth`, `/agent`, `/session`, `/transaction`, `/report` requests to backend
- No environment variables needed at build time

---

## Security Considerations

### Current Implementation
- JWT tokens for stateless authentication
- Session tokens with 24-hour expiration (MongoDB TTL)
- Secure cookies (marked as secure for HTTPS)
- CORS enabled for API endpoints
- Input validation on backend

### Production Improvements Needed
- Hash passwords before storing (bcrypt)
- Enable SSL/HTTPS
- Implement rate limiting
- Add CSRF protection
- Validate all user inputs
- Use httponly cookies
- Add SQL injection prevention

---

## Performance Optimizations

### Current
- Database indexes on frequently queried fields (createdAt)
- Paginated transaction list (10 items per page)
- MongoDB TTL index for automatic session cleanup

### Potential Improvements
- Add caching layer (Redis)
- Implement sorting on indexed fields
- Lazy load components
- Code splitting with React.lazy()
- Compress bundle with gzip

---

## Testing Recommendations

### Unit Tests
- Hook testing (useAuth, useToast)
- Component snapshot tests
- Route configuration tests

### Integration Tests
- Authentication flow (login → create session → validate)
- Agent CRUD operations
- Transaction creation and agent update
- Report data generation

### E2E Tests
- Complete user journeys (login → agent management → logout)
- Error state handling
- Form validation and submission

---

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Issues
- Verify ATLAS_URI in config.env
- Check IP whitelist in MongoDB Atlas
- Ensure cluster is active

### CORS Errors
- Verify backend is running on port specified in vite.config.js proxy
- Check proxy configuration

### Token Validation Failures
- Ensure session was created before validation
- Check token not expired (24 hour limit)
- Verify user_id exists in database

---

## Future Enhancements

1. **User Management**
   - Admin role management
   - User permissions/ACL
   - Activity logging

2. **Advanced Reporting**
   - Export to PDF/Excel
   - Custom date range selection
   - Performance benchmarking

3. **Real-time Features**
   - WebSocket for live transaction updates
   - Push notifications

4. **Mobile Support**
   - Responsive design improvements
   - Mobile app (React Native)

5. **Data Validation**
   - More comprehensive form validation
   - Server-side validation for all inputs
   - File upload capabilities

---

**Last Updated**: March 2026
**Project**: Rocket Elevators Admin Dashboard
**Stack**: MERN (MongoDB, Express, React, Node.js)
