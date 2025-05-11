import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import vaccineRoutes from './routes/vaccineRoutes.js';
import driveRoutes from './routes/driveRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/vaccine', vaccineRoutes);
app.use('/api/drive', driveRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});