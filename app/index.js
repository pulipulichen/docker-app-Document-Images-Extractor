const ShellExec = require('./lib/ShellExec')
const GetFiles = require('./lib/GetFiles')

const path = require('path')
const fs = require('fs')

let main = async function () {
  let files = GetFiles()

  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    if (isDirectory(file)) {
      await processDir(file)
    }
    else if (file.endsWith('.pdf')) {
      await processSinglePDF(file)
    }
    else if (file.endsWith('.odt') || file.endsWith('.ods') || file.endsWith('.odp') || file.endsWith('.odg')) {
      await processSingleODF(file)
    }
  }
}

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

let processDir = async function (directoryPath) {
  let filename = path.basename(directoryPath)
  let outputFolder = `/output/${filename}/`
  fs.mkdirSync(outputFolder, {recursive: true})


  const files = fs.readdirSync(directoryPath);
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (file.endsWith('.pdf')) {
      await processSinglePDF(file)
    }
    else if (file.endsWith('.odt') || file.endsWith('.ods') || file.endsWith('.odp') || file.endsWith('.odg')) {
      await processSingleODF(file)
    }

    let filenameNoExt = path.basename(file)
    if (filenameNoExt.slice(-4, -3) === '.') {
      filenameNoExt = filenameNoExt.slice(0, -4)
    }

    if (filename === filenameNoExt) {
      continue
    }

    let cmd = `mv "/output/${filenameNoExt}/*" "/output/${filename}"`
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
}


let processSinglePDF = async function (file) {
  let filename = path.basename(file)
  // let dirname = path.dirname(file)
  let filenameNoExt = filename
  if (filenameNoExt.endsWith('.pdf')) {
    filenameNoExt = filenameNoExt.slice(0, -4)
  }

  let outputFolder = `/output/${filenameNoExt}/`
  fs.mkdirSync(outputFolder, {recursive: true})

  let result
  let cmd = `pdfimages "${file}" -png "${outputFolder}"`
  console.log(cmd)
  try {
    result = await ShellExec(cmd)
  }
  catch (e) {
    console.error(e)
  }

  prependFilenameInFolder(filenameNoExt, outputFolder)
}

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
  
  let cmd = `unzip "${file}" -d "${outputDocFolder}"`
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
  if (fs.existsSync(`${outputDocFolder}/Pictures/`)) {
    cmd = `mv "${outputDocFolder}/Pictures/"* "${outputFolder}"`
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
}

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

main()
