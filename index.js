import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import dotenv from 'dotenv';

// import the config files
import './config/mongodb.js';

dotenv.config();

const app = express();

// use the middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('views'));
app.use(session({
  secret: 'sdkjcfvklefdsvcs',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://soumyadeepsp:CodingNinjas1@e-commerce.zipnl.mongodb.net/?retryWrites=true&w=majority&appName=E-Commerce' })
}));
app.use(passport.authenticate('session'));

// importing the routes
import { router } from './routes/index.js';

// Define a simple route
app.use('/', router);
// everything that starts with / means every possible API route

// Start the server
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.SERVER_PORT}`);
});
