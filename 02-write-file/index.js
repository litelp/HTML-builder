const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

const pathFile = path.join(__dirname, 'text.txt');

const newFile = fs.createWriteStream(pathFile);

stdout.write('Hello! Enter the password: ');

stdin.on('data', (data) => {
  if (data.toString().trim() !== 'exit') {
    newFile.write(data);
  } else {
    process.exit();
  }
});

process.on('exit', () => stdout.write('\nGoodbye!'));
process.on('SIGINT', () => process.exit());
