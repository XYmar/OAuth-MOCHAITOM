import request from '../utils/request'

export function logList() {
  return request({
    url: '/deploylogs',
    method: 'get',
    auth: {
      username: 'admin',
      password: 'admin'
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
