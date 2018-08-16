import request from '../utils/request'

export function doDeploy(deployPlanId, id, data) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/device/' + id + '/deploy',
    method: 'put',
    data
  })
}
