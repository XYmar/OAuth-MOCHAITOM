<template>
  <div class="userManage-container">
    <el-header>
      <div class="right-menu">
        <span calss="userName" style="position: relative;top: -12px;color: #fff;">{{userName}}</span>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <pan-thumb class="proImg" width="40px" height="40px" image="./2/jpg">
            </pan-thumb>
            <!--<img class="user-avatar" src="./2.jpg">-->
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/projectManage">
              <el-dropdown-item>
                <span style="display:block;">项目管理</span>
              </el-dropdown-item>
            </router-link>
            <!--<el-dropdown-item>
              <span v-if="role === 'admin'" style="display:block;">用户管理</span>
              <span v-else @click="modifyPasswordVisible = true" style="display:block;">修改密码</span>
            </el-dropdown-item>-->
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <div class="login-form">
      <div class="title-container">
        <h3 class="title" style="margin-bottom:30px">
          用户管理
        </h3>
        <div>
          <div class="searchContainer" style="display: inline-block;margin-bottom:16px;">
            <el-input style="width: 200px;" class="filter-item" placeholder="用户名" v-model="searchQuery">
            </el-input>
          </div>
          <el-button size="mini" type="primary"
                     @click="handleCreate"
                     style="float:right;margin-top:2px;">添加
          </el-button>
        </div>
      </div>
      <el-table :key='tableKey'
                :data="listA"
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                fit
                highlight-current-row
                height="65%"
                style="width: 100%;border-radius:8px;">
        <el-table-column min-width="150px" :label="$t('table.username')">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)" :loading="scope.row.delLoading" v-if="scope.row.authorities.length === 1">{{$t('table.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
        background
        style="text-align: center;margin-top:20px"
      >
      </el-pagination>
    </div>
    <!--修改用户-->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisible" append-to-body width="40%">
      <el-form :rules="modifyRules" ref="modifyDataForm" :model="form" label-width="100px" style='width:80%; margin:0 auto;'>
        <el-form-item label="新密码" prop="passwordNew">
          <el-input v-model="form.passwordNew" :type="passwordType"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item label="再次输入" prop="passwordAgain">
          <el-input v-model="form.passwordAgain" :type="passwordTypeAgain"></el-input>
          <span class="show-pwd" @click="showPwdAgain">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button :disabled="this.btnConfirm" type="primary" @click="updateUser" :loading="modLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--创建用户-->
    <el-dialog title="添加用户" :visible.sync="createUserFormVisible" append-to-body width="40%">
      <el-form :rules="rules" ref="createDataForm" :model="createForm" label-width="100px" style='width: 400px; margin:0 auto;'>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="createForm.username" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" :type="passwordType"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item label="再次输入" prop="passwordAgain">
          <el-input v-model="createForm.passwordAgain" :type="passwordTypeAgain"></el-input>
          <span class="show-pwd" @click="showPwdAgain">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createUserFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button :disabled="this.btnConfirm" type="primary" @click="createUser" :loading="addLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PanThumb from '@/components/PanThumb'
  import { isvalidUsername, isvalidPwd } from '@/utils/validate'
  import { UserList, updateUser, deleteUser, addUser } from '@/api/getUsers'
  import store from '../../store'

  /* import LangSelect from '@/components/LangSelect'*/
  /* import SocialSign from './socialsignin'*/

  /*eslint-disable*/
  export default {
    components: { PanThumb },
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入用户名！'))
        } else {
          callback()
        }
      }
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
        } else if(this.createForm.passwordAgain !== this.createForm.password) {
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

      const validateModifyPasAg = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入正确的密码,至少六位！'))
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
        userName: '',
        selectedId: '',
        tableKey: 0,
        list: [],
        listQuery: {
          page: 0,
          size:10,
          limit: 5,
          tagname: ''
        },
        total: null,
        pagesize:10,//每页的数据条数
        currentPage:1,//默认开始页面
        dialogFormVisible: false,
        createUserFormVisible: false,
        modifyPasswordVisible: false,
        addLoading: false,
        modLoading: false,
        delLoading: false,
        passwordType: 'password',
        passwordTypeAgain: 'password',
        btnConfirm: false,
        passwordValidate: false,
        pasAgainValidate: false,
        formLabelWidth: '100px',
        searchQuery: '',
        temp: {
          id: '',
          name: '',
          description: ''
        },
        form: {
          passwordAgain: '',
          passwordNew: ''
        },
        createForm: {
          username: '',
          password: '',
          passwordAgain: ''
        },
        rules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }]
        },
        modifyRules: {
          passwordNew: [{ required: true, trigger: 'blur', validator: validatePassword }],
          passwordAgain: [{ required: true, trigger: 'blur', validator: validateModifyPasAg }]
        },
        loading: false,
        listLoading: true,
        showDialog: false,
        userData:{
          username: '',
          password: ''
        },
        token: '',
        role: ''
      }
    },
    created() {
      this.userName = this.getCookie('username')
      this.role = store.getters.roles
      this.getList()
    },
    methods: {
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
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      resetCreate() {
        this.createForm = {
          username: '',
          password: '',
          passwordAgain: ''
        }
      },
      resetModify () {
        this.form = {
          passwordAgain: '',
          passwordNew: ''
        }
      },
      getList() {
        this.listLoading = true
        if(this.role == 'admin') {
          UserList(this.listQuery).then(response => {
            this.list = response.data.data.content
            this.total = response.data.data.totalElements
            this.listLoading = false
            this.listLength = response.data.data.length
          })
        }
      },
      handleCreate() {
        this.resetCreate()
        this.createUserFormVisible = true
        this.$nextTick(() => {
          this.$refs['createDataForm'].clearValidate()
        })
      },
      createUser() {
        this.$refs.createDataForm.validate(valid => {
          if(valid) {
            this.addLoading = true
            var qs = require('qs');
            let data = {
              'username': this.createForm.username,
              'password': this.createForm.password
            }
            let datapost = qs.stringify(data)
            addUser(datapost).then(() => {
              this.addLoading = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.createUserFormVisible = false
            }).catch(() => {
              this.addLoading = false
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.resetModify()
        this.selectedId = row.id;
        // console.log(this.selectedId);
        // this.temp = Object.assign({}, row) // copy obj
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['modifyDataForm'].clearValidate()
        })
      },
      updateUser() {
        this.$refs['modifyDataForm'].validate((valid) => {
          if (valid) {
            this.modLoading = true
            let data = {
              password: this.form.passwordNew
            }

            const id = this.selectedId;
            let qs = require('qs');

            let userData = qs.stringify(data);
            updateUser(userData, id).then(() => {
              this.modLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.modLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '失败',
                message: '更改失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        let id = row.id;
        row.delLoading = true
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(id).then(() => {
            row.delLoading = false
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            row.delLoading = false
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          row.delLoading = false
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.pagesize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.currentPage = val
        this.getList()
      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.username.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
  .userManage-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 60%;
      height: 100%;
      padding: 0px 35px 15px 35px;
      margin: 10px auto;
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
</style>
