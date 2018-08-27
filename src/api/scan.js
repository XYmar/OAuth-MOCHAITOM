import request from '../utils/request'

export function scanDevice(planId, deviceId) {
  return request({
    url: '/deploymentdesigns/' + planId + '/device/' + deviceId + '/scan',
    method: 'get'
  })
}

export function scanComp(planId, deviceId, compId) {
  return request({
    url: '/deploymentdesigns/' + planId + '/device/' + deviceId + '/component/' + compId + '/scan',
    method: 'get'
  })
}

export function scanQucikByDev(planId, deviceId, extensions) {
  return request({
    url: '/deploymentdesigns/' + planId + '/device/' + deviceId + '/scan',
    method: 'get',
    params: {
      extensions: extensions
    }
  })
}

export function scanQucikByComp(planId, deviceId, compId, extensions) {
  return request({
    url: '/deploymentdesigns/' + planId + '/device/' + deviceId + '/component/' + compId + '/scan',
    method: 'get',
    params: {
      extensions: extensions
    }
  })
}
