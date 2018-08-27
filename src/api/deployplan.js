import request from '../utils/request'

export function deployplanList(projectId, listQuery) {
  return request({
    url: 'projects/' + projectId + '/deploymentdesign',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page,
      deleted: false
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
// 回收站
// 获取历史部署设计
export function hisDeployplan(projectId, listQuery) {
  return request({
    url: 'projects/' + projectId + '/deploymentdesign',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page,
      deleted: true
    }
  })
}
// 清除已删除部署设计
export function cleanDeployplan(id) {
  return request({
    url: '/deploymentdesigns/' + id + '/clean',
    method: 'delete'
  })
}
// 恢复已删除部署设计
export function restoreDeployplan(id) {
  return request({
    url: '/deploymentdesigns/' + id + '/restore',
    method: 'patch'
  })
}
