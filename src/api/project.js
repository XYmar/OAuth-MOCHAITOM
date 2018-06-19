import request from '../utils/request'

export function projectList(userData) {
  return request({
    url: '/projects',
    method: 'get',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function createProject(userData, data) {
  return request({
    url: '/projects',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    data
  })
}

export function updateProject(userData, data, id) {
  return request({
    url: '/projects/' + id,
    method: 'patch',
    auth: {
      username: userData.username,
      password: userData.password
    },
    data
  })
}

export function deleteProject(userData, id) {
  return request({
    url: '/projects/' + id,
    method: 'delete',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}
