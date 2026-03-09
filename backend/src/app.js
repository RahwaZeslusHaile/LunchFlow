import cors from 'cors';
import express from 'express';
import healthRouter from './routes/health.js';

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

export default app;
