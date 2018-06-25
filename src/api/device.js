import request from '../utils/request'

export function getDevices(proId) {
  return request({
    url: '/projects/' + proId + '/devices',
    method: 'get'
  })
}

export function saveDevices(proId, data) {
  return request({
    url: '/projects/' + proId + '/devices',
    method: 'post',
    data
  })
}

export function deleteDevice(id) {
  return request({
    url: '/devices/' + id,
    method: 'delete'
  })
}

export function updateDevice(id, data) {
  return request({
    method: 'PATCH',
    url: '/devices/' + id,
    /* async: true,
    crossDomain: true*/
    /* headers: {
      'content-type': 'application/json'
    },*/
    data
  })
}

export function copyDevices(data, id) {
  return request({
    url: '/devices/' + id + '/copy',
    method: 'post',
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
    }
  })
}

export function getProcess(id, userData) {
  return request({
    url: '/devices/' + id + '/tasks',
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function reportDevices(proId, userData, data) {
  return request({
    url: '/projects/' + proId + '/devices',
    method: 'post',
    data
  })
}
