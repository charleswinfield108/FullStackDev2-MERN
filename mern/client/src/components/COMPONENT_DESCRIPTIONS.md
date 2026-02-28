# React Components Documentation

## Login.jsx
An admin authentication component that handles user login for the Agent Console. It features:
- Email and password input form
- Authenticates against the `/auth/login` backend endpoint
- Stores authentication token in sessionStorage
- Redirects to admin dashboard or a previously requested page after successful login
- Displays error messages on login failure
- Shows a professional login UI with the Rocket Elevators branding

## ModifyRecord.jsx
A placeholder component file that is currently empty. This component is intended for modifying/editing agent records but has not been implemented yet.

## RecordList.jsx
Displays a complete list of agents in a table format. Functionality includes:
- Fetches agents from the `/agent/` backend endpoint on component mount
- Renders agents in a data table with columns: Name, Region, Rating, Fees, Sales
- Each agent row has Edit and Delete action buttons
- Edit button links to the edit page for that specific agent
- Delete button removes the agent from the database and the UI immediately
- Properly formats numerical values (fees and sales) to 2 decimal places

## RequireAuth.jsx
A route protection/guard component that ensures only authenticated users can access protected routes. It:
- Checks for an `authToken` in browser sessionStorage
- If token exists, renders the protected content (children)
- If token is missing, redirects user to `/admin/login`
- Preserves the original location so user can be redirected back after login

## Unauthorized.jsx
An error page displayed when access is denied due to:
- Invalid login credentials
- Missing or expired authentication session
- Features Rocket Elevators branding and messaging
- Provides a link back to the login page for users to try again

## main.jsx
The main React application entry point and routing configuration. It:
- Sets up React Router with a browser router configuration
- Redirects root path `/` to the static landing page (`/index.html`)
- Protects the `/admin` dashboard with RequireAuth wrapper
- Defines child routes under `/admin`: list agents (index), create new agent (/create), edit agent (/edit/:id)
- Defines public routes: `/admin/login` and `/admin/unauthorized`
- Renders the app into the DOM root element
