import request from '../utils/request'

export function doDeployBind(deployPlanId, deviceCHId, data) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/deploymentdesigndetails/devices/' + deviceCHId,
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

export function getDeployComLists(deployPlanId, deviceId, userData) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/deploymentdesigndetails/devices/' + deviceId,
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

export function deleteBind(id, userData) {
  return request({
    url: 'deploymentdesigns/deploymentdesigndetails/' + id,
    method: 'delete',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

