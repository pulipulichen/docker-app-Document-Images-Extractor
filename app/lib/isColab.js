const fs = require('fs');
const path = require('path');

const dockerAPPDirectoryPath = '/input/.docker-app';

function isColab() {
  if (!fs.existsSync(dockerAPPDirectoryPath)) {
    return false
  }

  let stats = fs.statSync(dockerAPPDirectoryPath)
  return stats.isDirectory()
}
    


module.exports = isColab()