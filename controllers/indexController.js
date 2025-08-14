// Index Controllers
exports.getIndex = async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/main');
  } else {
    res.render('login', { title: 'Log In' });
  }
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
