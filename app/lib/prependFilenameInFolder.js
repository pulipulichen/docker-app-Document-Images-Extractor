const path = require('path')
const fs = require('fs')

let prependFilenameInFolder = function (prepend, directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
  
    files.forEach((file) => {
      const oldFilePath = path.join(directoryPath, file);
      const newFileName = prepend + ` - ${file}`;
      const newFilePath = path.join(directoryPath, newFileName);
  
      try {
        fs.renameSync(oldFilePath, newFilePath);
        console.log(`Renamed ${file} to ${newFileName}`);
      } catch (renameError) {
        console.error(`Error renaming file ${file}:`, renameError);
      }
    });
  } catch (readDirError) {
    console.error('Error reading directory:', readDirError);
  }
}

module.exports = prependFilenameInFolder