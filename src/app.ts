import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';
import { AdminRoutes } from './app/modules/admin/admin.route';
import path from 'path';
const app = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});
app.use(
  express.static('dist', {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    },
  })
);
//body parser
app.use(
  cors({
    origin: [
      'https://hitekbd.com',
      'http://103.240.4.37:4173',
      'http://localhost:4173',
      'http://192.168.0.105:4173/',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));

//router
app.use('/api/v1', router);
app.use('/api/v1/admin', AdminRoutes);

//live response
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
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
