import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import { StatusCodes } from 'http-status-codes';

import router from './routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { Morgan } from './shared/morgen';
import sendResponse from './shared/sendResponse';

const app: Application = express();

/**
 * ============================
 * Logger (Morgan)
 * ============================
 */
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

/**
 * ============================
 * Allowed Origins
 * ============================
 */
const allowedOrigins: string[] = [
  'http://localhost:3000',
  'https://dashboard.zeroproofdrive.org',
];

/**
 * ============================
 * CORS Options (Type Safe)
 * ============================
 */
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed =
      allowedOrigins.includes(origin) ||
      (typeof origin === 'string' && origin.endsWith('.vercel.app'));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false); // DO NOT throw error
    }
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],
};

/**
 * ============================
 * CORS Middleware
 * ============================
 */
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

/**
 * ============================
 * Body & Cookie Parser
 * ============================
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * ============================
 * Static Files
 * ============================
 */
app.use(express.static('uploads'));

/**
 * ============================
 * Routes
 * ============================
 */
app.use('/api/v1', router);

/**
 * ============================
 * Health Check Route
 * ============================
 */
app.get('/', (req: Request, res: Response) => {
  const date = new Date();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Beep-beep! The server is alive and kicking.',
    data: date,
  });
});

/**
 * ============================
 * Global Error Handler
 * ============================
 */
app.use(globalErrorHandler);

/**
 * ============================
 * 404 Not Found Handler
 * ============================
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;