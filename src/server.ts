import express from "express";
import taskRoutes from "./routes/taskRoutes";
import { connectToDatabase } from "./database";

const server = express()

server.use(express.json());

// New routes created with Node.js 20.19.4
server.use("/api/v1", taskRoutes);

// Legacy routes created with Node.js 10 (deprecated)
server.use("/", taskRoutes);

const startServer = async () => {
  await connectToDatabase();
  server.listen(process.env.PORT ?? 8000, () => {
    console.log(`API running at http://localhost:${process.env.PORT}`);
  });
};

startServer();
