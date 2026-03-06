# Toast Notifications System Guide

## Overview
Global notification system using React Context + React Bootstrap. Shows 1 toast at a time (3 sec auto-dismiss).

---

## Architecture

| Component | Purpose |
|-----------|---------|
| **ToastContext.jsx** | State management (showToast, removeToast) |
| **ToastContainer.jsx** | Visual rendering (top-right corner) |
| **useToast Hook** | Access toast context in components |

---

## Quick Setup

### 1. Wrap App with Provider
```javascript
// App.jsx
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ToastContainer';

function App() {
  return (
    <ToastProvider>
      {/* Your routes */}
      <ToastContainer />
    </ToastProvider>
  );
}
```

### 2. Use in Components
```javascript
import { useToast } from '../hooks/useToast';

export default function MyComponent() {
  const { showToast } = useToast();
  
  const handleClick = () => {
    showToast('Success!', 'success');     // 3 sec auto-dismiss
    showToast('Error!', 'danger');        // Red
    showToast('Warning', 'warning');      // Yellow
    showToast('Info', 'info', 5000);      // 5 sec custom duration
  };
  
  return <button onClick={handleClick}>Show Toast</button>;
}
```



---

## Toast Types

| Type | Color | Use Case | Icon |
|------|-------|----------|------|
| `'success'` | Green | ✓ Checkmark | Login, create record |
| `'danger'` | Red | ✕ X mark | Errors |
| `'warning'` | Yellow | ⚠ Warning | Validation issues |
| `'info'` | Blue | ℹ Info | Notifications |

---

## API Reference

### showToast(message, type = 'success', duration = 3000)
- **message** (required): Text to display
- **type** (optional): 'success', 'danger', 'warning', 'info'
- **duration** (optional): ms before auto-dismiss (0 = never dismiss)

### removeToast(id)
- Manually remove toast by ID
- Called automatically after duration expires or on close button click

---

## Common Use Cases

**Form Success**:
```javascript
if (response.ok) {
  showToast('Record created successfully', 'success');
}
```

**Form Error**:
```javascript
if (!response.ok) {
  showToast('Failed to create record', 'danger');
}
```

**Validation**:
```javascript
if (amount <= 0) {
  showToast('Amount must be positive', 'warning');
}
```

**Custom Duration**:
```javascript
showToast('Processing...', 'info', 0);  // Never dismiss
showToast('Timeout soon', 'warning', 5000);  // 5 seconds
```

---

## Key Features

- ✓ Only 1 toast visible at a time (queues extra toasts)
- ✓ Auto-dismisses after 3 seconds
- ✓ Manual close button (✕)
- ✓ Top-right corner positioning
- ✓ Uses React Context for global state
- ✓ Requires ToastProvider + ToastContainer in App.jsx

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Toast not showing | Add `<ToastContainer />` and wrap with `<ToastProvider>` in App.jsx |
| useToast error | Use hook only inside ToastProvider |
| Wrong color | Check type spelling: 'success', 'danger', 'warning', 'info' |
| Multiple toasts showing | Intended behavior is 1 at a time (max) |
| Quick dismiss | Default is 3s; change duration parameter |

---

## Files

- **ToastContext.jsx**: State management
- **ToastContainer.jsx**: Visual component
- **useToast.js**: Hook to access context
- **ToastContainer.css**: Styling
