const fs = require('fs');
const path = require('path');
const currentFile = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(currentFile);
stream.on('data', (data) => {
  console.log(data.toString());
});
