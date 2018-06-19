import request from '@/utils/request'

export function UserList(query) {
  return request({
    url: 'admin/users',
    method: 'get',
    auth:{
      username: 'admin',
      password: 'admin'
    }
  })
}
export function updateUser(data,id) {
  return request({
    url: 'admin/users/'+ id + '/changepassword',
    data,
    method: 'patch',
    auth:{
      username: 'admin',
      password: 'admin'
    }
  })
}
export function deleteUser(id) {
  return request({
    url: 'admin/users/'+ id,
    method: 'delete',
    auth:{
      username: 'admin',
      password: 'admin'
    }
  })
}
export function addUser(data) {
  return request({
    url: 'users',
    method: 'post',
    params: {  //get请求在第二个位置，post在第三个位置
      isAdmin: false
    },
    auth:{
      username: 'admin',
      password: 'admin'
    },
    data
  })
}
