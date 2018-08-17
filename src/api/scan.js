import request from '../utils/request'

export function scanDevice(planId, deviceId) {
  return request({
    url: '/deploymentdesigns/' + planId + '/device/' + deviceId + '/scan',
    method: 'get'
  })
}
