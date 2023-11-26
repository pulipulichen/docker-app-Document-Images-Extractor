const fs = require('fs');
const path = require('path');

const dockerAPPDirectoryPath = '/input/.docker-app';
    
let stats = fs.statSync(dockerAPPDirectoryPath)

module.exports = stats.isDirectory()