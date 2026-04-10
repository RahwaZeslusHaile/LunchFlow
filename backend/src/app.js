import cors from 'cors';
import express from 'express';
import healthRouter from './routes/health.js';
import authRouter from "./routes/auth.js";
import orderRouter from "./routes/order.js";
import menuRouter from "./routes/menu.js";
import attendanceRouter from "./routes/attendance.js";
import classesRouter from "./routes/classes.js";
import leftoversRouter from "./routes/leftovers.js";
import eventStepRouter from "./routes/eventStep.js";
import orderHistoryRouter from "./routes/orderHistory.js";




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
app.use("/api/eventStep", eventStepRouter);
app.use("/api/latest", orderHistoryRouter);
export default app;
