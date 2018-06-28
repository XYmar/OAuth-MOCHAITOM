import request from '../utils/request'

export function bindDetailList(deployplanId) {
  return request({
    url: 'deploymentdesigns/' + deployplanId + '/deploymentdesigndetails',
    method: 'get'
  })
}
