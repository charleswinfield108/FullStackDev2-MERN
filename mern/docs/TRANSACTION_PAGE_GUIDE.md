# Transaction Page Guide

## Overview

The Transaction page is a management interface that allows agents to create and view financial transactions. It provides a two-column layout with a transaction list on the left and a form to create new transactions on the right.

---

## Frontend Components

### Transaction.jsx
Located at: `mern/client/src/components/Transaction.jsx`

#### Key State Variables
- **formData**: Stores the current form input (amount and agent_id)
- **transactions**: Array of transaction records displayed in the table
- **agents**: List of available agents loaded from the database
- **currentPage**: Current page number for pagination
- **totalPages**: Total number of pages available
- **loading**: Boolean flag indicating if a transaction is being created
- **agentsLoading**: Boolean flag indicating if agents are being loaded
- **showConfirmModal**: Controls visibility of the confirmation modal
- **tentativeFormData**: Temporarily stores form data before confirmation

#### Component Features

##### 1. **Fetch Agents** (`fetchAgents`)
- Called on component mount and whenever the page changes
- Makes API request to `/agent` endpoint
- Loads all available agents to populate the dropdown menu
- Handles both array and wrapped response formats
- Shows error toast if loading fails

##### 2. **Fetch Transactions** (`fetchTransactions`)
- Retrieves paginated transaction data from `/transaction/transaction-data`
- Takes `page` parameter to fetch specific page
- Updates `transactions` and `totalPages` state
- Called on component mount and after creating a new transaction

##### 3. **Form Input Handling** (`handleInputChange`)
- Updates `formData` state as user types in form fields
- Supports amount and agent_id fields

##### 4. **Form Submission** (`handleSubmit`)
- Validates that both amount and agent_id are filled
- Ensures amount is a positive number
- Shows confirmation modal instead of immediately submitting
- Stores tentative data in `tentativeFormData` for review

##### 5. **Confirmation Modal**
- Modal appears before transaction is created
- Displays:
  - Selected agent name
  - Transaction amount
  - Confirmation message
- User can confirm or cancel
- Prevents accidental transaction creation

##### 6. **Confirm Handler** (`handleConfirm`)
- Sends POST request to `/transaction` endpoint with transaction data
- On success:
  - Shows success toast notification
  - Clears form data
  - Resets page to 1
  - Fetches updated transaction list
- On error:
  - Shows error toast with message from server
- Sets loading state during the request

##### 7. **Pagination**
- Displays page numbers based on `totalPages`
- Supports Previous/Next buttons
- Prev/Next buttons are disabled at boundaries
- Active page is highlighted
- Clicking a page number updates URL search params and fetches that page

##### 8. **Display Functions**
- **formatDate()**: Converts ISO date string to readable format
- **getAgentName()**: Finds agent name by agent_id
- **Display of agent relationships**: Shows agent names or "Inactive Agent" if agent was deleted

---

## Backend Implementation

### Transaction Model
Located at: `mern/server/models/Transaction.js`

```javascript
{
  amount: Number,           // Transaction amount (minimum 0.01)
  agent_id: ObjectId,       // Reference to Agent document
  createdAt: Date           // Timestamp (default: current time)
}
```

**Index**: Sorted by `createdAt` in descending order (newest first)

### Agent Model
Located at: `mern/server/models/Agent.js`

```javascript
{
  first_name: String,
  last_name: String,
  region: String,
  rating: Number,
  fees: Number,
  sales: Number             // Updated when transaction is created
}
```

**Important**: When a transaction is created, the agent's `sales` field is incremented by the transaction amount.

### API Routes
Located at: `mern/server/routes/transaction.js`

#### GET /transaction/transaction-data
**Purpose**: Retrieve paginated transactions

**Query Parameters**:
- `page` (optional, default: 1): Page number

**Response**:
```json
{
  "status": "ok",
  "data": [...transactions],
  "totalTransactions": 42,
  "totalPages": 5,
  "currentPage": 1,
  "message": "Transactions retrieved successfully"
}
```

**Details**:
- Returns 10 transactions per page
- Populates agent data (first_name, last_name)
- Sorts by date (newest first)
- Calculates total pages for pagination

#### POST /transaction
**Purpose**: Create a new transaction

**Request Body**:
```json
{
  "amount": 1500.50,
  "agent_id": "507f1f77bcf86cd799439011"
}
```

**Validation**:
- Both `amount` and `agent_id` are required
- Amount must be greater than 0
- Agent must exist in database

**Response (Success - 201)**:
```json
{
  "status": "ok",
  "data": {...transaction},
  "message": "Transaction created successfully"
}
```

**Response (Error - 400/404/500)**:
```json
{
  "status": "error",
  "data": null,
  "message": "Error description"
}
```

**Side Effects**:
- Creates a new Transaction document
- **Updates agent's sales**: `Agent.sales += amount`
- Returns the created transaction to frontend

---

## Data Flow Diagram

### Creating a Transaction

```
1. User fills form (amount + agent_id)
        ↓
2. User clicks "Create Transaction"
        ↓
3. Frontend validates inputs
        ↓
4. Confirmation modal displays
        ↓
5. User clicks "Confirm"
        ↓
6. POST /transaction (with amount & agent_id)
        ↓
7. Server validates data
        ↓
8. Server creates Transaction document
        ↓
9. Server updates Agent.sales
        ↓
10. Response returned to frontend (201)
        ↓
11. Frontend shows success toast
        ↓
12. Frontend clears form
        ↓
13. Frontend fetches updated transaction list
        ↓
14. Table displays new transaction at top
```

### Fetching Transactions

```
1. Component mounts OR page number changes
        ↓
2. GET /transaction/transaction-data?page=X
        ↓
3. Server retrieves X set of 10 transactions
        ↓
4. Server populates agent names
        ↓
5. Server sorts by date (newest first)
        ↓
6. Response with transactions + totalPages
        ↓
7. Frontend updates state
        ↓
8. Table renders transactions
        ↓
9. Pagination controls render based on totalPages
```

---

## Key Features

### 1. **Two-Column Layout**
- Left column: Recent Transactions list with pagination
- Right column: Form to create new transactions
- Responsive: Stacks on mobile, side-by-side on large screens

### 2. **Confirmation Modal**
- Prevents accidental transactions
- Displays transaction details before submission
- User explicitly confirms action

### 3. **Pagination**
- 10 transactions per page
- Shows page numbers, Previous/Next buttons
- Current page highlighted
- Buttons disabled at boundaries

### 4. **Validation**
- Both fields required
- Amount must be positive
- Agent must exist in database

### 5. **Error Handling**
- Toast notifications for errors
- Graceful handling of missing agents
- Displays "Inactive Agent" for deleted agents

### 6. **Loading States**
- Agents dropdown shows "Loading agents..." while fetching
- Submit button shows "Creating..." while processing
- Form fields disabled during submission

### 7. **Dynamic Agent Selection**
- Dropdown populated from agent list
- Shows both first and last name
- Handles case when no agents exist

### 8. **Agent Sales Update**
- When transaction is created, agent's sales total is automatically incremented
- Maintains relationship between transactions and agent performance

---

## Styling

### CSS File
Located at: `mern/client/src/components/Transaction.css`

Key styles:
- `.transaction-container`: Main container styling
- `.transaction-layout`: Two-column layout management
- `.transaction-list-section`: Left column styles
- `.transaction-form-section`: Right column styles
- `.form-card`: Form styling with borders and spacing

---

## User Workflow

### To Create a Transaction:
1. Navigate to Transaction page
2. Enter transaction amount in the "Amount" field
3. Select an agent from the dropdown
4. Click "Create Transaction" button
5. Review details in confirmation modal
6. Click "Confirm" to submit
7. Success toast appears
8. Form clears and transaction list updates

### To View Transactions:
1. Transaction page loads with most recent 10 transactions
2. Table shows: Agent Name, Amount, Date
3. Use pagination at bottom to navigate pages
4. Transactions sorted by date (newest first)

---

## Error Scenarios

| Error | Cause | User Message |
|-------|-------|--------------|
| Missing amount or agent | User didn't fill all fields | "Please fill in all fields" |
| Amount ≤ 0 | User entered zero or negative | "Amount must be a positive number" |
| Agent not found | Agent ID is invalid | "Agent not found" |
| Server error | Database or server issue | "Error creating transaction" |
| Agents load failed | Network or server issue | "Error loading agents" |
| Unexpected response | Different API response format | "Unexpected response format from agents" |

---

## Testing Checklist

- [ ] Can create transaction with valid amount and agent
- [ ] Confirmation modal appears before submission
- [ ] Form clears after successful submission
- [ ] New transaction appears at top of list
- [ ] Error toast shows when amount is negative
- [ ] Error toast shows when fields are empty
- [ ] Pagination works (Previous/Next/Page numbers)
- [ ] Agent dropdown populated correctly
- [ ] "Loading agents..." message appears during load
- [ ] Transaction list defaults to page 1 after creation
- [ ] Agent names display correctly in table
- [ ] "Inactive Agent" message shows for deleted agents
- [ ] Form fields disabled during submission
- [ ] Submit button shows "Creating..." while processing

---

## Postman Testing

### Create Transaction
```
POST http://localhost:5000/transaction

Body (JSON):
{
  "amount": 1500.50,
  "agent_id": "507f1f77bcf86cd799439011"
}
```

### Fetch Transactions
```
GET http://localhost:3000/transaction/transaction-data?page=1
```

### Fetch Specific Page
```
GET http://localhost:3000/transaction/transaction-data?page=2
```
