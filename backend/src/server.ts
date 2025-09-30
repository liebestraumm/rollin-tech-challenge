import express from 'express';
import taskRoutes from './routes/taskRoutes';
import { connectToDatabase } from './database';
import { errorHandler, notFound, deprecate } from './middleware';
import envs from './env';

const server = express();

server.use(express.json());

// New routes created with Node.js 20.19.4
server.use('/api/v1', taskRoutes);

// Legacy routes created with Node.js 10 (deprecated)
// Adds a deprecation warning to the response
server.use('/', deprecate(), taskRoutes);

// Checks if the route exists. If not, it throws an error
// 404 route handler
server.use(notFound);

// Centralised error handler
server.use(errorHandler);

const startServer = async () => {
  await connectToDatabase();
  server.listen(process.env.PORT ?? 8000, () => {
    console.log(`API running at http://localhost:${envs.PORT}`);
  });
};

startServer();
