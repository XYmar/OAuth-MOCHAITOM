<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="searchQuery">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;float:right;" @click="handleCreate" type="primary" icon="el-icon-edit" v-show="!isHistory">{{$t('table.add')}}</el-button>
      <el-button type="danger" @click="showHistory" style="float: right;" icon="el-icon-delete" v-show="!isHistory">
        回收站
      </el-button>
      <el-button type="success" @click="showNow" style="float: right;" icon="el-icon-back" v-show="isHistory">
        退出回收站
      </el-button>
    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column align="center" :label="$t('table.deployPlanName')" width="200">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80" align="center" :label="$t('table.deployPlanDesc')">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="部署操作" v-if="!isHistory">
        <template slot-scope="scope">
          <!--<router-link class="pan-btn tiffany-btn" :to='{name:"deployPlanDetail",params:{id:scope.row.id}}'>查看</router-link>
          <router-link class="pan-btn light-blue-btn" :to='{name:"deploy",params:{id:scope.row.id}}'>部署</router-link>
          <router-link class="pan-btn green-btn" :to='{name:"deployBind",params:{id:scope.row.id}}'>设计</router-link>-->
          <!--<router-link :to='{name:"deployPlanDetail",params:{id:scope.row.id}}'><el-button size="mini" type="primary">查看</el-button></router-link>-->
          <router-link :to='{name:"deployBind",params:{id:scope.row.id}}' v-if="!scope.row.deleted"><el-button size="mini" type="primary">设计</el-button></router-link>
          <router-link :to='{name:"deploy",params:{id:scope.row.id}}' v-if="!scope.row.deleted"><el-button size="mini" type="success">部署</el-button></router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="200">
        <template slot-scope="scope">
          <!--<el-button size="mini" type="success">设计</el-button>-->
          <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
          <el-button size="mini" type="info">基线</el-button>-->
          <el-dropdown trigger="click" v-if="!scope.row.deleted">
            <span class="el-dropdown-link" v-if="!scope.row.virtual">
              <el-button type="success" plain>更多操作</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="handleUpdate(scope.row)">编辑</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleDelete(scope.row)">删除</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleCreateBaseline(scope.row)">新建基线</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <!--<el-popover
                  ref="popover4"
                  placement="right"
                  width="420"
                  height="400"
                  trigger="click"
                  @show="getBaslines(scope.row)">
                  <div class="filter-container">
                    <el-input style="width: 200px;" class="filter-item" placeholder="组件名" v-model="searchQuery2">
                    </el-input>
                  </div>
                  <div style="height: 425px;overflow-y: auto;margin-top: 0" id="compTab">
                    <el-table :key='tableKey' :data="baslineList" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                              highlight-current-row
                              style="width: 100%;"
                              height="380"
                              id="compTable">
                      <el-table-column label="基线名称" width="140" align="center">
                        <template slot-scope="scope">
                          <span @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column width="100px" align="center" label="基线描述">
                        <template slot-scope="scope">
                          <span>{{scope.row.version}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column min-width="100px" align="center" :label="$t('table.compSize')">
                        <template slot-scope="scope">
                          <span>{{Math.round(scope.row.size/1024/1024*100)/100}}M</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="解绑" width="80" align="center">
                        <template slot-scope="scope">
                          &lt;!&ndash;<span>{{scope.row.isBind}}</span>&ndash;&gt;
                          <el-button type="danger" icon="el-icon-delete" size="mini" circle v-if="scope.row.isBind" @click="deleteBindRelation(scope.row)"></el-button>
                        </template>
                      </el-table-column>

                    </el-table>
                  </div>
                </el-popover>-->
                <span style="display:inline-block;padding:0 10px;" @click="checkBaselines(scope.row)">基线详情</span>
              </el-dropdown-item>
              <!--<el-dropdown-item divided>-->
                <!--<span style="display:inline-block;padding:0 10px;" @click="handleMonitor(scope.row)">在线监控</span>-->
              <!--</el-dropdown-item>-->
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleMonitor(scope.row)">在线监控</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click" v-else>
            <span class="el-dropdown-link">
              <el-button type="success" plain>更多操作</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="handleClean(scope.row)">清除</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleRestore(scope.row)">恢复</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[20,50,100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total"
      background
      style="text-align: center;margin-top:20px"
    >
    </el-pagination>
    <!--<div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->
    <!--部署设计对话框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="deployRules" ref="dataForm" :model="temp" label-width="100px" style='width: 80%; margin:0 auto;'>
        <el-form-item :label="$t('table.deployPlanName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deployPlanDesc')" prop="description">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="creDepLoading">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData" :loading="upDepLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--基线新建对话框-->
    <el-dialog title="请填写基线信息" :visible.sync="baselineVisible" width="40%">
      <el-form :rules="baselineRules" ref="baselineForm" :model="baselineTemp" label-position="right" label-width="100px" style='width: 80%; margin:0 auto;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="baselineTemp.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="baselineTemp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="baselineVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="createBaseline" :loading="creBasLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--基线详情对话框-->
    <el-dialog :title="deployName" :visible.sync="baselineDetailVisible">
      <el-table :key='tableKey' :data="baslineList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">

        <el-table-column align="center" label="基线名称" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="基线描述" min-width="200">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleModifyBaseline(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteBaseline(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="baselineDetailVisible = false">关闭</el-button>-->
      </div>
    </el-dialog>
    <!--修改基线对话框-->
    <el-dialog title="请填写基线信息" :visible.sync="modifyBaselineVisible" width="40%">
      <el-form :rules="baselineRules" ref="baselineForm" :model="modifyBaselineTemp" label-position="right" label-width="70px" style='width: 80%; margin:0 auto;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="modifyBaselineTemp.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="modifyBaselineTemp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyBaselineVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="modifyBaseline" :loading="upBasLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { deployplanList, createDeployplan, updateDeployplan, deleteDeployplan, hisDeployplan, cleanDeployplan, restoreDeployplan } from '@/api/deployplan'
  import { saveDeploymentDesignSnapshots, getDeploymentDesignSnapshots, deleteDeploymentDesignSnapshots, modifySnapshots } from '@/api/baseline'
  import waves from '@/directive/waves' // 水波纹指令
  import Sortable from 'sortablejs'

  /* eslint-disable */
  export default {
    name: 'deploy-plan',
    directives: {
      waves
    },
    data() {
      return {
        isHistory: false,
        selectedId: '',
        deployName: '',
        tableKey: 0,
        list: [],
        baslineList: [],
        listLoading: true,
        listQuery: {
          page: 0,
          size:20,
          limit: 5,
          tagname: ''
        },
        total: null,
        pagesize:10,//每页的数据条数
        currentPage:1,//默认开始页面
        sortable: null,
        oldList: [],
        newList: [],
        temp: {
          id: '',
          name: '',
          description: ''
        },
        dialogFormVisible: false,
        baselineVisible: false,
        baselineDetailVisible: false,
        modifyBaselineVisible: false,
        baselineTemp: {
          id: '',
          name: '',
          description: ''
        },
        modifyBaselineTemp: {
          id: '',
          name: '',
          description: ''
        },
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        deployRules: {
          name: [{ required: true, message: '请输入部署设计名称', trigger: 'blur' }]
        },
        baselineRules: {
          name: [{ required: true, message: '请输入基线名', trigger: 'blur' }]
        },
        downloadLoading: false,
        creDepLoading: false,
        upDepLoading: false,
        creBasLoading: false,
        upBasLoading: false,
        searchQuery: '',
        errorMessage: '操作失败！'
      }
    },
    created() {
      this.isHistory = false
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;
        let projectId = this.getCookie('projectId');

        deployplanList(projectId, this.listQuery).then(response => {
          this.isHistory = false
          this.list = response.data.data.content
          this.total = response.data.total
          this.listLoading = false
          this.listLength = response.data.data.length
          this.total = response.data.data.totalElements
        })
      },
      getHis() {
        this.listLoading = true;
        let projectId = this.getCookie('projectId');

        hisDeployplan(projectId, this.listQuery).then(response => {
          this.isHistory = true
          this.list = response.data.data.content
          this.total = response.data.total
          this.listLoading = false
          this.listLength = response.data.data.length
          this.total = response.data.data.totalElements
        })
      },
      getBaslines(id) {
        getDeploymentDesignSnapshots(id).then((res) => {
          this.baslineList = res.data.data.content
        })
      },
      checkBaselines(row) {
        this.selectedId = row.id
        this.baselineDetailVisible = true
        this.deployName = row.name + '基线详情'
        this.getBaslines(row.id)
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
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
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      resetTemp() {
        this.temp = {
          name: '',
          description: ''
        }
      },
      resetBaseLineTemp() {
        this.baselineTemp = {
          id: '',
          name: '',
          description: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.creDepLoading = true
            let projectId = this.getCookie('projectId');
            let formData = new FormData();

            formData.append('name', this.temp.name);
            formData.append('description', this.temp.description);

            createDeployplan(formData, projectId).then(() => {
              this.list.unshift(this.temp)
              this.creDepLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) => {
              this.errorMessage = '操作失败！'
              this.creDepLoading = false
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '创建失败',
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

        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          this.upDepLoading = true
          if (valid) {
            let data = {
              'name': this.temp.name,
              'description': this.temp.description
            };

            const id = this.selectedId;

            let deployplanData = qs.stringify(data);
            updateDeployplan(deployplanData, id).then(() => {
              this.upDepLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) =>{
              this.upDepLoading = false
              this.errorMessage = '操作失败！'
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '修改失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })

          }
        })
      },
      setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          },
          onEnd: evt => {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0]
            this.list.splice(evt.newIndex, 0, targetRow)

            // for show the changes, you can delete in you code
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        })
      },
      handleDelete(row) {
        let id = row.id;
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDeployplan(id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败！',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleCreateBaseline(row) {
        this.resetBaseLineTemp()
        this.baselineVisible = true
        this.selectedId = row.id
        this.$nextTick(() => {
          this.$refs['baselineForm'].clearValidate()
        })
      },
      createBaseline() {
        this.$refs['baselineForm'].validate((valid) => {
          if(valid) {
            this.creBasLoading = true
            let formData = new FormData();

            formData.append('name', this.baselineTemp.name);
            formData.append('description', this.baselineTemp.description);
            saveDeploymentDesignSnapshots(this.selectedId,formData).then(() => {
              this.creBasLoading = false
              this.baselineVisible = false
              this.$notify({
                title: '成功',
                message: '基线创建成功',
                type: 'success',
                duration: 2000
              })
            }).catch((error) => {
              this.creBasLoading = false
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
      deleteBaseline(row) {
        deleteDeploymentDesignSnapshots(row.id).then((res) => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getBaslines(this.selectedId)
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '基线删除失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      handleModifyBaseline(row) {
        this.modifyBaselineVisible = true
        this.modifyBaselineTemp = {
          id: row.id,
          name: row.name,
          description: row.description
        }
      },
      modifyBaseline() {
        this.upBasLoading = true
        let data = {
          'name': this.modifyBaselineTemp.name,
          'description': this.modifyBaselineTemp.description,
        }
        var qs = require('qs');
        let datapost = qs.stringify(data)
        modifySnapshots(this.modifyBaselineTemp.id, datapost).then(() => {
          this.upBasLoading = false
          this.modifyBaselineVisible = false
          this.getBaslines(this.selectedId)
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        }).catch((error) => {
          this.upBasLoading = false
          this.errorMessage = '操作失败！'
          if(error.response.data.message){
            this.errorMessage = error.response.data.message
          }
          this.$notify({
            title: '修改失败',
            message: this.errorMessage,
            type: 'error',
            duration: 2000
          })
        })
      },
      handleMonitor(row) {
        this.$router.push({
          name: 'monitor',
          params: {
            name: row.name,
            id: row.id
          }
        })
      },
      showHistory() {
        this.getHis()
      },
      showNow() {
        this.getList()
      },
      handleClean(row) {
        this.$confirm('确认彻底删除此部署设计吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          cleanDeployplan(row.id).then(() => {
            this.listLoading = false
            this.showHistory()
            this.$notify({
              title: '成功',
              message: '清除成功！',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: '清除失败！',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清除'
          })
        })
      },
      handleRestore(row) {
        this.$confirm('确认恢复此部署设计吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          restoreDeployplan(row.id).then(() => {
            this.listLoading = false
            this.showHistory()
            this.$notify({
              title: '成功',
              message: '恢复成功！',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: '恢复失败！',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消恢复'
          })
        })
      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      },
      listenProId () {
        return this.$store.state.app.projectId
      }
    },
    watch: {
      listenProId: function (a, b) {
        this.getList()
      }
    }
  }
</script>

<style scoped>
  .pan-btn {
    font-size: 12px;
    color: #fff;
    padding: 3px 15px;
    border-radius: 2px;
    border: none;
    outline: none;
    margin-right: 0;
    transition: all .6s ease;
    position: relative;
    display: inline-block;
  }
  .el-button+.el-button {
    margin-left: 0;
  }
</style>
