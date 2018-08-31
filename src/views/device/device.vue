<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 240px;" class="filter-item" :placeholder="$t('table.deviceName')" v-model="searchQuery">
      </el-input>
      <el-button class="filter-item pull-right" style="margin-left: 10px;float: right;" @click="handleCreate" type="primary" icon="el-icon-edit" v-show="!isHistory">{{$t('table.add')}}</el-button>
      <el-button type="danger" @click="showHistory" style="float: right;" icon="el-icon-delete" v-show="!isHistory">
        回收站
      </el-button>
      <el-button type="success" @click="showNow" style="float: right;" icon="el-icon-back" v-show="isHistory">
        退出回收站
      </el-button>
    </div>
    <el-table :key='tableKey' :data="listA" v-if="!isHistory" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

      <el-table-column align="center" :label="$t('table.deviceName')" width="130">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row, scope.$index)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.devicePath')">
        <template slot-scope="scope">
          <span v-if="scope.row.deployPath">{{scope.row.deployPath}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="CPU">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <span v-else>{{Math.round(scope.row.cpuclock/1000*100)/100}}GHz</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="CPU利用率">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <span v-else>{{scope.row.cpuutilization}}%</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="内存利用率">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <span v-else-if="scope.row.ifChangeColor < 70">{{Math.round((scope.row.ramsize - scope.row.freeRAMSize)/scope.row.ramsize*10000)/100}}%</span>
          <span v-else-if="scope.row.ifChangeColor >= 70 && scope.row.ifChangeColor < 85" style="color: #FF8C00;">{{Math.round((scope.row.ramsize - scope.row.freeRAMSize)/scope.row.ramsize*10000)/100}}%</span>
          <span v-else-if="scope.row.ifChangeColor >= 85" style="color: #FF0000;">{{Math.round((scope.row.ramsize - scope.row.freeRAMSize)/scope.row.ramsize*10000)/100}}%</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="上行速度">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <!--<span v-else>{{scope.row.upstreamSpeed}}</span>-->
          <span v-else>{{computedUpStream(scope.row.upstreamSpeed)}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="下行速度">
        <template slot-scope="scope">
          <span v-if="!scope.row.online">--</span>
          <!--<span v-else>{{scope.row.downstreamSpeed}}</span>-->
          <span v-else>{{computedDownStream(scope.row.downstreamSpeed)}}</span>
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
          <!--<router-link :to='{name:"connectvnc",params:{id:scope.row.id, ip:scope.row.ip}}'>
            <el-button size="mini" type="primary" v-if="!scope.row.virtual && scope.row.online" style="margin-left: 10px">
              远程
            </el-button>
          </router-link>-->
          <el-button size="mini" type="warning" v-if="!scope.row.virtual && scope.row.online" @click="handleRouter(scope.row)">
            远程
          </el-button>
          <el-button type="primary" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" size="mini">{{$t('table.deviceProcess')}}</el-button>
          <el-button size="mini" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" type="success">{{$t('table.disk')}}</el-button>
          <el-button type="warning" disabled="disabled" v-if="!scope.row.online || scope.row.virtual" size="mini">远程</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="140" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown trigger="click" v-if="!scope.row.virtual">
            <span class="el-dropdown-link">
              <el-button type="success" plain>更多操作</el-button>
            </span>
            <el-dropdown-menu slot="dropdown" v-if="!scope.row.deleted">
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="handleUpdate(scope.row, scope.$index)">编辑</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="copyDevice(scope.row)">复制</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="deleteDevice(scope.row)">删除</span>
              </el-dropdown-item>
              <!--<el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleLineData(scope.row)">详情</span>
              </el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" size="mini" v-if="scope.row.virtual" @click="handleReport(scope.row)">{{$t('table.report')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table :key='tableKey'
              :data="listA"
              v-if="isHistory === true"
              border fit highlight-current-row
              style="width: 100%"

    >
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
          <span v-if="scope.row.deployPath">{{scope.row.deployPath}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="140" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown trigger="click" v-if="!scope.row.virtual && scope.row.deleted">
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

    <!--修改对话窗口：包含动态图-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" class="modDeviceDialog" v-if="!isHistory">
      <el-form :rules="deviceRules"
               ref="dataForm"
               :model="temp"
               label-width="100px"
               :disabled="temp.virtual"
               style='width: 80%; margin:0 auto;'>
        <el-form-item :label="$t('table.deviceName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deviceIP')" prop="ip">
          <el-input v-model="temp.ip"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.devicePath')" prop="deployPath">
          <el-input v-model="temp.deployPath" placeholder="例如：D:/test/"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deviceDesc')" prop="description">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <div class="mydialogFooter">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" style="float: right;" :loading="creDevLoading">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData" :disabled="temp.virtual" style="float: right;" :loading="upDevLoading">{{$t('table.confirm')}}</el-button>
        <el-button @click="dialogFormVisible = false" style="float: right;margin-right: 10px">{{$t('table.cancel')}}</el-button>
      </div>
      <lineMarker ref="lineMarker"
                  v-if="!isHistory && dialogStatus === 'update' && list[currentDeviceIndex].online == true"
                  :countTime="list[currentDeviceIndex].countTime"
                  :cpuData="list[currentDeviceIndex].cpuData"
                  :ramData="list[currentDeviceIndex].ramData"
                  :upSpeed="list[currentDeviceIndex].upstreamSpeed"
                  :downSpeed="list[currentDeviceIndex].downstreamSpeed"
                  style="margin-bottom: 10px;"
      >
      </lineMarker>
      <!--<lineMarker ref="lineMarker"
                  v-if="!isHistory && dialogStatus === 'update' && temp.online"
                  :countTime="temp.countTime"
                  :cpuData="temp.cpuData"
                  :ramData="temp.ramData"
                  :upSpeed="temp.upstreamSpeed"
                  :downSpeed="temp.downstreamSpeed"
                  style="margin-bottom: 10px;"
      >
      </lineMarker>-->
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
    <el-dialog title="进程" :visible.sync="processDialogVisible" class="processDialog">
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
    <el-dialog title="请填写路径" :visible.sync="reportDialogVisible" width="40%">
      <el-form :rules="pathRules" ref="reportForm" :model="pathTemp"  label-width="100px" style='width: 80%; margin:0 auto;'>
        <el-form-item label="部署路径" prop="reportPath">
          <el-input v-model="pathTemp.reportPath" @keyup.enter.native="reportDevice"/>
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
  import { getDevices, saveDevices, updateDevice, deleteDevice, copyDevices, getDisks, getProcess, reportDevices, getHisDevices, cleanDevice, restoreDev } from '@/api/device'
  import waves from '@/directive/waves' // 水波纹指令
  import Sortable from 'sortablejs'
  import service from '@/utils/request'
  import Stomp from 'stompjs'
  import SockJS from 'sockjs-client'
  import lineMarker from './lineMarker'
  import Vue from 'vue'

  /* eslint-disable */
  export default {
    name: 'add-device',
    directives: {
      waves
    },
    components: {
      lineMarker
    },
    data() {
      const validateIP = (rule, value, callback) => {
        //ip地址
        let exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        let reg = value.match(exp);

        if(value.length==0){
          callback(new Error("请输入IP！"));
        }else if (reg == null) {
          callback(new Error('IP地址不合法！'));
        }else {
          callback()
        }
      }
      const validatePath = (rule, value, callback) => {
        let pattern = /^([a-zA-Z]:(\\))([a-zA-Z]*)|(\/([a-zA-Z]+))*\/$/;

        if(value.length==0){
          callback(new Error("请输入路径！"));
        }else if (!(value.match(pattern))) {
          callback(new Error('路径格式不正确!'));
        }else {
          callback()
        }
      }

      return {
        isHistory: false,
        tableKey: 0,
        list: [],
        webResBody: [],
        checkedProcess: [],           //checkbox, 进程id
        processIds: [],             //进程id
        cpuData: 0,
        ramData: 0,
        upSpeed: 0,
        countTime: null,
        listLoading: true,
        currentDeviceIndex: 0,
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
          name: '',
          ip: '',
          deployPath: '',
          description: ''
        },
        pathTemp: {
          reportPath: ''
        },
        disks: [],
        taskprocess: [],
        // reportPath: '',
        dialogFormVisible: false,
        diskDialogVisible: false,
        processDialogVisible: false,
        compProcessDialogVisible: false,
        reportDialogVisible: false,
        creDevLoading: false,
        upDevLoading: false,
        delLoading: false,
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
        deviceRules: {
          name: [{ required: true, message: '请输入设备名', trigger: 'blur' }],
          ip: [{ required: true, trigger: 'blur', validator: validateIP }],
          deployPath: [{ required: true, trigger: 'blur', validator: validatePath }]
        },
        pathRules: {
          reportPath: [{ required: true, message: '请填写部署路径', trigger: 'blur' }]
        },
        downloadLoading: false,
        errorMessage: '操作失败！'
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
      this.isHistory = false
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.proId = this.getCookie('projectId')
      this.getList()

    },
    methods: {
      getList() {
        this.listLoading = true
        getDevices(this.proId, this.listQuery).then(response => {
          this.isHistory = false
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
      getHis() {
        this.listLoading = true
        getHisDevices(this.proId, this.listQuery).then((response) => {
          this.isHistory = true
          this.list = response.data.data.content
          this.total = response.data.total
          this.listLoading = false
          /*for(let i=0;i<this.list.length;i++){
            this.list[i].online = false;
            this.list[i].virtual = false;
          }*/
          this.listLength = response.data.data.length
          this.total = response.data.data.totalElements
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
                        that.list[j].cpuutilization = that.webResBody[i].cpuutilization;
                        that.list[j].ramsize = that.webResBody[i].ramsize;
                        that.list[j].freeRAMSize = that.webResBody[i].freeRAMSize;
                        that.list[j].ifChangeColor = (that.webResBody[i].ramsize - that.webResBody[i].freeRAMSize)/that.webResBody[i].ramsize*100;
                        that.list[j].virtual = false;
                        // that.countTime = that.webResBody[i].createTime
                        // that.cpuData = parseInt(that.webResBody[i].cpuutilization)
                        // that.ramData = Math.round((that.webResBody[i].ramsize - that.webResBody[i].freeRAMSize)/that.webResBody[i].ramsize*10000)/100
                        that.list[j].countTime = that.webResBody[i].createTime;
                        that.list[j].cpuData = parseInt(that.webResBody[i].cpuutilization);
                        that.list[j].ramData = Math.round((that.webResBody[i].ramsize - that.webResBody[i].freeRAMSize)/that.webResBody[i].ramsize*10000)/100;
                        that.list[j].upstreamSpeed = that.webResBody[i].upstreamSpeed;
                        that.list[j].downstreamSpeed = that.webResBody[i].downstreamSpeed;
                        listIfExist = true;
                        break;
                      }
                    }
                  }
                }

                if(!listIfExist && !that.isHistory){       //添加虚拟设备
                  console.log(that.webResBody[i].inetAddress);
                  tempList.name = that.webResBody[i].inetAddress;
                  tempList.ip = that.webResBody[i].inetAddress;
                  tempList.cpuclock = that.webResBody[i].cpuclock;
                  tempList.cpuutilization = that.webResBody[i].cpuutilization;
                  tempList.ramsize = that.webResBody[i].ramsize;
                  tempList.freeRAMSize = that.webResBody[i].freeRAMSize;
                  tempList.ifChangeColor = (that.webResBody[i].ramsize - that.webResBody[i].freeRAMSize)/that.webResBody[i].ramsize*100;
                  tempList.virtual = true;
                  tempList.online = true;
                  tempList.countTime = that.webResBody[i].createTime;
                  tempList.cpuData = parseInt(that.webResBody[i].cpuutilization);
                  tempList.ramData = Math.round((that.webResBody[i].ramsize - that.webResBody[i].freeRAMSize)/that.webResBody[i].ramsize*10000)/100;
                  tempList.upstreamSpeed = that.webResBody[i].upstreamSpeed;
                  tempList.downstreamSpeed = that.webResBody[i].downstreamSpeed;
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
      handleLineData(row) {
        // this.cpuData = row.cpuData
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
            this.creDevLoading = true
            let formData = new FormData();
            formData.append('name', this.temp.name);
            formData.append('ip', this.temp.ip);
            formData.append('deployPath', this.temp.deployPath);
            formData.append('description', this.temp.description);
            saveDevices(this.proId, formData).then((res) => {
              this.creDevLoading = false
              console.log(res.data, 'createDeviceSuccess')
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) =>{
              this.creDevLoading = false
              this.errorMessage = '操作失败！'
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '创建设备失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row, index) {
        this.temp = Object.assign({}, row) // copy obj
        /*this.temp.timestamp = new Date(this.temp.timestamp)*/
        this.dialogStatus = 'update'
        this.deviceId = row.id
        this.dialogFormVisible = true
        this.currentDeviceIndex = index
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.$nextTick(() => {
          if(!row.online) {
            return
          }
          // 销毁图表
          // this.$refs.lineMarker.chart.clear() // 直接销毁无需清空
          this.$refs.lineMarker.chart.dispose()
          this.$refs.lineMarker.chartSpeed.dispose()
          this.$refs.lineMarker.chart = null
          this.$refs.lineMarker.chartSpeed = null
          // 重置数据
          this.$refs.lineMarker.cpuArr = []
          this.$refs.lineMarker.upstreamSpeedArr = []
          this.$refs.lineMarker.downstreamSpeedArr = []
          this.$refs.lineMarker.ramArr = []
          this.$refs.lineMarker.initChart()
          this.$refs.lineMarker.initSpeedChart()
          this.$refs['dataForm'].clearValidate()

        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.upDevLoading = true
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
              this.upDevLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) =>{
              this.errorMessage = '操作失败！'
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.upDevLoading = false
              this.$notify({
                title: '修改设备失败',
                message: this.errorMessage,
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
        this.delLoading = true
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteId = row.id
          deleteDevice(deleteId).then(() => {
            this.delLoading = false
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() =>{
            this.delLoading = false
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
          this.delLoading = false
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
        }).catch((error) => {
          this.listLoading = false
          this.errorMessage = '获取进程失败！'
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
      },
      handleDisk(row) {
        this.diskDialogVisible = true
        this.listLoading = true
        getDisks(row.id).then((res) => {
          this.disks = res.data.data
          this.listLoading = false
        }).catch((error) => {
          this.listLoading = false
          this.errorMessage = '获取硬盘信息失败！'
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
      },
      handleReport(row) {
        this.reportDialogVisible = true
        this.reportData.name = row.name
        this.reportData.ip = row.ip
        this.$nextTick(() => {
          this.$refs['reportForm'].clearValidate()
        })
      },
      resetReport() {
        this.reportData.name = ''
        this.reportData.ip = ''
        this.reportData.deployPath = ''
        this.pathTemp.reportPath = ''
      },
      reportDevice() {
        this.$refs['reportForm'].validate((valid) => {
          if (valid) {
            this.reportData.deployPath = this.pathTemp.reportPath
            let qs = require('qs')
            let RpData = qs.stringify({
              "name": this.reportData.name,
              "ip": this.reportData.ip,
              "deployPath": this.reportData.deployPath,
              "description": ''
            })
            reportDevices(this.proId, RpData).then((res) => {
              // this.reportData.name = ''
              // this.reportData.ip = ''
              // this.reportData.deployPath = ''
              this.resetReport()
              this.reportDialogVisible = false
              this.$notify({
                title: '成功',
                message: '上报成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(() => {
              this.resetReport()
              this.$notify({
                title: '失败',
                message: '上报失败',
                type: 'error',
                duration: 2000
              })
            })
          }
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
      handleRouter(row) {
        this.$router.push({
          name: 'connectvnc',
          params: {
            id: row.id,
            ip: row.ip
          }
        })
      },
      showNow() {
        this.getList()
      },
      showHistory() {
        this.currentDeviceIndex = 0
        this.getHis()
      },
      handleClean(row) {
        this.$confirm('确认彻底删除此设备吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          cleanDevice(row.id).then(() => {
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
        this.$confirm('确认恢复此设备吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          restoreDev(row.id).then(() => {
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
      listenProjectId () {
        return this.$store.state.app.projectId
      },
      computedUpStream () {
        return function(speed) {
          if(speed >= 0 && speed <= 1000) {
            return Math.round(speed*10)/10 + 'KB/S'
          }
          if(speed > 1000) {
            return Math.round(speed/10)/100 + 'MB/S'
          }
          if(!speed) {
            return 0 + 'KB/S'
          }
        }
      },
      computedDownStream () {
        return function(speed) {
          if(speed >= 0 && speed <= 1000) {
            return Math.round(speed*10)/10 + 'KB/S'
          }
          if(speed > 1000) {
            return Math.round(speed/10)/100 + 'MB/S'
          }
          if(!speed) {
            return 0 + 'KB/S'
          }
        }
      }
      /*listenCpuData() {
        return this.countTime
      }*/
    },
    watch: {
      listenProjectId: function () {
        this.proId = this.getCookie('projectId')
        this.getList()
      },
      /*listenCpuData: function() {
        // this.cpuData = this.cpuData
        console.log(this.cpuData)
      }*/
    }
  }
</script>

<style scoped>
  .mydialogFooter {
    height:40px;
  }
</style>
