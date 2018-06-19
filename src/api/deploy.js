import request from '../utils/request'

export function doDeploy(userData, deployPlanId, id) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/devices/' + id + '/deploy',
    method: 'put',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}
