import request from '../utils/request'

export function doDeploy(deployPlanId, id, data) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/device/' + id + '/deploy',
    method: 'put',
    data
  })
}
export function getDeployDevice(deployPlanId, listQuery) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/devices',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}
