const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./prisma/queries');

const customFields = { usernameField: 'email' };

const verifyCallback = async (email, password, done) => {
  try {
    const user = await db.readUserByEmail(email);

    if (!user) {
      return done(null, false, { message: 'Incorrect email' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy(customFields, verifyCallback));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.readUserById(id);

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});
