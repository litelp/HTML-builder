const fs = require('fs');
const path = require('path');

const pathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathFolder, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  console.log('Files in Secret-folder: ');
  for (const file of files) {
    if (file.isFile()) {
      const name = file.name.split('.')[0];
      const extension = path.extname(file.name).slice(1);
      const pathFile = path.join(pathFolder, file.name);
      fs.stat(pathFile, (err, stats) => {
        if (err) console.log(err);
        const size = stats.size;
        console.log(`${name} - ${extension} - ${size}B`);
      });
    }
  }
});
