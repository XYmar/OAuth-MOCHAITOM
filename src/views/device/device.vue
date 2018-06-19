<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.deviceName')" v-model="searchQuery">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item pull-right" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

      <el-table-column align="center" :label="$t('table.deviceName')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.devicePath')">
        <template slot-scope="scope">
          <span>{{scope.row.deployPath}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="CPU">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <span v-else>{{scope.row.cpuclock}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.memorySize')">
        <template slot-scope="scope">
          <span>{{scope.row.ramsize}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('table.deviceState')">
        <template slot-scope="scope">
          <!--<el-tag :type="scope.row.online | statusFilter">{{scope.row.online | statusFilter}}</el-tag>-->
          <span class="el-tag el-tag--danger" v-if="scope.row.online == false">离线</span>
          <span class="el-tag el-tag--primary" v-else>在线</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.check')" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.online && !scope.row.virtual" @click="handleProcess(scope.row)">{{$t('table.deviceProcess')}}</el-button>
          <el-button size="mini" type="success" v-if="scope.row.online && !scope.row.virtual" @click="handleDisk(scope.row)">{{$t('table.disk')}}</el-button>
          <el-button type="primary" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" size="mini">{{$t('table.deviceProcess')}}</el-button>
          <el-button size="mini" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" type="success">{{$t('table.disk')}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="280" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="!scope.row.virtual" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" v-if="!scope.row.virtual" type="success" @click="copyDevice(scope.row)">{{$t('table.copy')}}</el-button>
          <el-button size="mini" v-if="!scope.row.virtual" type="danger" @click="deleteDevice(scope.row)">{{$t('table.delete')}}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.virtual" @click="handleReport(scope.row)">{{$t('table.report')}}</el-button>
        </template>
        <!--<template v-else slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleReport(scope.row)">{{$t('table.report')}}</el-button>
        </template>-->
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.deviceName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deviceIP')" prop="ip">
          <el-input v-model="temp.ip"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.devicePath')" prop="path">
          <el-input v-model="temp.deployPath"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deviceDesc')" prop="description">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="磁盘" :visible.sync="diskDialogVisible">
      <el-table :key='tableKey' :data="disks" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

        <el-table-column align="center" :label="$t('table.deviceName')" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.size')">
          <template slot-scope="scope">
            <span>{{scope.row.size}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.usedSize')">
          <template slot-scope="scope">
            <span>{{scope.row.usedSize}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="diskDialogVisible = false">{{$t('table.close')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="进程" :visible.sync="processDialogVisible">
      <el-table :key='tableKey' :data="taskprocess" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

        <el-table-column align="center" label="pid">
          <template slot-scope="scope">
            <span>{{scope.row.pid}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.processName')">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="processDialogVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请填写路径" :visible.sync="reportDialogVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="路径" prop="name">
          <el-input v-model="reportPath"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reportDialogVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="reportDevice">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getDevices, saveDevices, updateDevice, deleteDevice, copyDevices, getDisks, getProcess, reportDevices } from '@/api/device'
  import waves from '@/directive/waves' // 水波纹指令
  import Sortable from 'sortablejs'
  /* eslint-disable */
  export default {
    name: 'add-device',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: null,
        listLoading: true,
        searchQuery: '',
        userData:{
          username: '',
          password: ''
        },
        reportData: {
          name: '',
          ip: '',
          deployPath: ''
        },
        proId: '',
        deviceId: '',
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
          name: undefined,
          ip: undefined,
          deployPath: undefined,
          description: undefined
        },
        disks: [],
        taskprocess: [],
        reportPath: '',
        dialogFormVisible: false,
        diskDialogVisible: false,
        processDialogVisible: false,
        reportDialogVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    filters: {
      statusFilter(deviceState) {
        const statusMap = {
          /*'在线': true,
          '离线': false*/
          true: '在线',
          false: '离线'
        }
        return statusMap[deviceState]
      }
    },
    created() {
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.proId = this.getCookie('projectId')
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getDevices(this.proId, this.userData).then(response => {
          /* this.list = response.data.items
           this.total = response.data.total
           this.listLoading = false
           this.oldList = this.list.map(v => v.id);
           this.newList = this.oldList.slice();
           this.$nextTick(() => {
             this.setSort()
           })*/
          this.list = response.data.data
          this.listLoading = false
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
          name: '',
          ip: '',
          deployPath: '',
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
            /*  this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
              createArticle(this.temp).then(() => {
                this.list.unshift(this.temp)
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              })*/
            let formData = new FormData();
            formData.append('name', this.temp.name);
            formData.append('ip', this.temp.ip);
            formData.append('deployPath', this.temp.deployPath);
            formData.append('description', this.temp.description);
            saveDevices(this.proId, this.userData, formData).then((res) => {
              console.log(res.data, 'createDeviceSuccess')
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        /*this.temp.timestamp = new Date(this.temp.timestamp)*/
        this.dialogStatus = 'update'
        this.deviceId = row.id
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            /*const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
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
            })*/
            let qs = require('qs');
            let tempData = qs.stringify({
              "name": this.temp.name,
              "ip": this.temp.ip,
              "deployPath": this.temp.deployPath,
              "description": this.temp.description
            })
            updateDevice(this.deviceId, this.userData, tempData).then((res) => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        })
      },
      deleteDevice(row) {
        /*console.log(event.target.tagName)
        const target_btn = event.target*/
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteId = row.id
          deleteDevice(deleteId, this.userData).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
          /*console.log(target_btn.parentNode.parentNode.parentNode)
          const target_tr = target_btn.parentNode.parentNode.parentNode
          if (target_tr.tagName.toLowerCase() === 'tr') {
            target_tr.style.display = 'none'
          } else if (target_tr.parentNode.tagName.toLowerCase() === 'tr') {
            target_tr.parentNode.style.display = 'none'
          }*/
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      copyDevice1(row) {
        let copyId = row.id
        let qs = require('qs');
        let copyData = qs.stringify({
          "name": row.name
        })
        copyDevices(copyId, this.userData, copyData).then((res) => {
          this.$message({
            type: 'success',
            message: '复制成功!'
          })
          this.getList()
        })
      },
      copyDevice(row) {
        let qs = require('qs');
        let id = row.id;
        this.temp = Object.assign({}, row)  // copy obj
        let data = {
          'name': this.temp.name
        };
        let proData = qs.stringify(data);
        copyDevices(proData, id).then(() => {
          this.list.unshift(this.temp)
          /* this.dialogFormVisible = false */
          this.$notify({
            title: '成功',
            message: '复制成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      handleProcess(row) {
        this.processDialogVisible = true
        getProcess(row.id, this.userData).then((res) => {
          this.taskprocess = res.data.data.taskInfoEntities
        })
      },
      handleDisk(row) {
        this.diskDialogVisible = true
        getDisks(row.id,this.userData).then((res) => {
          this.disks = res.data.data.diskInfoEntities
        })
      },
      handleReport(row) {
        this.reportDialogVisible = true
        this.reportData.name = row.name
        this.reportData.ip = row.ip
      },
      reportDevice() {
        this.reportData.deployPath = this.reportPath
        let qs = require('qs')
        let RpData = qs.stringify({
          "name": this.reportData.name,
          "ip":  this.reportData.ip,
          "deployPath": this.reportData.deployPath
        })
        reportDevices(this.proId, this.userData, RpData).then((res) => {
          this.reportData.name = ''
          this.reportData.ip = ''
          this.reportData.deployPath = ''
          this.reportDialogVisible = false
          this.$notify({
            title: '成功',
            message: '上报成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
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
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      },
      listenProjectId () {
        return this.$store.state.app.projectId
      }
    },
    watch: {
      listenProjectId: function () {
        this.proId = this.getCookie('projectId')
        this.getList()
      }
    }
  }
</script>

<style scoped>
</style>
