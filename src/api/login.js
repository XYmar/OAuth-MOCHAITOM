import request from '@/utils/request'

/*export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}*/
export function loginByUsername(username, password) {
  return request({
    url: '/users/login',
    method: 'get',
    auth:{
      username,
      password
    }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/users/login',
    method: 'get',
    auth:{
      username:'admin',
      password:'admin'
    }
    /*params: { token }*/
  })
}
// export function _getUserInfo(userInfo) {
//   return request({
//     url: '/user/login',
//     method: 'get',
//     params:{userInfo}
//   })
// }

