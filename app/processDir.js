const path = require('path')
const fs = require('fs')
const ShellExec = require('./lib/ShellExec')

// const isColab = require('./lib/isColab')

// const processDocument = require('./processDocument')

let processDir = async function (directoryPath, processDocument) {
  let filename = path.basename(directoryPath)
  let outputFolder = `/output/${filename}-images/`
  fs.mkdirSync(outputFolder, {recursive: true})

  const files = fs.readdirSync(directoryPath);
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    // console.log(processDocument)
    await processDocument(path.join(directoryPath, file), false)

    let filenameNoExt = path.basename(file)
    if (filenameNoExt.slice(-4, -3) === '.') {
      filenameNoExt = filenameNoExt.slice(0, -4)
    }
    else if (filenameNoExt.slice(-5, -4) === '.') {
      filenameNoExt = filenameNoExt.slice(0, -5)
    }

    if (filename === filenameNoExt) {
      continue
    }

    let cmd = `mv "/output/${filenameNoExt}/"* "/output/${filename}-images"`
    console.log(cmd)
    try {
      result = await ShellExec(cmd)
    }
    catch (e) {
      console.error(e)
    }

    cmd = `rm -rf "/output/${filenameNoExt}/"`
    try {
      result = await ShellExec(cmd)
    }
    catch (e) {
      console.error(e)
    }
  }

  // if (isColab) {
  //   await ShellSpawn(`cd "/output/${filename}-images"; zip -r ../"${filename}-images.zip" . -i *`)
  // }
}

module.exports = processDir