require('dotenv').config();

const path = require('node:path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const methodOverride = require('method-override');

const app = express();

const assetsPath = path.join(__dirname, 'public');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('_method'));

const indexRouter = require('./routes/indexRouter');
const uploaderRouter = require('./routes/uploaderRouter');

// SESSION SETUP //
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: parseInt(process.env.SESSION_CHECK_PERIOD),
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE),
    },
  })
);

// PASSPORT SETUP //
require('./utils/passport');
app.use(passport.session());
app.use((req, res, next) => {
  req.user && (res.locals.currentUser = req.user);
  next();
});

// ROUTES //
app.use('/', indexRouter);
app.use('/uploader', uploaderRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});
