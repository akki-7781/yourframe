const port = process.env.PORT || 3000;

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');

app.use(compression());
app.use(helmet());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    const directoryPath = path.join(__dirname, 'public', 'images');
    fs.readdir(directoryPath, function (err, files) {
      if (files)
        cb(null, 'Image-' + (files.length+1)+'.jpg')
      else
        cb(null, 'Image-' +1+'.jpg')
    });
    
  }
});
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: function (req, file, callback) {
    if (!file.mimetype.includes('image')) {
      return callback(new Error('Only images allowed!'));
    }
    callback(null, true)
  },
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/images', (req, res) => {
  const directoryPath = path.join(__dirname, 'public', 'images');
  fs.readdir(directoryPath, function (err, files) {
    if (files) res.send({
      url: files,
      total: files.length
    });
    else res.send({
      url: [],
      total: 0
    });
  });
});


app.post('/image', upload.single('image'), (req, res) => {
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log(`Started on port ${port}`);
});
