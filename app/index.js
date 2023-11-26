// const ShellExec = require('./lib/ShellExec')
const GetFiles = require('./lib/GetFiles')
// const isColab = require('./lib/isColab')

// const isDirectory = require('./lib/isDirectory')

// const path = require('path')
// const fs = require('fs')

const processDocument = require('./processDocument')

let main = async function () {
  let files = GetFiles()

  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    await processDocument(file, processDocument)
  }
}

main()
