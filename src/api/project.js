import request from '../utils/request'

export function projectList() {
  return request({
    url: '/projects',
    method: 'get'
  })
}

export function projectList_user(id) {
  return request({
    url: '/users/' + id + '/projects',
    method: 'get'
  })
}

export function createProject(data) {
  return request({
    url: '/projects',
    method: 'post',
    data
  })
}

export function updateProject(data, id) {
  return request({
    url: '/projects/' + id,
    method: 'patch',
    data
  })
}

export function deleteProject(id) {
  return request({
    url: '/projects/' + id,
    method: 'delete'
  })
}
