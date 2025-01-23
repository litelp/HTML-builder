const fs = require('fs');
const path = require('path');

// создать папку project-dist
// поместить в нее файлы index.html объединенный style.css и папку assets

const templatePath = path.join(__dirname, 'template.html');
const projectDistPath = path.join(__dirname, 'project-dist');
const indexHTMLPath = path.join(projectDistPath, 'index.html');
const styleCSSPath = path.join(projectDistPath, 'style.css');
const componentsPath = path.join(__dirname, 'components');
const stylesFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const newAssetsFolderPath = path.join(projectDistPath, 'assets');

const dataStyleCSSFile = fs.createWriteStream(styleCSSPath);

function copyHTML() {
  fs.copyFile(templatePath, indexHTMLPath, () => {
    console.log('file was copied');
    const dataInHTML = fs.createReadStream(indexHTMLPath);
    dataInHTML.on('data', (data) => {
      let dataInString = data.toString();
      fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
        if (err) console.log(err);
        for (let file of files) {
          const ext = path.extname(file.name).slice(1);
          if (file.isFile() && ext === 'html') {
            const filePath = path.join(componentsPath, file.name);
            const dataFile = fs.createReadStream(filePath);
            const fileName = file.name.split('.')[0];
            dataFile.on('data', (data) => {
              dataInString = dataInString.replaceAll(`{{${fileName}}}`, data);
              fs.writeFile(indexHTMLPath, dataInString, () => {
                console.log(`${file.name} inserted`);
              });
            });
          }
        }
      });
    });
  });
}

function mergeStyles() {
  fs.readdir(stylesFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    for (let file of files) {
      const ext = path.extname(file.name).slice(1);
      if (file.isFile() && ext === 'css') {
        const filePath = path.join(stylesFolderPath, file.name);
        const dataFile = fs.createReadStream(filePath);
        dataFile.on('data', (data) => {
          dataStyleCSSFile.write(data);
        });
      }
    }
  });
}

function copyDirAssets(pathToFile = assetsFolderPath) {
  fs.readdir(pathToFile, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    for (let file of files) {
      const currentPath = path.join(pathToFile, file.name);
      if (file.isFile()) {
        const oldPath = currentPath.split('assets')[1];
        const newFilePath = path.join(newAssetsFolderPath, oldPath);
        fs.copyFile(currentPath, newFilePath, () => {
          console.log(`${file.name} copied`);
        });
      } else {
        fs.mkdir(
          path.join(newAssetsFolderPath, file.name),
          { recursive: true },
          () => {
            console.log(`${file.name} copied`);
            copyDirAssets(currentPath);
          },
        );
      }
    }
  });
}

function createFolder() {
  fs.mkdir(projectDistPath, { recursive: true }, () => {
    copyHTML();
    mergeStyles();
    copyDirAssets();
  });
}

createFolder();
