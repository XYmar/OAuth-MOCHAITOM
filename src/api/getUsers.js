import request from '@/utils/request'

export function UserList() {
  return request({
    url: '/users',
    method: 'get'
  })
}
export function getUserId() {
  return request({
    url: '/users/info',
    method: 'get'
  })
}
export function updateUser(data, id) {
  return request({
    url: '/users/' + id + '/password',
    data,
    method: 'patch'
  })
}
export function deleteUser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}
export function addUser(data) {
  return request({
    url: 'users',
    method: 'post',
    data
  })
}
