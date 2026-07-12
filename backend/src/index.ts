import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import sub-routers
import authRouter from './routes/auth';
<<<<<<< HEAD
import usersRouter from './routes/users';
=======
import usersRouter from './routes/user';
>>>>>>> 6d5a4978cf2bda29982894c348aaedf5b67bff33
import csrRouter from './routes/csr';
import challengesRouter from './routes/challenges';
import environmentalRouter from './routes/environmental';
import governanceRouter from './routes/governance';
import analyticsRouter from './routes/analytics';
import settingsRouter from './routes/settings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
<<<<<<< HEAD
  origin: true,
=======
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL!],
>>>>>>> 6d5a4978cf2bda29982894c348aaedf5b67bff33
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Mount Sub-routers
app.use('/api/auth', authRouter);
app.use('/api', usersRouter);
app.use('/api', csrRouter);
app.use('/api', challengesRouter);
app.use('/api', environmentalRouter);
app.use('/api', governanceRouter);
app.use('/api', analyticsRouter);
app.use('/api', settingsRouter);

app.listen(PORT, () => {
  console.log(`🚀 EcoSphere API Server running on port ${PORT}`);
});
<<<<<<< HEAD
=======


app.listen(4000, () => console.log("Server running on 4000"));
>>>>>>> 6d5a4978cf2bda29982894c348aaedf5b67bff33
