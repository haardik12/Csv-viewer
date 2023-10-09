const fs = require('fs')
const csvParser = require('csv-parser')
const CSV = require('../models/csvSchema');
const path = require('path')

module.exports.create = async function (req, res) {
    try {
      // file is not present
      if (!req.file) {
        return res.status(400).send('No files were uploaded.')
      }
      // file is not csv
      if (req.file.mimetype != 'text/csv') {
        return res.status(400).send('Select CSV files only.')
      }
      // console.log(req.file);
      let file = await CSV.create({
        fileName: req.file.originalname,
        filePath: req.file.path,
        file: req.file.filename,
      })
      return res.redirect('/')
    } catch (error) {
      console.log('Error in uploading', error)
      res.status(500).send('Internal server error')
    }
}

module.exports.view = async function (req, res) {
  try {
    // console.log(req.params);
    let csvFile = await CSV.findOne({ file: req.params.id })

    const page = req.query.page || 1
    const perPage = 100

    const results = []
    const header = []
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFile.filePath)
        .pipe(csvParser())
        .on('headers', (headers) => {
          headers.forEach((head) => {
            header.push(head)
          })
        })
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject)
    })
    // Calculate pagination values
    const totalRecords = results.length
    const totalPages = Math.ceil(totalRecords / perPage)

    // Apply pagination to the data array
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedData = results.slice(startIndex, endIndex)

    res.render('file_view', {
      title: 'File Viewer',
      fileName: csvFile.fileName,
      head: header,
      data: paginatedData,
      length: paginatedData.length,
      totalPages,
      currentPage: page,
    })
  } catch (error) {
    console.log('Error in file controller', error)
    res.status(500).send('Internal server error')
  }
}

module.exports.delete = async function (req, res) {
  try {
    // console.log(req.params);
    let isFile = await CSV.findOne({ file: req.params.id })

    if (isFile) {
      await CSV.deleteOne({ file: req.params.id })
      return res.redirect('/')
    } else {
      console.log('File not found')
      return res.redirect('/')
    }
  } catch (error) {
    console.log('Error in deleting', error)
    return
  }
}