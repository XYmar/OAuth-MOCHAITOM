import request from '@/utils/request'

export function UserList(listQuery) {
  return request({
    url: '/users',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
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
    method: 'put',
    data
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
export function UserIfExist(name) {
  return request({
    url: 'users/hasusername',
    method: 'get',
    params: {
      username: name
    }
  })
}
