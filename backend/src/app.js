import cors from 'cors';
import express from 'express';
import healthRouter from './routes/health.js';
import authRouter from "./routes/auth.js";
import orderRouter from "./routes/order.js";
import menuRouter from "./routes/menu.js";
import attendanceRouter from "./routes/attendance.js";
import classesRouter from "./routes/classes.js";
import leftoversRouter from "./routes/leftovers.js";



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
app.use("/api/order", orderRouter);
app.use("/api/menu", menuRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/classes", classesRouter);
app.use("/api/leftovers", leftoversRouter);

export default app;
