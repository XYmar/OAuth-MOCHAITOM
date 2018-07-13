import request from '../utils/request'

export function compList(proId) {
  return request({
    url: '/projects/' + proId + '/components',
    method: 'get',
    params: {
      // isShowHistory: false,
      deleted: false
    }
  })
}

export function createComp(proId, data) {
  return request({
    url: '/projects/' + proId + '/components',
    method: 'post',
    headers: {
      // 'Content-Type': 'multipart/form-data'
      'content-type': 'application/json'
    },
    data
  })
}

export function updateComp(data, id) {
  return request({
    url: '/components/' + id,
    method: 'PATCH',
    data
  })
}

export function copyComp(data, id) {
  return request({
    url: '/components/' + id + '/copy',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function importComp(userData, data) {
  return request({
    url: '/components/import',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function deleteComp(id) {
  return request({
    url: '/components/' + id,
    method: 'delete'
  })
}

export function compSingle(id) {
  return request({
    url: '/components/' + id,
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

// 组件分类

// 获取组件分类
export function getCompTypes(id) {
  return request({
    url: '/projects/' + id + '/componenttypes',
    method: 'get'
  })
}

// 新建组件分类
export function saveCompTypes(id, data) {
  return request({
    url: '/projects/' + id + '/componenttypes',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

// 删除组件分类
export function deleteCompType(id) {
  return request({
    url: '/componenttypes/' + id,
    method: 'delete'
  })
}

// 修改组件分类
export function updateCompTypes(data, id) {
  return request({
    url: '/componenttypes/' + id,
    method: 'PATCH',
    data
  })
}

// getComById
export function getCompById(id) {
  return request({
    url: '/components/' + id,
    method: 'get'
  })
}
