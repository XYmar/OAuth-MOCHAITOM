import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, getRefreshToken, setToken, setRefreshToken, removeToken, setUserId, removeUserId, removeProId, setExpire, setExpire2, removeExpire } from '@/utils/auth'
const jwt = require('jsonwebtoken')

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    refreshToken: getRefreshToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    ipconfig: '',
    port: '',
    loginname: '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFRESHTOKEN: (state, token) => {
      state.refreshToken = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_IP: (state, ipconfig) => {
      state.ipconfig = ipconfig
    },
    SET_PORT: (state, port) => {
      state.port = port
    },
    SET_LOGINNAME: (state, loginname) => {
      state.loginname = loginname
    }
  },
  /* eslint-disable */
  actions: {
    // 用户名登录
    // 原始版本LoginByUsername
    /*LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },*/
    LoginByUsername({ commit }, formData) {
      //const username = userInfo.username.trim()
      //const qs = require('qs');

      console.log(formData);
      return new Promise((resolve, reject) => {
        /*const data = {
          'username': username,
          'password': userInfo.password
        }
        const proData = qs.stringify(data);*/
        loginByUsername(formData).then(response => {
          console.log(response)
          const access_token = response.data.access_token
          const refresh_token = response.data.refresh_token
          commit('SET_TOKEN', access_token)
          commit('SET_REFRESHTOKEN', refresh_token)
          setToken(access_token)
          setRefreshToken(refresh_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息 原始版本
    /*GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
            /!*console.log('getUserInfoError')*!/
          }
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },*/
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        /*getUserInfo(state.token).then(response => {

        }).catch(error => {
          console.log('getuserinfoerror')
          reject(error)
        })*/
        if (!state.token) { // 由于mockjs 不支持自定义状态码只能这样hack
          reject('error')
          console.log('hasNoToken')
        }
        console.log(state);
        const data = state.token
        const refreshToken = state.refreshToken
        const decodeToken = jwt.decode(data)
        const decodeRefreshToken = jwt.decode(refreshToken)
        // const dateNow = (new Date())/1000
        console.log(decodeToken, '22233')
        setUserId(decodeToken.userId)
        setExpire(decodeToken.exp)
        setExpire2(decodeRefreshToken.exp)   //refreshToken
        // console.log(dateNow)
        // const rolesset = data.username === 'admin' ? 'admin' : 'editor'
        const rolesset = decodeToken.authorities.length > 1 ? 'admin' : 'editor'
        commit('SET_ROLES', rolesset)
        /*commit('SET_NAME', data.username)
        commit('SET_AVATAR', '')
        commit('SET_INTRODUCTION', '')*/
        resolve()
      })
    },
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      console.log('FedLogOutsuccess')
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeUserId()
        removeProId()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        alert(223)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
