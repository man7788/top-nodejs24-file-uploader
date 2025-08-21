const db = require('../prisma/queries');
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
    const root = await db.readFolder(res.locals.currentUser.id);
    res.locals.folders = root.subFolders;
    res.render('uploader', {
      title: 'Uploader',
      filePath: null,
    });
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

// Folder Controllers
exports.getFolder = async (req, res) => {
  if (req.isAuthenticated()) {
    const root = await db.readFolder(res.locals.currentUser.id);
    const path = req.params.folders;

    let pathString = '/';
    path.forEach((name, index) => {
      if (index === path.length - 1) {
        return (pathString = pathString + name);
      }
      pathString = pathString + name + '/';
    });

    let backPath = '/';
    path.forEach((name, index) => {
      if (path.length === 1) {
        backPath = backPath.slice(0, -1);
        return backPath;
      }

      if (index === path.length - 1) {
        backPath = backPath.slice(0, -1);
        return backPath;
      }

      backPath = backPath + name + '/';
    });

    const traverseSubFolder = (subFolders, path, i = 0) => {
      // Path name doesn't exist in directory, 1 index ahead of sub-folders array
      if (i > subFolders.length - 1) {
        return null;
      }

      if (path === subFolders[i].name) {
        return subFolders[i];
      }

      i += 1;
      return traverseSubFolder(subFolders, path, i);
    };

    const traversePath = async (folder, index = 0) => {
      // Finished traversing, 1 index ahead of path array
      if (index > path.length - 1) {
        res.locals.folders = folder.subFolders;
        return res.render('uploader', {
          title: 'Uploader',
          filePath: pathString,
          backPath,
        });
      }

      if (!folder.subFolders) {
        return res.status(404).send('Not Found');
      }

      const targetFolder = traverseSubFolder(folder.subFolders, path[index]);

      if (!targetFolder) {
        return res.status(404).send('Not Found');
      }

      const nextFolder = await db.readFolder(
        res.locals.currentUser.id,
        targetFolder.id
      );

      index += 1;
      return traversePath(nextFolder, index);
    };

    await traversePath(root);
  } else {
    res.redirect('/log-in');
  }
};
