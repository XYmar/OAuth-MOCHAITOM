import request from '@/utils/request'
/* eslint-disable */
export function loginByUsername(data) {
  console.log(data)
  /*let indexEqu1 = proData.indexOf("=");
  let indexAnd = proData.indexOf("&");
  let indexEqu2 = proData.lastIndexOf("=");

  //用户名
  let username0 = proData.substring(indexEqu1+1,indexAnd);
  let password0 = proData.substring(indexEqu2+1,proData.length);
  console.log(indexEqu1)
  console.log(indexAnd)
  console.log(indexEqu2)

  console.log(username0)
  console.log(password0)*/
  /*const data = {
    'username': username0,
    'password': password0,
    grant_type: 'password',
    scope: 'SCOPES',
    client_id: 'OAUTH_CLIENT_ID'
  }*/
  return request({
    url: '/oauth/token',
    method: 'post',
    auth: {
      username: 'OAUTH_CLIENT_ID',
      password: 'OAUTH_CLIENT_SECRET'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}
/* 'grant_type': 'password',
  'scope': 'SCOPES',
  'client_id': 'OAUTH_CLIENT_ID'*/

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

