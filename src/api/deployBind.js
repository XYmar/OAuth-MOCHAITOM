import request from '../utils/request'

export function doDeployBind(deployPlanId, deviceCHId, data) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/devices/' + deviceCHId,
    method: 'put',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function getDeployComLists(deployPlanId, deviceId) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/devices/' + deviceId + '/deploymentdesigndetails',
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function deleteBind(id) {
  return request({
    url: '/deploymentdesigndetails/' + id,
    method: 'delete'
  })
}

