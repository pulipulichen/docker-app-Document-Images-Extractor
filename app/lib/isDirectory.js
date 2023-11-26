const fs = require('fs')

function isDirectory(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (err) {
    // Handle potential errors, e.g., path does not exist or is inaccessible
    console.error(`Error checking if ${path} is a directory:`, err);
    return false;
  }
}

module.exports = isDirectory