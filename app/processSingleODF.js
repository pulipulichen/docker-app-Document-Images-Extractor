const path = require('path')
const fs = require('fs')
const ShellExec = require('./lib/ShellExec')

const prependFilenameInFolder = require('./lib/prependFilenameInFolder')
const isColab = require('./lib/isColab')

const processSinglePDF = require('./processSinglePDF')

let processSingleODF = async function (file) {
  let filename = path.basename(file)
  // let dirname = path.dirname(file)
  let filenameNoExt = filename
  if (filenameNoExt.slice(-4, -3) === '.') {
    filenameNoExt = filenameNoExt.slice(0, -4)
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

  if (fs.existsSync(`${outputDocFolder}/media/`)) {
    cmd = `mv "${outputDocFolder}/media/"* "${outputFolder}"`
  }
  else if (fs.existsSync(`${outputDocFolder}/Pictures/`)) {
    cmd = `mv "${outputDocFolder}/Pictures/"* "${outputFolder}"`
  }
  else {
    cmd = false
  }
  // console.log(cmd)
  if (cmd !== false) {
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
  }
  else {
    cmd = `rm -rf "${outputDocFolder}"`
    try {
      result = await ShellExec(cmd)
    }
    catch (e) {
      console.error(e)
    }

    cmd = `unoconv -f pdf "${file}"`

    try {
      result = await ShellExec(cmd)
    }
    catch (e) {
      console.error(e)
    }

    let pdfFile = file
    if (pdfFile.slice(-4, -3) === '.') {
      pdfFile = pdfFile.slice(0, -4) + '.pdf'
    }
    else if (pdfFile.slice(-5, -4) === '.') {
      pdfFile = pdfFile.slice(0, -5) + '.pdf'
    }
    await processSinglePDF(pdfFile)

    fs.unlinkSync(pdfFile)
  }


  // if (isColab) {
  //   await ShellSpawn(`cd "${outputFolder}"; zip -r ../"${filenameNoExt}.zip" . -i *`)
  // }
}

module.exports = processSingleODF