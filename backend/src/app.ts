import express from 'express';
import routes from './routes/index';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000', // React frontend origin
    credentials: true,
  }),
);
app.use(express.json());
app.use(routes);

export default app;
