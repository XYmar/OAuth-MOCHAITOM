import request from '../utils/request'

export function logList(proId, listQuery) {
  return request({
    url: '/projects/' + proId + '/deploylog',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

export function logSearchList(searchObj) {
  return request({
    url: '/deploylogs',
    params: searchObj,
    method: 'get',
    auth: {
      username: 'admin',
      password: 'admin'
    }
  })
}
