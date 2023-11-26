const isDirectory = require('./lib/isDirectory')

const processDir = require('./processDir')
const processSinglePDF = require('./processSinglePDF')
const processSingleODF = require('./processSingleODF')
const processSingleOffice = require('./processSingleOffice')

let processDocument = async function (file) {
  if (isDirectory(file)) {
    await processDir(file)
  }
  else if (file.endsWith('.pdf')) {
    await processSinglePDF(file)
  }
  else if (file.endsWith('.odt') || file.endsWith('.ods') || file.endsWith('.odp') || file.endsWith('.odg')) {
    await processSingleODF(file)
  }
  else if (file.endsWith('.docx') || file.endsWith('.xlsx') || file.endsWith('.pptx') || file.endsWith('.odg')) {
    await processSingleOffice(file)
  }
}

module.exports = processDocument