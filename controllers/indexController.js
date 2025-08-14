// Index Controllers
exports.getIndex = async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/main');
  } else {
    res.render('login', { title: 'Log In' });
  }
};

// Sign-up Controllers
exports.getSignup = async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/main');
  }
  res.render('sign-up', { title: 'Sign Up' });
};

// Log-in Controllers
exports.getLogin = async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/main');
  }
  res.render('login', { title: 'Log In' });
};

// Main Controllers
exports.getMain = async (req, res) => {
  res.render('main', { title: 'Main' });
};
