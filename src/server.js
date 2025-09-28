import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from 'url';
import setupTaskRoutes from "./routes/taskRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

setupTaskRoutes(server, router);

server.use(router);

server.listen(3001, () => {
    console.log("Mock API running at http://localhost:3001");
});