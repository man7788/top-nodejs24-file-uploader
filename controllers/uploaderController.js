const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Uploader Controllers
exports.getUploader = async (req, res) => {
  if (req.isAuthenticated()) {
    res.render('uploader', { title: 'Uploader' });
  } else {
    res.redirect('/log-in');
  }
};

exports.postUploader = [
  upload.single('upload'),
  async (req, res) => {
    res.redirect('/uploader');
  },
];
