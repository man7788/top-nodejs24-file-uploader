const { body, validationResult } = require('express-validator');
const db = require('../prisma/queries');
const multer = require('multer');

const nameErr = 'must be between 1 and 255 characters.';

const validateFolder = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(`Folder name ${nameErr}`)
    .escape(),
];

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
    // Content flash from create folder
    const errors = req.flash('errors');

    res.locals.folders = root.subFolders;
    // Session property for create folder redirect
    req.session.path = null;
    req.session.superFolder = root.id;

    res.render('uploader', {
      title: 'Uploader',
      filePath: null,
      errors,
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
        pathString = pathString + name;
        return pathString;
      }

      pathString = pathString + name + '/';
    });

    let backPath = '/';
    path.forEach((name, index) => {
      if (path.length === 1) {
        backPath = '';
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
        // Content flash from create folder
        const errors = req.flash('errors');

        res.locals.folders = folder.subFolders;
        // Session property for create folder redirect
        req.session.path = path;
        req.session.superFolder = folder.id;

        return res.render('uploader', {
          title: 'Uploader',
          filePath: pathString,
          backPath,
          errors,
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

exports.postFolder = [
  validateFolder,
  async (req, res) => {
    if (req.isAuthenticated()) {
      // Session property from get uploader or get folder
      const path = req.session.path;
      let pathString = '';

      if (req.session.path) {
        pathString = '/';
        path.forEach((name, index) => {
          if (index === path.length - 1) {
            pathString = pathString + name;
            return pathString;
          }

          pathString = pathString + name + '/';
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Content flash for get uploader or get folder
        req.flash('errors', errors.array());
        return res.status(400).redirect(`/uploader${pathString}`);
      }

      await db.createFolder(
        req.body.name,
        req.session.passport.user,
        // Session property from get uploader or get folder
        req.session.superFolder
      );

      res.redirect(`/uploader${pathString}`);
    } else {
      res.redirect('/log-in');
    }
  },
];

exports.deleteFolder = async (req, res) => {
  if (req.isAuthenticated()) {
    // Session property from get uploader or get folder
    const path = req.session.path;
    let pathString = '';

    if (req.session.path) {
      pathString = '/';
      path.forEach((name, index) => {
        if (index === path.length - 1) {
          pathString = pathString + name;
          return pathString;
        }

        pathString = pathString + name + '/';
      });
    }

    await db.deleteFolder(
      req.session.passport.user,
      // Session property from get uploader or get folder
      req.body.delete
    );

    res.redirect(`/uploader${pathString}`);
  } else {
    res.redirect('/log-in');
  }
};

exports.patchFolder = [
  validateFolder,
  async (req, res) => {
    if (req.isAuthenticated()) {
      // Session property from get uploader or get folder
      const path = req.session.path;
      let pathString = '';

      if (req.session.path) {
        pathString = '/';
        path.forEach((name, index) => {
          if (index === path.length - 1) {
            pathString = pathString + name;
            return pathString;
          }

          pathString = pathString + name + '/';
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Content flash for get uploader or get folder
        req.flash('errors', errors.array());
        return res.status(400).redirect(`/uploader${pathString}`);
      }

      await db.updateFolder(
        req.body.name,
        req.session.passport.user,
        // Session property from get uploader or get folder
        req.body.id
      );

      res.redirect(`/uploader${pathString}`);
    } else {
      res.redirect('log-in');
    }
  },
];
