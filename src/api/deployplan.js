import request from '../utils/request'

export function deployplanList(projectId) {
  return request({
    url: 'projects/' + projectId + '/deploymentdesigns',
    method: 'get'
  })
}

export function createDeployplan(data, projectId) {
  return request({
    url: 'projects/' + projectId + '/deploymentdesigns',
    method: 'post',
    data
  })
}

export function updateDeployplan(data, id) {
  return request({
    url: 'deploymentdesigns/' + id,
    method: 'patch',
    data
  })
}

export function deleteDeployplan(id) {
  return request({
    url: 'deploymentdesigns/' + id,
    method: 'delete'
  })
}

export function deployplanDetailsList(deploymentDesignId) {
  return request({
    url: '/deploymentdesigns/' + deploymentDesignId + '/deploymentdesigndetails',
    method: 'get'
  })
}
