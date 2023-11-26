const path = require('path')
const fs = require('fs')
const ShellExec = require('./lib/ShellExec')

const prependFilenameInFolder = require('./lib/prependFilenameInFolder')
const isColab = require('./lib/isColab')

let processSingleOffice = async function (file) {
  let filename = path.basename(file)
  // let dirname = path.dirname(file)
  let filenameNoExt = filename
  if (filenameNoExt.slice(-5, -4) === '.') {
    filenameNoExt = filenameNoExt.slice(0, -5)
  }

  let outputFolder = `/output/${filenameNoExt}/`
  let outputDocFolder = `/output/${filenameNoExt}-doc/`
  fs.mkdirSync(outputFolder, {recursive: true})
  fs.mkdirSync(outputDocFolder, {recursive: true})

  let result
  
  let cmd = `unzip -o "${file}" -d "${outputDocFolder}"`
  console.log(cmd)
  try {
    result = await ShellExec(cmd)
  }
  catch (e) {
    console.error(e)
  }

  // ----------------------------------------------------------------

  if (fs.existsSync(`${outputDocFolder}/word/`)) {
    cmd = `mv "${outputDocFolder}/word/media/"* "${outputFolder}"`
  }
  else if (fs.existsSync(`${outputDocFolder}/xl/`)) {
    cmd = `mv "${outputDocFolder}/xl/media/"* "${outputFolder}"`
  }
  else if (fs.existsSync(`${outputDocFolder}/ppt/`)) {
    cmd = `mv "${outputDocFolder}/ppt/media/"* "${outputFolder}"`
  }
  // console.log(cmd)
  try {
    result = await ShellExec(cmd)
  }
  catch (e) {
    console.error(e)
  }

  // ----------------------------------------------------------------

  prependFilenameInFolder(filenameNoExt, outputFolder)

  // ----------------------------------------------------------------


  cmd = `rm -rf "${outputDocFolder}"`
  try {
    result = await ShellExec(cmd)
  }
  catch (e) {
    console.error(e)
  }

  // if (isColab) {
  //   await ShellSpawn(`cd "${outputFolder}"; zip -r ../"${filenameNoExt}.zip" . -i *`)
  // }
}

module.exports = processSingleOffice