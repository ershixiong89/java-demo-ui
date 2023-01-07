import request from '@/utils/request'

const baseURL = `${process.env.VUE_APP_JAVA_DEMO_BASE_URL}/api/v1/db`

export function getUserList(data) {
  var url = `${baseURL}/query`
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

export function addUser(data) {
  var url = `${baseURL}/add`
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  var url = `${baseURL}/update`
  return request({
    url: url,
    method: 'put',
    data: data
  })
}

export function deleteUser(data) {
  var url = `${baseURL}/delete`
  return request({
    url: url,
    method: 'delete',
    data: data
  })
}