import request from '../utils/request'

export function deployplanList(projectId, listQuery) {
  return request({
    url: 'projects/' + projectId + '/deploymentdesign',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

export function createDeployplan(data, projectId) {
  return request({
    url: 'projects/' + projectId + '/deploymentdesign',
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

export function deployplanDevice(deploymentDesignId) {
  return request({
    url: '/deploymentdesigns/' + deploymentDesignId + '/devices',
    method: 'get'
  })
}

export function getDeployDetailByDevice(deploymentDesignId, deviceid) {
  return request({
    url: '/deploymentdesigns/' + deploymentDesignId + '/deploymentdesigndetail',
    method: 'get',
    params: {
      deviceId: deviceid
    }
  })
}
