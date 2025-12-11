import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import errorMiddlware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.Routes.js';
import miscRoutes from './routes/miscellanous.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import userRoutes from './routes/user.Routes.js';

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Allowed origins for Dev + Prod
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://learning-management-system-roan.vercel.app",
  "https://your-vercel-frontend-url.vercel.app"  // <-- Replace when you deploy your version
];

// ✅ Dynamic CORS handler
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // for tools like Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan('dev'));

app.use('/ping', (_req, res) => {
  res.send('Pong');
});

// ROUTES
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', miscRoutes);

app.all('*', (_req, res) => {
  res.status(404).send('OOPS!! 404 page not found');
});

app.use(errorMiddlware);

export default app;
