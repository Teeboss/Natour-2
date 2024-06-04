const path = require('path');
const express = require('express');
const { request } = require('http');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// GLOBAL MIDDLEWARES
// serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//Set Security HTTP headers
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com; connect-src 'self' ws://127.0.0.1:2974;"
  );
  next();
});
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js http://127.0.0.1:5000/api/v1/users/login ws://127.0.0.1:2974;'
  );
  next();
});

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "connect-src 'self' ws://127.0.0.1:2974 https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js http://127.0.0.1:5000/api/v1/users/login;"
  );
  next();
});
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "connect-src 'self' https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js http://127.0.0.1:5000/api/v1/users/login http://127.0.0.1:5000/api/v1/users/logout ws://127.0.0.1:2974;"
  );
  next();
});

// Limit requests from same API
const limiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data Sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against
app.use(xss());

// Prevent parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// ROUTES

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
