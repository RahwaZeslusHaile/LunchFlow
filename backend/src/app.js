import cors from 'cors';
import express from 'express';
import healthRouter from './routes/health.js';
import authRouter from "./routes/auth.js";
import attendanceRouter from "./routes/attendance.js";


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
app.use("/api/attendance", attendanceRouter);

export default app;
