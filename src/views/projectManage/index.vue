<template>
  <div class="project-container">
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
            <el-dropdown-item>
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
      </div>
    </el-header>
    <div class="login-form" id="project-table">
      <div class="title-container">
        <h3 class="title" style="margin-bottom:30px">
          项目管理
        </h3>
        <div>
          <div class="searchContainer" style="display: inline-block;margin-bottom:16px;">
            <el-input style="width: 200px;" class="filter-item" placeholder="项目名" v-model="searchQuery">
            </el-input>
          </div>

          <el-button size="mini" type="primary"
                     v-if="this.role == 'editor'"
                     @click="handleCreate($event)"
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
        <el-table-column min-width="150px" :label="$t('table.projectName')">
          <template slot-scope="scope">
            <span class="link-type" @click="handleSelect(scope.row)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" :label="$t('table.projectDesc')">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)" :loading="scope.row.delLoading">{{$t('table.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
        background
        style="text-align: center;margin-top:20px"
      >
      </el-pagination>
    </div>
    <!--分页-->
    <!--修改/新建项目-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body width="40%">
      <el-form :rules="rules" ref="dataForm" :model="temp" style='width: 80%; margin:0 auto;'>
        <el-form-item :label="$t('table.projectName')" prop="name" :label-width="formLabelWidth">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.projectDesc')" prop="description" :label-width="formLabelWidth">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="creProLoading">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData" :loading="creProLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--普通用户修改密码-->
    <el-dialog title="修改密码" :visible.sync="modifyPasswordVisible" append-to-body width="40%">
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
        <el-button :disabled="this.btnConfirm" type="primary" @click="modifyPassword" :loading="modPasLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PanThumb from '@/components/PanThumb'
  import { isvalidPwd } from '@/utils/validate'
  import { projectList, projectList_user, createProject, updateProject, deleteProject } from '@/api/project'
  import { getUserId, updateUser } from '@/api/getUsers'
  import store from '../../store'

  /* import LangSelect from '@/components/LangSelect'*/
  /* import SocialSign from './socialsignin'*/

  /*eslint-disable*/
  export default {
    components: { PanThumb },
    name: 'login',
    data() {
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
        userId: '',
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
        searchQuery: '',
        dialogFormVisible: false,
        modifyPasswordVisible: false,
        modPasLoading: false,
        passwordType: 'password',
        passwordTypeAgain: 'password',
        btnConfirm: false,
        passwordValidate: false,
        pasAgainValidate: false,
        formLabelWidth: '100px',
        temp: {
          id: '',
          name: '',
          description: ''
        },
        form: {
          passwordNew: '',
          passwordAgain: ''
        },
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        rules: {
          name: [{ required: true, message: '请输入工程名！', trigger: 'blur' }],
          // description: [{ required: true, message: 'description is required', trigger: 'blur' }]
        },
        modifyRules: {
          passwordNew: [{ required: true, trigger: 'blur', validator: validatePassword }],
          passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }]
        },
        loading: false,
        listLoading: true,
        creProLoading: false,
        ediuserLoading: false,
        delLoading: false,
        showDialog: false,
        userData:{
          username: '',
          password: ''
        },
        token: '',
        role: '',
        errorMessage: '操作失败！'
      }
    },
    created() {
      this.role = store.getters.roles

      this.userId = this.getCookie('userId')
      this.userName = this.getCookie('username')

      this.getList()
      // this.getUserInfo()
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
      getUserInfo() {
        getUserId().then(res => {
          this.userId = res.data.data.id
          this.userName = res.data.data.username
        })
      },
      getList() {
        this.listLoading = true
        if(this.role == 'admin') {
          projectList(this.listQuery).then(response => {
            this.list = response.data.data.content
            this.listLoading = false
            this.listLength = response.data.data.length
            this.total = response.data.data.totalElements
          })
        } else if(this.role == 'editor') {
          // alert(this.userId)
          projectList_user(this.userId, this.listQuery).then(response => {
            this.list = response.data.data.content
            this.listLoading = false
            this.listLength = response.data.data.length
            this.total = response.data.data.totalElements
          })
        }

      },
      resetTemp() {
        this.temp = {
          id: '',
          name: '',
          description: ''
        }
      },
      handleCreate(event) {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        console.log(event.target)
        event.target.loading = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {        //创建项目
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          this.creProLoading = true
          if (valid) {
            let data = {
              'name': this.temp.name,
              'description': this.temp.description
            };
            let proData = qs.stringify(data);
            createProject(proData, this.userId).then(() => {
              this.creProLoading = false
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(error => {
              this.creProLoading = false
              this.errorMessage = '操作失败！'
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.selectedId = row.id;
        console.log(this.selectedId);
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.creProLoading = true
            let data = {
              'name': this.temp.name,
              'description': this.temp.description
            };

            const id = this.selectedId;
            // let beforUpdateName = '';

            console.log("改前改后-----------")


            /*for(let i=0;i<this.list.length;i++){
              if(id == this.list[i].id){
                beforUpdateName = this.list[i].name;
                console.log(beforUpdateName);
              }
            }*/

            /*console.log(this.temp.name);

            console.log(id);*/
            let proData = qs.stringify(data);
            updateProject(proData, id).then(() => {
              this.creProLoading = false
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }).catch((error) => {
              this.creProLoading = false
              this.errorMessage = '操作失败！'
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        let id = row.id;
        // this.delLoading = true
        row.delLoading = true
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProject(id).then(() => {
            // this.delLoading = false
            row.delLoading = false
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            // this.delLoading = false
            row.delLoading = false
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          // this.delLoading = false
          row.delLoading = false
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleModifyPassword() {
        this.resetModify()
        this.modifyPasswordVisible = true
        this.modPasLoading = false
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
            this.modPasLoading = true
            let data = {
              'password': this.form.passwordNew
            }
            var qs = require('qs');
            let datapost = qs.stringify(data)
            // console.log(this.userId)
            updateUser(datapost,this.userId).then(() => {
              this.modPasLoading = false
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
              this.modPasLoading = false
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
      handleSelect(row) {
        this.$store.commit('SET_PROJECTID',row.id)
        // let proName = URLEncoder.encode(row.name, 'utf-8')
        this.$store.commit('SET_PROJECTNAME',row.name)
        this.$router.push({path:'/dashboard/dashboard'})
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
      },
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      }
    },
    mounted() {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      })
    }
  }
</script>

<!--<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container {
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
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .ipContainer {
      .el-form-item.ipform{
        width:55%;
        display: inline-block;
      }
      .ipform .el-input{
        width:60%;
      }
      .colon {
        display: inline-block;
        text-align: center;
        width: 3%;
        color:#fff;
      }
      .el-form-item.portform{
        width:40%;
        display: inline-block;
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
</style>-->

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
  .project-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      height: 100%;
      position: absolute;
      left: 0;
      right: 0;
      width: 60%;
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
