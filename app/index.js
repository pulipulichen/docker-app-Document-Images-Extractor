// const ShellExec = require('./lib/ShellExec')
const GetFiles = require('./lib/GetFiles')
const isColab = require('./lib/isColab')

// const isDirectory = require('./lib/isDirectory')

const path = require('path')
const fs = require('fs')

const ShellSpawn = require('./lib/ShellExec')

const processDocument = require('./processDocument')


let main = async function () {
  let files = GetFiles()

  if (isColab) {
    await ShellSpawn(`rm -rf /output/*`)
  }

  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    await processDocument(file, processDocument)
  }

  if (isColab) {
    let output7z = '/output/output.7z'
    if (fs.existsSync(output7z)) {
      fs.unlinkSync(output7z)
    }
    await ShellSpawn(`mv /output/*/* /output/`)
    await ShellSpawn(`find /output/ -depth -type d -empty -exec rmdir {} +`)
    await ShellSpawn(`find /output/ -depth -type d -empty -exec rmdir {} +`)
    await ShellSpawn(`find /output/ -type f -name '*' -exec 7z a -r -mx=9 "${output7z}" {} +`)
  }
}

main()
