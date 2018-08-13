import request from '@/utils/request'
// getLogByUser
export function getLogList(id, listQuery) {
  return request({
    url: '/users/' + id + '/systemlog',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}
// getLogByAdmin
export function getLogAll(listQuery) {
  return request({
    url: '/systemlogs',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}
