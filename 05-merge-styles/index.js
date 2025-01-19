const fs = require('fs');
const path = require('path');

const originalPath = path.join(__dirname, 'styles');
const destinationPath = path.join(__dirname, 'project-dist');
const newFilePath = path.join(destinationPath, 'bundle.css');

const dataNewFile = fs.createWriteStream(newFilePath);

fs.readdir(originalPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  for (let file of files) {
    const ext = path.extname(file.name).slice(1);
    if (file.isFile() && ext === 'css') {
      const filePath = path.join(originalPath, file.name);
      const dataFile = fs.createReadStream(filePath);
      dataFile.on('data', (data) => {
        dataNewFile.write(data);
      });
    }
  }
});
