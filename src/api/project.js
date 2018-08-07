import request from '../utils/request'

export function projectList(listQuery) {
  return request({
    url: '/projects',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

export function projectList_user(id, listQuery) {
  return request({
    url: '/users/' + id + '/project',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

export function createProject(data, id) {
  return request({
    url: '/users/' + id + '/project',
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
