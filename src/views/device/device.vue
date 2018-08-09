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

      <el-table-column align="center" :label="$t('table.deviceName')" width="130">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.devicePath')">
        <template slot-scope="scope">
          <span>{{scope.row.deployPath}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" label="CPU">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <span v-else>{{Math.round(scope.row.cpuclock/1000*100)/100}}GHZ</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" :label="$t('table.memorySize')">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <span v-else>{{Math.round(scope.row.ramsize/1024*100)/100}}G</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.deviceState')">
        <template slot-scope="scope">
          <!--<el-tag :type="scope.row.online | statusFilter">{{scope.row.online | statusFilter}}</el-tag>-->
          <span class="el-tag el-tag--danger" v-if="scope.row.online == false">离线</span>
          <span class="el-tag el-tag--primary" v-else>在线</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.check')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button size="mini" @click="handleDisk(scope.row)" type="success">{{$t('table.disk')}}</el-button>-->
          <el-button type="primary" size="mini" v-if="scope.row.online && !scope.row.virtual" @click="handleProcess(scope.row)">{{$t('table.deviceProcess')}}</el-button>
          <el-button size="mini" type="success" v-if="scope.row.online && !scope.row.virtual" @click="handleDisk(scope.row)">{{$t('table.disk')}}</el-button>
          <router-link :to='{name:"connectvnc",params:{id:scope.row.id, ip:scope.row.ip}}'>
            <el-button size="mini" type="primary" v-if="!scope.row.virtual && scope.row.online" style="margin-left: 10px">
              远程
            </el-button>
          </router-link>
          <el-button type="primary" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" size="mini">{{$t('table.deviceProcess')}}</el-button>
          <el-button size="mini" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" type="success">{{$t('table.disk')}}</el-button>
          <el-button type="primary" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" size="mini">远程</el-button>
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
            <span>{{scope.row.size}}G</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.usedSize')">
          <template slot-scope="scope">
            <span>{{scope.row.usedSize}}G</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="diskDialogVisible = false">{{$t('table.close')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="进程" :visible.sync="processDialogVisible">
      <el-table :key='tableKey' :data="taskprocess" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                stripe
                style="width: 100%"
                @selection-change="handleCheckedProcess">
        <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
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
        <el-button type="primary" @click="compMonitor()">组件进程监控</el-button>
      </div>
    </el-dialog>
    <el-dialog title="组件进程监控" :visible.sync="compProcessDialogVisible">
      <el-table :key='tableKey' :data="taskprocess" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">

        <el-table-column align="center" label="进程">
          <template slot-scope="scope">
            <span>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>--</span>
          </template>
        </el-table-column>
      </el-table>
      <!--<div slot="footer" class="dialog-footer">
        <el-button @click="processDialogVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="compMonitor()">组件进程监控</el-button>
      </div>-->
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

    <p id="callback"></p>
    <p id="onlineheartbeatmessages"></p>
  </div>
</template>

<script>
  import { getDevices, saveDevices, updateDevice, deleteDevice, copyDevices, getDisks, getProcess, reportDevices } from '@/api/device'
  import waves from '@/directive/waves' // 水波纹指令
  import Sortable from 'sortablejs'
  import service from '@/utils/request'
  import Stomp from 'stompjs'
  import SockJS from 'sockjs-client'
  import Vue from 'vue'

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
        webResBody: [],
        checkedProcess: [],           //checkbox, 进程id
        processIds: [],             //进程id
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
        compProcessDialogVisible: false,
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
        getDevices(this.proId, this.listQuery).then(response => {
          this.list = response.data.data.content
          this.total = response.data.total
          this.listLoading = false
          for(let i=0;i<this.list.length;i++){
            this.list[i].online = false;
            this.list[i].virtual = false;
          }
          this.listLength = response.data.data.length
          this.total = response.data.data.totalElements
          this.getList2()
        })
      },
      getList2() {
        let url = service.defaults.baseURL + '/OMS';
        let socket = new SockJS(url);
        let stompClient = Stomp.over(socket);
        let that = this;
        stompClient.connect({}, function (frame) {
          stompClient.subscribe('/topic/onlineheartbeatmessages', function (response) {
            let resBody = response.body;
            let resBody2 = resBody.replace(/[\\]/g, '');
            that.webResBody = JSON.parse(resBody2);
            $("#onlineheartbeatmessages").html(resBody);

            /*if(that.list.length > 0){
              for(let i=0;i<that.list.length;i++){
                that.list[i].online = false;
                if(that.webResBody.length > 0){
                  for(let j=0;j<that.webResBody.length;j++){
                    console.log("判断-------");
                    console.log(that.list[i].ip);
                    console.log(that.webResBody[j].inetAddress);
                    if(that.list[i].ip === that.webResBody[j].inetAddress){
                      console.log("在线");
                      that.list[i].online = true;
                      break;
                    }else {
                      that.list[i].online = false;
                    }
                  }
                }
                Vue.set(that.list, i, that.list[i]);
              }
            }*/

            if(that.list.length > 0){
              for(let i=0;i<that.list.length;i++){
                that.list[i].online = false;

                if(that.list[i].online === false && that.list[i].virtual === true){
                  that.list.splice(i,1);
                  i--;
                }
              }
            }

            if(that.webResBody.length > 0){
              for(let i=0;i<that.webResBody.length;i++){
                let listIfExist = false;
                let tempList = [];
                if(that.list.length > 0){
                  for(let j=0;j<that.list.length;j++){
                    if(that.list[j].virtual !== true){       //虚拟设备不需要再赋值  或者在每次查之前把虚拟且离线的设备删除
                      if(that.webResBody[i].inetAddress === that.list[j].ip){      //查找在线设备
                        that.list[j].online = true;
                        that.list[j].cpuclock = that.webResBody[i].cpuclock;
                        that.list[j].ramsize = that.webResBody[i].ramsize;
                        that.list[j].virtual = false;
                        listIfExist = true;
                        break;
                      }
                    }
                  }
                }

                if(!listIfExist){       //添加虚拟设备
                  console.log(that.webResBody[i].inetAddress);
                  tempList.name = that.webResBody[i].inetAddress;
                  tempList.ip = that.webResBody[i].inetAddress;
                  tempList.cpuclock = that.webResBody[i].cpuclock;
                  tempList.ramsize = that.webResBody[i].ramsize;
                  tempList.virtual = true;
                  tempList.online = true;
                  that.list.push(tempList);
                }
              }
            }

            if(that.list.length > 0) {
              for (let i = 0; i < that.list.length; i++) {
                Vue.set(that.list, i, that.list[i]);
              }
              /*console.log("设备----------");
              console.log(that.list);*/
            }
          });
        });

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
            let formData = new FormData();
            formData.append('name', this.temp.name);
            formData.append('ip', this.temp.ip);
            formData.append('deployPath', this.temp.deployPath);
            formData.append('description', this.temp.description);
            saveDevices(this.proId, formData).then((res) => {
              console.log(res.data, 'createDeviceSuccess')
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(() =>{
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
            let qs = require('qs');
            let data = qs.stringify({
              'name': this.temp.name,
              'ip': this.temp.ip,
              'deployPath': this.temp.deployPath,
              'description': this.temp.description
            });
            let deviceData = new FormData()
            deviceData.append('name',this.temp.name)
            deviceData.append('ip',this.temp.ip)
            deviceData.append('deployPath',this.temp.deployPath)
            deviceData.append('description',this.temp.description)
            deviceData.append('enctype', "multipart/form-data")
            updateDevice(this.deviceId, data).then((res) => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(() =>{
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
      deleteDevice(row) {
        /*console.log(event.target.tagName)
        const target_btn = event.target*/
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteId = row.id
          deleteDevice(deleteId).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() =>{
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
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
          this.$notify({
            title: '成功',
            message: '复制成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch(() =>{
          this.$notify({
            title: '失败',
            message: '复制失败',
            type: 'error',
            duration: 2000
          })
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
        copyDevices(id).then(() => {
          this.list.unshift(this.temp)
          /* this.dialogFormVisible = false */
          this.$notify({
            title: '成功',
            message: '复制成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch(() =>{
          this.$notify({
            title: '失败',
            message: '复制失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      handleProcess(row) {
        this.processDialogVisible = true
        this.listLoading = true
        getProcess(row.id).then((res) => {
          this.taskprocess = res.data.data
          this.listLoading = false
        })
      },
      handleDisk(row) {
        this.diskDialogVisible = true
        this.listLoading = true
        getDisks(row.id).then((res) => {
          this.disks = res.data.data
          this.listLoading = false
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
          "deployPath": this.reportData.deployPath,
          "description": ''
        })
        reportDevices(this.proId, RpData).then((res) => {
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
        }).catch(() =>{
          this.$notify({
            title: '失败',
            message: '上报失败',
            type: 'error',
            duration: 2000
          })
        })
      },

      handleCheckedProcess(val) {          //所选的进程，checkbox
        this.checkedProcess = val;
        console.log("checkbox---------");
        console.log(this.checkedProcess)

        this.processIds.splice(0,this.processIds.length);

        for(let i=0;i<this.checkedProcess.length;i++){
          this.processIds.push(this.checkedProcess[i].id);
        }

        console.log(this.processIds);
      },
      compMonitor() {
        // alert("查看组件进程----------");
        this.compProcessDialogVisible = true
        //this.listLoading = true
        /*getProcess(row.id).then((res) => {
          this.taskprocess = res.data.data
          this.listLoading = false
        })*/
      },
      /*compMonitor: function () {
        alert("查看组件进程----------");
        /!*this.processIds.splice(0,this.processIds.length);

        console.log(this.componentIds.length);
        if(this.componentIds.length !== 0){

          for(let i=0;i<this.componentIds.length;i++){
            for(let j=0;j<this.bindCompsId.length;j++){
              if(this.bindCompsId[j] === this.componentIds[i]){  //判断索选择的组件是否有已绑定的
                this.repeatCompsId.push(this.bindCompsId[j]);

              }
            }
          }

          if(this.repeatCompsId.length !== 0){
            this.$message({
              type: 'warning',
              message: '有' + this.repeatCompsId.length + '个组件已绑定过！'
            })

            return;
          }

          let dataBindId = (this.componentIds + '').replace(/\[|]/g,'')
          console.log(dataBindId, '99980')
          let data = {
            'componentIds': dataBindId
          }
          let qs = require('qs')
          let dataBind = qs.stringify(data)
          doDeployBind(this.deployPlanId, this.deviceCHId, dataBind).then(() => {
            this.$notify({
              title: '成功',
              message: '绑定成功',
              type: 'success',
              duration: 2000
            })

            getDeployComLists(this.deployPlanId, this.deviceCHId).then((res) => {
              this.bindedDeviceList = res.data.data
            })

          }).catch(() =>{
            this.$notify({
              title: '失败',
              message: '绑定失败',
              type: 'error',
              duration: 2000
            })
          })
        }else{
          this.$message({
            type: 'warning',
            message: '无绑定信息!'
          })
        }*!/

      },*/
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
      connectVNC(row) {
      }
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
