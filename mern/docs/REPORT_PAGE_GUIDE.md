# Report Page Guide

## Overview
Displays 2 interactive charts showing agent performance and transaction trends. Auto-loads on page mount.

**Chart 1**: Bar chart - Total transactions per agent  
**Chart 2**: Line chart - Daily transactions (past 14 days)

---

## Frontend

**Report.jsx** (`mern/client/src/components/Report.jsx`)

**State**:
- `reportData`: Chart data from backend
- `loading`: Fetch in progress
- `error`: Error message if fetch fails

**Behavior**:
1. useEffect on mount calls fetchReportData()
2. Shows spinner while loading
3. Shows error alert if fetch fails
4. Renders 2 charts (side-by-side on desktop, stacked on mobile)

**Charts**:
- Bar: Agent names (X) vs total transaction amount (Y)
- Line: Past 14 dates (X) vs daily transaction totals (Y)
- Both Y-axes formatted as currency ($)
- Responsive height: 150px



---

## Backend

**GET /report/report-data** - Aggregates all transaction data into 2 chart datasets

**Response**:
```json
{
  "status": "ok",
  "data": {
    "agent_bar_data": {
      "labels": ["John Smith", "Jane Doe"],
      "datasets": [{ label: "Total Amount", data: [15000, 22500] }]
    },
    "transaction_line_data": {
      "labels": ["2026-02-20", "2026-02-21", ...],
      "datasets": [{ label: "Daily Totals", data: [0, 1500, ...] }]
    }
  }
}
```

**Processing**:

1. **Bar Chart**: Groups all transactions by agent
   - Agent name (first + last) as label
   - Sum all transaction amounts per agent
   - Assign different color per agent
   - Handles deleted agents as "Inactive Agent"

2. **Line Chart**: Sums transactions by date (past 14 days)
   - Initialize all 14 dates with $0
   - Add transaction amounts to their date
   - Sort chronologically (oldest first)
   - Blue filled area under line

**Models**: Transaction (populated with Agent data)



---

## Data Flow

**Page Load**:
```
1. Component mounts → fetchReportData()
2. GET /report/report-data
3. Backend aggregates all transactions
4. Returns chart data → reportData state
5. Charts render
```

**Errors**: Shows alert instead of charts

---

## Key Features

✓ Real-time data aggregation (no caching)  
✓ Handles deleted agents as "Inactive Agent"  
✓ 14-day rolling window (always past 2 weeks)  
✓ Responsive layout (side-by-side desktop, stacked mobile)  
✓ Currency formatting on Y-axis  
✓ Interactive charts (hover shows values)  
✓ Agent sales updated when transactions created

---

## Usage

1. Navigate to Report page
2. Page auto-loads (spinner shows during fetch)
3. View charts:
   - **Bar**: Compare agent performance
   - **Line**: See transaction trends/patterns

---

## API

### GET /report/report-data
**Request**: `http://localhost:3000/report/report-data`

**Response** (200): Chart dataset objects

**Response** (500): Error message

**Parameters**: None (always returns all data)

---

## Testing

- [ ] Charts load after page mount
- [ ] Both charts display correctly
- [ ] Y-axis shows currency ($)
- [ ] Responsive on mobile/desktop
- [ ] Hover tooltips work
- [ ] All agents appear in bar chart
- [ ] Line shows past 14 dates
- [ ] Error alert displays on fetch fail
- [ ] Data updates with new transactions

---

## Database

**Models**: Transaction + Agent (populated)

**No pagination**: All transactions processed for report

**Performance**: May slow with 1000s+ transactions (consider aggregation pipeline for optimization)
