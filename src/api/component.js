import request from '../utils/request'

export function compList(userData) {
  return request({
    url: '/components',
    method: 'get',
    params: {
      isShowHistory: false
    },
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function createComp(userData, data) {
  return request({
    url: '/components',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function updateComp(userData, data, id) {
  return request({
    url: '/components/' + id + '/update',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    data
  })
}

export function copyComp(userData, data, id) {
  return request({
    url: '/components/' + id + '/copy',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function importComp(userData, data) {
  return request({
    url: '/components/import',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function deleteComp(userData, id) {
  return request({
    url: '/components/' + id,
    method: 'delete',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function compSingle(userData, id) {
  return request({
    url: '/components/' + id,
    method: 'get',
    auth: {
      username: userData.username,
      password: userData.password
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}
