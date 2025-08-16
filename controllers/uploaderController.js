// Main Controllers
exports.getUploader = async (req, res) => {
  if (req.isAuthenticated()) {
    res.render('uploader', { title: 'Uploader' });
  } else {
    res.redirect('/log-in');
  }
};
