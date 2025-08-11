require('dotenv').config();

const path = require('node:path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');

const app = express();

const assetsPath = path.join(__dirname, 'public');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

const indexRouter = require('./routes/indexRouter');

// SESSION SETUP //
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// PASSPORT SETUP //
require('./passport');
app.use(passport.session());
app.use((req, res, next) => {
  req.user && (res.locals.currentUser = req.user);
  next();
});

// ROUTES //
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});
