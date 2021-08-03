require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const hbs = require("hbs")
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const myPetRouter = require("./routes/myPet")
const dev_mode = false;
const petsRouter = require('./routes/pets')
const playdatesRouter = require('./routes/playdates');
const User = require('./models/User');

const app = express();

require("./config/mongo.js");
// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, "views/partials")); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//hbs.registerPartials(__dirname + "/views/partials")


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//uncommented duplicate lines
//app.use(express.static(path.join(__dirname, 'public')));
//hbs.registerPartials(path.join(__dirname, "views/partials")); 


app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/', petsRouter);
app.use('/', playdatesRouter);

app.use('/', petsRouter)
//app.use('/signin', authRouter);
app.use('/', authRouter);
app.use('/', myPetRouter)

app.set('trust proxy', 1);


app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60000
    }, // ADDED code below !!!
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://localhost/basic-auth'

      // ttl => time to live
      // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
    })
  })
)

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/', petsRouter);
app.use('/', playdatesRouter);

app.use('/', petsRouter)
//app.use('/signin', authRouter);
app.use('/', authRouter);


app.use((req, res, next) => {
  if (req.session.currentUser) {
    User.findById(req.session.currentUser._id)
      .then((userFromDb) => {
        res.locals.currentUser = userFromDb;
        res.locals.isLoggedIn = true;
        next();
      })
      .catch((error) => {
        next(error);
      });
  } else {
    res.locals.currentUser = undefined;
    res.locals.isLoggedIn = false;
    next();
  }
});

//app.use((req, res, next) => {
//  console.log(req.session);
//
//  next();
//})

app.use(require("./middlewares/auth")); 

if (dev_mode === true) {
app.use(require("./middlewares/devMode"));
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
