import Vue from 'vue'
import uploader from 'vue-simple-uploader'
import axios from 'axios'
Vue.prototype.$axios = axios;
/* eslint-disable */
Vue.use(uploader)

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import Stomp from 'stompjs'
import SockJS from 'sockjs-client'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
/*import './mock' */// simulation data

import '@/ztree/js/jquery-1.4.4.min.js'
import '@/ztree/js/jquery.ztree.core.js'
import '@/ztree/js/jquery.ztree.exedit.js'
import '@/ztree/js/jquery.ztree.exhide.js'

import * as filters from './filters' // global filters
import '@/ztree/js/jquery-1.4.4.min.js'
import '@/ztree/js/jquery.ztree.core'
import '@/ztree/js/jquery.ztree.excheck'

// add
Vue.prototype.GLOBAL = global

Vue.prototype.getIP = function() {
  let ip = 'http://' + this.getCookie('ip') + ":" + this.getCookie('port') + '/'
  return ip
};

//设置cookie
Vue.prototype.setCookie = (c_name, value, expiredays) => {
  let exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
};

//获取cookie、
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
export function getCookies(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
Vue.prototype.getCookie = getCookie;
//删除cookie
Vue.prototype.delCookie =(name) => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function setCookieArr(searchWord, val){
  var value = val;
  var arr = document.cookie.match(new RegExp('(^| )' + searchWord + '=([^;]*)(;|$)'));
  var expiryday = new Date();
  expiryday.setTime(expiryday.getTime() + 60 * 60 * 24 * 30 *6 *1000);
  if (arr) {
    var cookieContext=unescape(arr[2]);
    cookieContext+="&"+escape(value); //escape() 编码 　　　　
    document.cookie = searchWord + '=' + escape(cookieContext) + '; expires=' + expiryday.toGMTString() + ";path=/";
  } else {
    document.cookie = searchWord + '=' + escape(value) + '; expires=' + expiryday.toGMTString() + ";path=/";
  }
}

function getCookieArr(searchWord) {
  var arr = document.cookie.match(new RegExp("(^| )" + searchWord + "=([^;]*)(;|$)"));
  if (arr != null) {
    var cookieContext=unescape(arr[2]);
    var cookieArr=cookieContext.split('&');
    var tmp = [];
    for(var i in cookieArr){
      if(tmp.indexOf(cookieArr[i])==-1) {
        tmp.push(cookieArr[i]);
      }
    }
  }
  return tmp;
}

Vue.prototype.setCookieArr = setCookieArr;
Vue.prototype.getCookieArr = getCookieArr;

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
