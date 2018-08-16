<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <!--<error-log class="errLog-container right-menu-item"></error-log>-->

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <span style="font-weight: 400 !important;color: #97a8be;line-height: 50px;position: relative;top: -13px;">
          {{selectedProName}}
      </span>


      <!--<lang-select class="international right-menu-item"></lang-select>
      <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>-->

      <!--<el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="component-item proImg">
          <pan-thumb class="proImg" width="40px" height="40px" image="https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191">
            项目
          </pan-thumb>
          <i class="el-icon-caret-bottom proIcon"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-select
            @focus="onFocus"
            v-model="selected"
            filterable
            remote
            allow-create
            default-first-option
            placeholder="选择或创建项目"
            @change="changePro">
            <el-option
              v-for="item in list"
              :key="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-dropdown-menu>
      </el-dropdown>-->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" src="./2.jpg">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/dashboard/dashboard">
            <el-dropdown-item>
              <span>首页</span>
            </el-dropdown-item>
          </router-link>
          <router-link to="/projectManage">
            <el-dropdown-item divided>
              <span>项目管理</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span v-if="role === 'admin'" style="display:block;">
              <router-link to="/user_manage">用户管理</router-link>
            </span>
            <span v-else @click="handleModifyPassword" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--普通用户修改密码-->
      <el-dialog title="修改密码" :visible.sync="modifyPasswordVisible" width="40%">
        <el-form :model="form" ref="modifyPassForm" :rules="modifyRules" style="width: 80%; margin:0 auto;">
          <!--<el-form-item label="原密码" :label-width="formLabelWidth">
            <el-input type="password" v-model="form.passwordOld" auto-complete="off"></el-input>
          </el-form-item>-->
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="passwordNew">
            <el-input :type="passwordType" v-model="form.passwordNew" auto-complete="off"></el-input>
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eye" />
            </span>
          </el-form-item>
          <el-form-item label="再次输入" :label-width="formLabelWidth" prop="passwordAgain">
            <el-input :type="passwordTypeAgain" v-model="form.passwordAgain" auto-complete="off"></el-input>
            <span class="show-pwd" @click="showPwdAgain">
              <svg-icon icon-class="eye" />
            </span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modifyPasswordVisible = false">取 消</el-button>
          <el-button :disabled="this.btnConfirm" type="primary" @click="modifyPassword">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-menu>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { isvalidPwd } from '@/utils/validate'
  import PanThumb from '@/components/PanThumb'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import LangSelect from '@/components/LangSelect'
  import ThemePicker from '@/components/ThemePicker'
  import { projectList, createProject } from '@/api/project'
  import { updateUser } from '@/api/getUsers'
  /* eslint-disable */
  export default {
    components: {
      PanThumb,
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      LangSelect,
      ThemePicker
    },
    data() {
      /*const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入正确的密码,至少六位！'))
        } else {
          callback()
        }
      }

      const validatePasswordAgain = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入正确的密码,至少六位！'))
        } else if(this.form.passwordAgain !== this.form.passwordNew) {
          callback(new Error('两次密码输入不一致，请再次输入新密码！'))
        } else {
          callback()
        }
      }*/
      const validatePassword = (rule, value, callback) => {
        if (!isvalidPwd(value)) {
          callback(new Error('密码必须是6-16位数字和字母的组合！'))
          this.btnConfirm = true
          this.passwordValidate = false
        } else {
          callback()
          this.passwordValidate = true
          if(this.passwordValidate && this.pasAgainValidate) {
            this.btnConfirm = false
          }
        }

      }
      const validatePasswordAgain = (rule, value, callback) => {
        if (!isvalidPwd(value)) {
          callback(new Error('密码必须是6-16位数字和字母的组合！'))
          this.btnConfirm = true
          this.pasAgainValidate = false
        } else if(this.form.passwordAgain !== this.form.passwordNew) {
          this.btnConfirm = true
          this.pasAgainValidate = false
          callback(new Error('两次密码输入不一致，请再次输入新密码！'))
        } else {
          callback()
          this.pasAgainValidate = true
          if(this.passwordValidate && this.pasAgainValidate) {
            this.btnConfirm = false
          }
        }
      }
      return {
        list: null,
        role: '',
        userId: '',
        total: null,
        listLoading: true,
        proName: '',
        selectedProName: '',
        selected: '',
        dialogFormVisible: false,
        modifyPasswordVisible: false,
        passwordType: 'password',
        passwordTypeAgain: 'password',
        btnConfirm: false,
        passwordValidate: false,
        pasAgainValidate: false,
        form: {
          passwordNew: '',
          passwordAgain: ''
        },
        formLabelWidth: '100px',
        temp: {
          id: '',
          name: '',
          description: ''
        },
        modifyRules: {
          passwordNew: [{ required: true, trigger: 'blur', validator: validatePassword }],
          passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }]
        },
        projectLength: 0,
        projectExist: true,
        userData:{
          username: '',
          password: ''
        }
      }
    },
    created() {
      this.role = this.$store.getters.roles
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.userId = this.getCookie('userId')
      this.selectedProName = decodeURI(this.getCookie('projectName'))
      //this.getList()
    },
    computed: {
      listenProLength() {
        return this.$store.state.app.projectNum
      },
      listenProExist(){
        return this.$store.state.app.projectExist

      },
      listenProName () {
        return this.getCookie('projectName')
      },
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'roles'
      ])
    },
    watch: {
      listenProLength: function(a,b) {
        this.getList()
      },
      listenProExist: function(a,b) {
        this.getList()
      },
      listenProName: function(a,b) {
        this.selectedProName =  this.getCookie('projectName')
      }
    },
    methods: {
      onFocus() {
        this.getList()
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      showPwdAgain() {
        if (this.passwordTypeAgain === 'password') {
          this.passwordTypeAgain = ''
        } else {
          this.passwordTypeAgain = 'password'
        }
      },
      getList() {
        this.listLoading = true
        projectList(this.userData).then(response => {
          this.list = response.data.data
          this.list.value = '';
          this.total = response.data.total
          this.listLoading = false
          this.projectLength = this.list.length

          let isExist = false;
          console.log(this.selected);
          if(this.selected != ''){
            console.log("有选择项目");
            for(let i=0;i<this.list.length;i++){
              if(this.selected == this.list[i].name){   //判断显示的在现在的列表中是否存在
                isExist = true;
                return;
              }
            }

            if(!isExist){       //如果不存在
              this.selected = '';
              this.$message({
                message: '请重新选择项目',
                type: 'warning'
              });
            }
          }

        })
      },
      //下拉框选择部署设计
      changePro: function () {
        this.proName = this.selected;
        //alert(this.proId);
        //不存在则创建项目
        let isReal = false;
        let projectId = '';
        let projectName = ''
        for(let i=0;i<this.list.length;i++){
          if(this.proName == this.list[i].name){
            isReal = true;
            projectId = this.list[i].id;
            projectName = this.list[i].name
            console.log(projectId);
            let expireDays = 30;
            this.selectedProName = this.list[i].name
            this.setCookie('projectId', projectId, expireDays);
            this.setCookie('projectName',projectName)
            this.setProjectId(projectId)
            break;
          }
        }
        console.log("是否存在");
        console.log(isReal);
        if(!isReal){
          alert("hhhhh");
          let qs = require('qs');
          let data = {
            'name': this.proName,
            'description': ''
          };
          let proData = qs.stringify(data);
          createProject(this.userData, proData).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.selected = ''
            this.getList()

            this.setProjectNum(this.projectLength);
          })

        }else {
          console.log("下拉改变--------");
          console.log(this.projectExist);
          this.getList();
          this.setProjectExist(this.projectExist);

        }

      },
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      handleModifyPassword() {
        this.resetModify()
        this.modifyPasswordVisible = true
        this.$nextTick(() => {
          this.$refs['modifyPassForm'].clearValidate()
        })
      },
      resetModify () {
        this.form = {
          passwordAgain: '',
          passwordNew: ''
        }
      },
      modifyPassword() {
        this.$refs['modifyPassForm'].validate((valid) => {
          if(valid) {
            let data = {
              'password': this.form.passwordNew
            }
            var qs = require('qs');
            let datapost = qs.stringify(data)
            console.log(this.userId)
            updateUser(datapost,this.userId).then(() => {
              this.modifyPasswordVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.$store.dispatch('FedLogOut').then(() => {
                location.reload()// In order to re-instantiate the vue-router object to avoid bugs
              })
            }).catch(() => {
              this.$notify({
                title: '失败',
                message: '修改失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      ...mapMutations({
        setroles: 'SET_ROLES',
        setProjectNum: 'SET_PROJECTNUM',
        setProjectExist: 'SET_PROJECTEXIST',
        setProjectId: 'SET_PROJECTID'
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
  .proIcon {
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }
  .proImg{
    cursor: pointer;
  }
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
