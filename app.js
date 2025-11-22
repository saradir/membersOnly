import 'dotenv/config';              
import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import session from "express-session";
import passport from './config/passport.js';
import  * as dateHelpers  from './utils/dateHelpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import indexRouter from './routers/indexRouter.js';
import userRouter from './routers/userRouter.js';
import messageRouter from './routers/messageRouter.js';
import errorController from './controllers/errorController.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use((req, res, next) => {
  res.locals.date = dateHelpers;
  next();
});

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/messages', messageRouter);



app.use(errorController)
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});