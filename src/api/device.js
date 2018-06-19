import request from '../utils/request'

export function getDevices(proId, userData) {
  return request({
    url: '/projects/' + proId + '/devices',
    method: 'get',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function saveDevices(proId, userData, data) {
  return request({
    url: '/projects/' + proId + '/devices',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
      /*username: 'admin',
      password: 'admin'*/
    },
    data
  })
}

export function deleteDevice(id, userData) {
  return request({
    url: '/devices/' + id,
    method: 'delete',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function updateDevice(id, userData, data) {
  return request({
    url: '/devices/' + id,
    method: 'patch',
    auth: {
      username: userData.username,
      password: userData.password
    },
    data
  })
}

export function copyDevices(data, id) {
  return request({
    url: '/devices/' + id + '/copy',
    method: 'post',
    auth: {
      username: 'admin',
      password: 'admin'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function getDisks(id, userData) {
  return request({
    url: '/devices/' + id + '/disks',
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: userData.username,
      password: userData.password
     /* username: 'admin',
      password: 'admin'*/
    }
  })
}

export function getProcess(id, userData) {
  return request({
    url: '/devices/' + id + '/tasks',
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: userData.username,
      password: userData.password
      /* username: 'admin',
       password: 'admin'*/
    }
  })
}

export function reportDevices(proId, userData, data) {
  return request({
    url: '/projects/' + proId + '/devices',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
      /*username: 'admin',
      password: 'admin'*/
    },
    data
  })
}
