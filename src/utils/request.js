/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
/*import { Confirm } from 'element-ui'*/
import store from '@/store'
import MessageBox from '../../static/tinymce4.7.5/tinymce.min'
import { getToken, getRefreshToken, getIp, getPort, getExpire, getExpire2, removeExpire } from '@/utils/auth'
// create an axios instance
let ip_set = store.getters.ipconfig
let port = store.getters.port
let config_set = 'http://' + ip_set + ':' + port
let ipConfig = getIp()
let portConfig = getPort()
let serviceConfig = 'http://' + ipConfig + ':' + portConfig

let timeStamp = getExpire()
let refreshTimeStamp = getExpire2()
let qs = require('qs')
const service = axios.create({
  /* baseURL: process.env.BASE_API,*/
  /* baseURL: serviceConfig*/
  baseURL: serviceConfig // api的base_url
  /* baseURL: "http://192.168.0.107:9090",*/// api的base_url

})

// request interceptor
service.interceptors.request.use(config => {

  /* else if (timeStamp < (new Date()) / 1000) {      //过期则刷新token
     console.log("过期了----------");
     let formData = qs.stringify({
       'grant_type': 'refresh_token',
       'scope': 'SCOPES',
       'client_id': 'OAUTH_CLIENT_ID',
       'enctype': 'OAUTH_CLIENT_ID',
       'client_secret': 'OAUTH_CLIENT_SECRET',
       'Authorization': 'Bearer' + getToken(),
       'refresh_token': getRefreshToken()
     })
     /!*http://localhost/oauth/token?grant_type=refresh_token&refresh_token=fbde81ee-f419-42b1-1234-9191f1f95be9
     &client_id=demoClientId&client_secret=demoClientSecret*!/
     axios({
       method: 'get',
       url: service.defaults.baseURL + '/oauth/token',
       params: {
         'grant_type': 'refresh_token',
         'client_id': 'OAUTH_CLIENT_ID',
         'client_secret': 'OAUTH_CLIENT_SECRET',
         'refresh_token': getRefreshToken()
       }
     }).then(function(res) {
       alert('获取了新的token---')
       // resolve()
     }).catch(() => {
       alert('未能获取新的token---')
     })
   }*/

  // Do something before request is sent
  if (store.getters.token) {
    config.headers['Authorization'] = 'Bearer' + getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }


  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  // response => response,
  response => {
    timeStamp = getExpire()
//判断是否超过刷新token
    console.log("时间比较-----------")
    console.log(timeStamp)
    console.log(new Date() /1000)
    /*if (refreshTimeStamp < (new Date() /1000)) {       //超过刷新token则重新登录*/
    if (timeStamp && timeStamp < (new Date()) / 1000){      //目前是让过期就回到登录页面
      console.log("超过刷新token了，重新登录----------");
      /*this.$confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      })*/
      Vue.prototype.$confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeExpire('timeStamp')
        store.dispatch('FedLogOut').then(() => {
          location.reload();// 为了重新实例化vue-router对象 避免bug
        });
      })
    }
    // return Promise.reject(error)
    return response
  },
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
    //  const res = response.data;
    //     if (res.code !== 20000) {
    //       Message({
    //         message: res.message,
    //         type: 'error',
    //         duration: 5 * 1000
    //       });
    //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //           confirmButtonText: '重新登录',
    //           cancelButtonText: '取消',
    //           type: 'warning'
    //         }).then(() => {
    //           store.dispatch('FedLogOut').then(() => {
    //             location.reload();// 为了重新实例化vue-router对象 避免bug
    //           });
    //         })
    //       }
    //       return Promise.reject('error');
    //     } else {
    //       return response.data;
    //     }
  error => {
    if(error.response.data.error_description&&error.response.data.error_description.indexOf('Access token expired') >= 0){
      Vue.prototype.$confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeExpire('timestamp')
        store.dispatch('FedLogOut').then(() => {
          location.reload();// 为了重新实例化vue-router对象 避免bug
        });
      })
    }
    console.log('err' + error)// for debug
    /*  Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })*/
    return Promise.reject(error)
  })

export default service
