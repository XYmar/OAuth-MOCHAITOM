import request from '@/utils/request'

export function getCompCounts(id) {
  return request({
    url: '/projects/' + id + '/component/counts',
    method: 'get',
    params: {
      deleted: false
    }
  })
}

export function getDeviceCounts(id) {
  return request({
    url: '/projects/' + id + '/devices/counts',
    method: 'get',
    params: {
      deleted: false
    }
  })
}

export function getDeployDesignCounts(id) {
  return request({
    url: '/projects/' + id + '/deploymentdesign/counts',
    method: 'get',
    params: {
      deleted: false
    }
  })
}
