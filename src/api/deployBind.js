import request from '../utils/request'

export function doDeployBind(deployPlanId, data) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/deploymentdesigndetail',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function getDeployComLists(deployPlanId, deviceId) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/deploymentdesigndetail',
    method: 'get',
    params: {
      'deviceId': deviceId
    },
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

