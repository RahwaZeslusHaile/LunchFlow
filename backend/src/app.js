import cors from 'cors';
import express from 'express';
import healthRouter from './routes/health.js';
import authRouter from "./routes/auth.js";
import menuRouter from "./routes/menu.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'LunchFlow API',
    status: 'running'
  });
});

app.use('/api/health', healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/menu", menuRouter);

export default app;
