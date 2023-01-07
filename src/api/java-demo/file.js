import request from '@/utils/request'

const baseURL = `${process.env.VUE_APP_JAVA_DEMO_BASE_URL}/api/v1/file`

export function uploadFile(file) {
  var url = `${baseURL}/upload`
  const formData = new FormData()
  // for (let idx = 0; idx < files.length; idx++) {
  //   formData.append('files', files[idx])
  // }
  formData.append('files', file)
  return request({
    baseURL: baseURL,
    url: `/upload`,
    method: 'post',
    data: formData
  })
}

export function getFile(fileName) {
  var url = `${baseURL}/get`
  return request({
    url: url,
    method: 'post',
    params: {
      fileName: fileName
    }
  })
}