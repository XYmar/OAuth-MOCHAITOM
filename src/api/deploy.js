import request from '../utils/request'

export function doDeploy(deployPlanId, id) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/devices/' + id + '/deploy',
    method: 'put',
    params: 'TCP'
  })
}
