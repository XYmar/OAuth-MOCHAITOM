<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="searchQuery">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>

      <el-button class="filter-item pull-right" style="float: right;margin-left: 10px;" @click="handleCreate" type="primary"
                 icon="el-icon-edit">{{$t('table.add')}}
      </el-button>

    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column :label="$t('table.compName')">
        <template slot-scope="scope">
          <span @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.compDesc')">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 创建 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="10vh"
               v-if="dialogStatus=='create'">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style='overflow-y: auto;padding-right: 10%;padding-left: 10%;'>
        <el-form-item label="组件类名" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="7vh" v-else>
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style='width: 100%;'>
          <el-form-item :label="$t('table.compName')" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.compDesc')" prop="desc">
            <el-input v-model="temp.description"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getCompTypes, saveCompTypes, deleteCompType, updateCompTypes } from '@/api/component'
  import waves from '@/directive/waves' // 水波纹指令
  import { Loading } from 'element-ui'

  /* eslint-disable */
  export default {
    name: 'components',
    directives: {
      waves
    },
    data() {
      return {
        projectId: '',
        selectedId: '',
        treeInfo: [],
        fileList: [],
        tableKey: 0,
        list: [],
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id',
          deviceName: undefined
        },
        sortable: null,
        oldList: [],
        newList: [],
        temp: {
          id: '',
          name: '',
          version: '',
          deployPath: '',
          description: '',
          fileAll: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改',
          create: '创建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{required: true, message: 'type is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'title is required', trigger: 'blur'}]
        },
        downloadLoading: false,
        options: {
          // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
          //target: '//localhost:3000/upload',
          chunkSize: 1024 * 1024,
          testChunks: true
        },
        attrs: {
          accept: 'image/*'
        },
        searchQuery: '',
        userData:{
          username: '',
          password: ''
        }
      }
    },
    created() {
      this.projectId = this.$store.getters.projectId
      this.userData.username = this.getCookie('username')

      this.getList();

      this.autoStart = false;      //取消自动上传
    },
    methods: {
      getList() {
        this.listLoading = true
        getCompTypes(this.projectId).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
          /*this.oldList = this.list.map(v => v.id);
          this.newList = this.oldList.slice();
          this.$nextTick(() => {
            this.setSort()
          })*/

          console.log(this.list);
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
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
          id: '',
          name: '',
          version: '',
          deployPath: '',
          description: '',
          fileAll: ''
        }
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const createloading = Loading.service({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading'
            })
            let formData = new FormData();
            formData.append('name', this.temp.name);
            formData.append('description', this.temp.description);
            saveCompTypes(this.projectId, formData).then(() => {
              createloading.close()
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(() => {
              createloading.close()
              this.dialogFormVisible = false
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'success',
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
          this.$refs['dataForm'].clearValidate();
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const updateloading = Loading.service({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              fullscreen: true
            })
            let id = this.selectedId;

            // patch暂时不支持修改文件
            let data = {
              name: this.temp.name,
              description: this.temp.description
            }
            let qs = require('qs')
            let newdata = qs.stringify(data)
            updateCompTypes(newdata, id).then(() => {
              updateloading.close()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(() => {
              updateloading.close()
              this.dialogFormVisible = false
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      /*setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function (dataTransfer) {
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
      },*/
      handleDelete(row) {
        let id = row.id;
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCompType(id).then(() => {
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
              message: '删除失败',
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
      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      }
    }
  }
</script>

<style scoped>
  .el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    line-height: 24px;
    font-size: 14px;
    height: 440px;
    overflow-y: auto;
  }

  .el-dialog {
    margin-top: 10vh;
  }

</style>
