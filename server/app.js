const express = require('express')
const bodyParser = require('body-parser')
const uploader = require('express-fileupload')
const { extname, resolve}  = require('path')

const {existsSync, appendFileSync, writeFileSync} = require('fs')
const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(uploader())
app.listen()
app.all('*', (req, res,  next) => {
  res.header('Access-Control-Allow-origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET')
  next()
})

const ALLOWED_TYPE = {
  'video/mp4': 'mp4',
  'video/ogg': 'ogg'
}

app.post('/upload_video', (req, res) => {
  const {  name,
    type,
    size,
    fileName,
    uploadedSize} = req.body
  const {file} = req.files
  if (!file) {
    res.send({
      code: 1001,
      msg: 'No file uploaded！'
    })
    return
  }
  if (!ALLOWED_TYPE[type]) {
    res.send({
      code: 1002,
      msg: 'The type is not allowed for uploading！'
    })
    return
  }

  const filename = fileName + extname(name)
  const filePath = resolve(__dirname, './upload_temp/'+ filename)

  if (uploadedSize !== '0') {
    if (!existsSync(filePath)) {
      res.send({
        code: 1003,
        msg: 'The file is not find！'
      })
      return
    }

    appendFileSync(filePath, file.data)
    res.send({
      code: 0,
      msg: 'Appended！'
    })
    return
  }

  writeFileSync(filePath, file.data)
  res.send({
    code: 0,
    msg: 'File is created！'
  })
})
const POST = 8000;

app.listen(POST, () => {
  console.log('Server is running on' + POST)
})
