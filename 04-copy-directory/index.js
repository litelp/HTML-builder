const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const newFolderPath = path.join(__dirname, 'files-copy');

function copyDirectory() {
  fs.rm(newFolderPath, { recursive: true, force: true }, () => {
    fs.mkdir(newFolderPath, { recursive: true }, () => {
      fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
        if (err) console.log(err);
        for (let file of files) {
          const filePath = path.join(folderPath, file.name);
          const newFilePath = path.join(newFolderPath, file.name);
          fs.copyFile(filePath, newFilePath, () => {
            console.log(`${file.name} copied`);
          });
        }
      });
    });
  });
}

copyDirectory();
