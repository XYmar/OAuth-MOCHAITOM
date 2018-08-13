import request from '../utils/request'

export function saveDeploymentDesignSnapshots(id, data) {
  return request({
    url: '/deploymentdesigns/' + id + '/deploymentdesignsnapshot',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
// getSnapshotsByDeploymentDesign
export function getDeploymentDesignSnapshots(id) {
  return request({
    url: '/deploymentdesigns/' + id + '/deploymentdesignsnapshot',
    method: 'get'
  })
}

export function deleteDeploymentDesignSnapshots(id) {
  return request({
    url: '/deploymentdesignsnapshots/' + id,
    method: 'delete'
  })
}

export function deployDeploymentDesignSnapshots(id) {
  return request({
    url: '/deploymentdesignsnapshots/' + id + '/deploy',
    method: 'put'
  })
}

export function modifySnapshots(id, data) {
  return request({
    url: '/deploymentdesignsnapshots/' + id,
    method: 'PATCH',
    data
  })
}
