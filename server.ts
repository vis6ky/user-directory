/**
 * NODE.JS BACKEND (Express + Socket.io)
 * Reference implementation of the backend logic.
 * Provides REST API for user data and WebSocket events for task processing.
 */

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { generateMockUsers } from './constants';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS enabled
const io = new Server(server, { 
  cors: { origin: '*' } 
});

// Use middleware with explicit type casting to satisfy Express RequestHandler requirements
app.use(cors() as express.RequestHandler);
app.use(express.json() as express.RequestHandler);

// In-memory "Database"
const db = generateMockUsers(500);

/**
 * 1. PAGINATED USER API
 * Handles search, filtering by nationality/hobby/age, and pagination.
 */
app.get('/api/users', (req, res) => {
  const { search, nationality, hobby, minAge, maxAge, page = 1, limit = 12 } = req.query;
  
  const filtered = db.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const searchMatch = !search || fullName.includes(search.toString().toLowerCase());
    const nationalityMatch = !nationality || user.nationality === nationality;
    const hobbyMatch = !hobby || user.hobbies.includes(hobby.toString());
    const ageMatch = user.age >= Number(minAge) && user.age <= Number(maxAge);
    return searchMatch && nationalityMatch && hobbyMatch && ageMatch;
  });

  const startIndex = (Number(page) - 1) * Number(limit);
  const data = filtered.slice(startIndex, startIndex + Number(limit));

  res.json({
    data,
    total: filtered.length,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(filtered.length / Number(limit))
  });
});

/**
 * 2. LOREM IPSUM STREAMING API
 * Demonstrates a chunked transfer encoding response.
 */
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const text = "Streaming data from Node.js backend... " + "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(50);
  let offset = 0;
  const chunk_size = 64;

  const interval = setInterval(() => {
    if (offset >= text.length) {
      clearInterval(interval);
      res.end();
      return;
    }
    res.write(text.slice(offset, offset + chunk_size));
    offset += chunk_size;
  }, 30);
});

/**
 * 3. REAL-TIME WEBSOCKETS (Task Workers)
 * Handles task dispatching and real-time result emission via Socket.io.
 */
io.on('connection', (socket) => {
  console.log('Client connected to WebSocket:', socket.id);

  socket.on('dispatch_task', (data) => {
    const { taskId } = data;
    console.log(`Processing task ${taskId} on backend...`);
    
    // Simulate background worker processing delay
    setTimeout(() => {
      socket.emit('task_result', {
        taskId,
        result: 'Success: Result processed by backend worker',
        timestamp: Date.now()
      });
    }, 2000);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from WebSocket');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Mock Node Server running on http://localhost:${PORT}`);
});