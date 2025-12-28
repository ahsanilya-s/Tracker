# Database Integration Guide

## Overview
This database schema is designed to store 10+ years of historical goal tracking data with optimized queries and partitioning.

## Key Features

### 1. **Long-term Data Storage**
- Partitioned tables by year for efficient historical queries
- Indexed columns for fast retrieval of any month/year data
- Separate year, month, day columns for optimized filtering

### 2. **Database Schema**

#### Tables:
- **users**: User accounts
- **goals**: User goals with soft delete support
- **tasks**: Tasks under goals with soft delete
- **task_completions**: Daily task completion records (partitioned by year)
- **moods**: Daily mood tracking (partitioned by year)
- **monthly_stats**: Pre-computed monthly statistics for fast aggregation

### 3. **API Endpoints**

#### GET /api/month-data
Retrieve all data for a specific month/year
```
Query Params:
- username: string
- year: number
- month: number (0-11, JavaScript format)

Response:
{
  "goals": [...],
  "moods": { "2026-01-15": "😊" }
}
```

#### POST /api/goals
Save goals and task completions
```
Body:
{
  "username": "user1",
  "year": 2026,
  "month": 0,
  "goals": [...]
}
```

#### POST /api/mood
Save mood for a specific date
```
Body:
{
  "username": "user1",
  "date": "2026-01-15",
  "emoji": "😊"
}
```

## Setup Instructions

### 1. Install MySQL
```bash
# Download and install MySQL 8.0+
```

### 2. Create Database
```sql
CREATE DATABASE goal_tracker;
```

### 3. Update application.properties
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/goal_tracker
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 4. Run the Application
```bash
mvn spring-boot:run
```

### 5. Update Frontend
Replace localStorage calls with API calls:

```typescript
// Instead of localStorage
const savedGoals = localStorage.getItem('goals');

// Use API
const response = await fetch(
  `http://localhost:8080/api/month-data?username=user1&year=${year}&month=${month}`
);
const data = await response.json();
```

## Performance Optimizations

1. **Partitioning**: Tables partitioned by year for 10+ year data
2. **Indexing**: Composite indexes on (user_id, date), (year, month)
3. **Caching**: Monthly stats pre-computed for fast dashboard loading
4. **Connection Pooling**: HikariCP with optimized pool size

## Data Retention
- All data retained indefinitely
- Soft deletes for goals/tasks (deleted_at column)
- Historical data accessible via year/month parameters
- Partition management for adding future years

## Migration from localStorage

```typescript
// Save current localStorage data to database
async function migrateToDatabase() {
  const goals = JSON.parse(localStorage.getItem('goals') || '[]');
  const moods = JSON.parse(localStorage.getItem('moods') || '{}');
  
  await fetch('http://localhost:8080/api/goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'user1',
      year: 2026,
      month: 0,
      goals
    })
  });
  
  for (const [date, emoji] of Object.entries(moods)) {
    await fetch('http://localhost:8080/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user1', date, emoji })
    });
  }
}
```
