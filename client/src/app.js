import {
  UPLOAD_INFO,
  ALLOWED_TYPE,
  CHUNK_SIZE, API
} from './enums'
  ;(() => {
  const oProgress = document.querySelector('#uploadProgress')
  const oUploader = document.querySelector('#videoUploader')
  const oInfo = document.querySelector('#uploadInfo')
  const oBtn = document.querySelector('#uploadBtn')

  let uploadedSize = 0
  const init = () => {
    bindEvent()
  }
  function bindEvent() {
    oBtn.addEventListener('click', uploadVideo, false)
  }

  async function uploadVideo() {
    const file = oUploader.files[0]
    if (!file) {
      oInfo.innerText = UPLOAD_INFO['NO_FILE']
      return
    }
    if (!ALLOWED_TYPE[file.type]) {
      oInfo.innerText = UPLOAD_INFO['INVALID_TYPE']
    }
    const { name, type, size} = file
    const fileName= new Date().getTime()+'_'+name;
    oProgress.max = size
    oInfo.innerText = ''
    let uploadedResult = null
    while(uploadedSize < size) {
      const fileChunk = file.slice(uploadedSize, uploadedSize + CHUNK_SIZE)
      console.log(fileChunk)
      const formData = createFormData({
        name,
        type,
        size,
        fileName,
        uploadedSize,
        file: fileChunk})
      try {
        uploadedResult = await axios.post(API.UPLOAD_VIDEO, formData)
      } catch (e) {
        oInfo.innerText = `${UPLOAD_INFO['UPLOAD_FAILED']}(${e.message})`
        return
      }
      console.log({uploadedSize})
      uploadedSize += fileChunk.size
      oProgress.value = uploadedSize
    }
    oInfo.innerText = UPLOAD_INFO['UPLOAD_SUCCESS']
    oUploader.value = null
  }

  function createFormData({
      name,
      type,
      size,
      fileName,
      uploadedSize,
      file}) {
    const fd = new FormData()

    fd.append('name', name)
    fd.append('type', type)
    fd.append('size', size)
    fd.append('fileName', fileName)
    fd.append('uploadedSize', uploadedSize)
    fd.append('file', file)

    return fd
  }
  init()
})()
