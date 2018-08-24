import request from '../utils/request'

export function compList(proId, listQuery) {
  return request({
    url: '/projects/' + proId + '/component',
    method: 'get',
    params: {
      // isShowHistory: false,
      deleted: false,
      size: listQuery.limit,
      page: listQuery.page
    }
  })
}

export function compListHistory(proId, listQuery) {
  return request({
    url: '/projects/' + proId + '/component',
    method: 'get',
    params: {
      deleted: true,
      size: listQuery.limit,
      page: listQuery.page
    }
  })
}

export function createComp(proId, data) {
  return request({
    url: '/projects/' + proId + '/component',
    method: 'post',
    headers: {
      // 'Content-Type': 'multipart/form-data'
      // 'content-type': 'application/json'
      'content-type': 'application/x-www-form-urlencoded'
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

// 组件管理
// savefiles
export function saveFiles(id, data) {
  return request({
    url: '/components/' + id + '/componentfiles/savefile',
    method: 'post',
    headers: {
      // 'content-type': 'application/x-www-form-urlencoded'
      'content-type': 'application/json'
    },
    data
  })
}
// saveFolder
export function saveFolder(id, data) {
  return request({
    url: '/components/' + id + '/componentfiles/savefolder',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

// getfiles
export function getCompFiles(id, parent) {
  return request({
    url: '/components/' + id + '/componentfiles',
    method: 'get',
    params: {
      parentnodeid: parent
    }
  })
}
// deletefiles
export function deleteCompFiles(id) {
  return request({
    url: '/componentfiles/' + id,
    method: 'delete'
  })
}
// exportfiles
export function exportCompFiles(id) {
  return request({
    url: '/componentfiles/' + id + '/export',
    method: 'get'
  })
}
// uploadFoldder
export function uploadFolder(id, data) {
  return request({
    url: '/components/' + id + '/componentfiles/uploadfolder',
    method: 'post',
    data
  })
}
// moveFileTo
export function movefileTo(FileId, targetId, data) {
  return request({
    url: '/componentfiles/' + FileId + '/moveto',
    method: 'patch',
    data
  })
}
// copyFileTo
export function copyFileTo(FileId, targetId, data) {
  return request({
    url: '/componentfiles/' + FileId + '/copyto',
    method: 'patch',
    data
  })
}
// renameFile
export function renameFile(FileId, data) {
  return request({
    url: '/componentfiles/' + FileId + '/rename',
    method: 'patch',
    data
  })
}

// 回收站
// 恢复已删除组件
export function restoreCom(comId) {
  return request({
    url: '/components/' + comId + '/restore',
    method: 'patch'
  })
}

// 清除已删除组件
export function cleanCom(comId) {
  return request({
    url: '/components/' + comId + '/clean',
    method: 'delete'
  })
}
