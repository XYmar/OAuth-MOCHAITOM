<template>
  <div class="login-container1">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{$t('login.register')}}</h3>
      </div>
      <div class="ipContainer">
        <el-form-item prop="ipConfig" class="ipform">
          <span class="svg-container svg-container_ip">
            <svg-icon icon-class="IP" />
          </span>
          <el-input name="ipConfig" type="text" v-model="loginForm.ipConfig" autoComplete="on" placeholder="IP地址" />
        </el-form-item>
        <!--<span class="colon">:</span>-->
        <el-form-item prop="port" class="portform">
          <span class="svg-container">
            <svg-icon icon-class="port" />
          </span>
          <el-input name="port" type="text" v-model="loginForm.port" autoComplete="on" placeholder="端口号" />
        </el-form-item>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" id="hasUser" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="registerUser" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item prop="againPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordTypeAgin" @keyup.enter.native="registerUser" v-model="loginForm.againPassword" autoComplete="on" placeholder="再次输入密码" />
        <span class="show-pwd" @click="showPwdAgin">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="registerUser">注册</el-button>
      <div class="register-container">
        <span class="register-tips">已有账号？</span>
        <span class="register-btn" @click="jumpToLogin">登录</span>
      </div>
      <!--<div class="tips">
        <span>{{$t('login.username')}} : admin</span>
        <span>{{$t('login.password')}} : {{$t('login.any')}}</span>
      </div>-->
      <!--  <div class="tips">
          <span style="margin-right:18px;">{{$t('login.username')}} : editor</span>
          <span>{{$t('login.password')}} : {{$t('login.any')}}</span>
        </div>-->

      <!--<el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{$t('login.thirdparty')}}</el-button>-->
    </el-form>

    <!--
        <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
          {{$t('login.thirdpartyTips')}}
          <br/>
          <br/>
          <br/>
          <social-sign />
        </el-dialog>
    -->

  </div>
</template>

<script>
  import { isvalidUsername, isvalidPwd } from '@/utils/validate'
  import { addUser, UserIfExist } from '../../api/getUsers'
  import service from '@/utils/request'

  /* import LangSelect from '@/components/LangSelect'*/
  /* import SocialSign from './socialsignin'*/

  /*eslint-disable*/
  export default {
    /* components: { LangSelec },*/
    name: 'register',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('账号必须是5-15位的英文字母或数字！'))
        } else {
          service.defaults.baseURL = 'http://' + this.loginForm.ipConfig + ':' + this.loginForm.port
          UserIfExist(this.loginForm.username).then((res) => {
            if(res.data.data) {
              callback(new Error('用户已存在'))
            }else {
              callback()
            }
          }).catch(() => {
            callback()
          })
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('密码不能为空！'))
        } else if (!isvalidPwd(value)) {
          callback(new Error('密码必须是6-16位数字和字母的组合！'))
        } else {
          callback()
        }
      }
      const validatePasswordAgain = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请再次输入密码！'))
        } else if (this.loginForm.againPassword !== this.loginForm.password) {
          callback(new Error('两次输入的密码不一致！'))
        } else {
          callback()
        }
      }
      return {
        ifExist: false,
        loginForm: {
          ipConfig: '192.168.0.117',
          port: '8080',
          username: '',
          password: '',
          againPassword: ''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
          againPassword: [{required: true, trigger: 'blur', validator: validatePasswordAgain}]
        },
        passwordType: 'password',
        passwordTypeAgin: 'password',
        loading: false,
        showDialog: false
      }
    },
    methods: {
      jumpToLogin() {
        this.$router.replace('/login')
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      showPwdAgin() {
        if (this.passwordTypeAgin === 'password') {
          this.passwordTypeAgin = ''
        } else {
          this.passwordTypeAgin = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      hasUser() {
        let username = this.loginForm.username
        UserIfExist(username).then(response => {
          console.log("A")
          this.ifExist = response.data.data
          // console.log(ifExist);
        })
      },
      registerUser: function () {
        service.defaults.baseURL = 'http://' + this.loginForm.ipConfig + ':' + this.loginForm.port
        this.$refs['loginForm'].validate((valid) => {
          if(valid) {
            this.loading = true
            let qs = require('qs');
            let data = {
              'username': this.loginForm.username,
              'password': this.loginForm.password
            }
            let datapost = qs.stringify(data)
            addUser(datapost).then(() => {
              this.$notify({
                title: '成功',
                message: '注册成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.replace('/login')
            }).catch(() => {
              this.loading = false
              this.$notify({
                title: '失败',
                message: '注册失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      }
      /*registerUser: function () {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            var qs = require('qs')
            let data = {
              'username': this.loginForm.username,
              'password': this.loginForm.password
            }
            let datapost = qs.stringify(data)
            let ip = this.loginForm.ipConfig
            let port = this.loginForm.port
            // service.defaults.baseURL = 'http://' + ip + ':' + port
            let ipPort = 'http://' + ip + ':' + port + '/'
            this.$axios.post(ipPort + 'users', datapost, {
              headers: {
                "content-type": "application/x-www-form-urlencoded"
              }
            }).then(() => {
              this.$notify({
                title: '成功',
                message: '注册成功',
                type: 'success',
                duration: 2000
              })
              this.$router.replace('/login')
            })
          }
        })
      }*/
    },
    created() {
      if(this.getCookie('ip')) {
        this.loginForm.ipConfig = this.getCookie('ip')
      }
      if(this.getCookie('port')) {
        this.loginForm.port = this.getCookie('port')
      }
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container1{
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $light_gray !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      // color: #454545;
      color: $light_gray;
    }
    .ipContainer {
      .el-form-item.ipform{
        width:55%;
        display: inline-block;
      }
      .ipform .el-input{
        width:60%;
      }
      /*.colon {
        display: inline-block;
        text-align: center;
        min-width: 3%;
        color:#fff;
      }*/
      .el-form-item.portform{
        width:40%;
        display: inline-block;
        float: right;
      }
      .portform .el-input{
        width:40%
      }
    }
  }
  .register-container{
    text-align: center;
    font-size: 14px;
    color:$light_gray;
    .register-tips{
      margin-right: 4px;
    }
    .register-btn{
      color:#36a3f7;
      cursor: pointer;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container1 {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .ipContainer {
      .colon {
        display: inline-block;
        text-align: center;
        // width: 3%;
        color:#fff;
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login,&_ip {
        font-size: 20px;
      }
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
</style>
