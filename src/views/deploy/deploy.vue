<template>
  <div class="app-container calendar-list-container deploy">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('table.deviceName')" v-model="searchQuery">
      </el-input>
    </div>
    <el-table :key="tableKey"
              :data="listA"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border
              fit
              highlight-current-row
              class="delpoyTable"
              style="width: 100%"
    >
      <el-table-column min-width="140" align="center" :label="$t('table.deviceName')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="140" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" align="center" :label="$t('table.devicePath')">
        <template slot-scope="scope">
          <span>{{scope.row.deployPath}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110" align="center" :label="$t('table.deviceState')">
        <template slot-scope="scope">
          <span class="el-tag el-tag--danger" v-if="scope.row.online === false">离线</span>
          <span class="el-tag el-tag--primary" v-else>在线</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180" align="center" :label="$t('table.deployProgress')">
        <template slot-scope="scope">
          <el-progress :percentage="computedProgress(scope.row.progress)"></el-progress>
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" label="部署速度">
        <template slot-scope="scope">
          <span>{{computedDeploySpeed(scope.row.speed)}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="140" align="center" label="文件详情">
        <template slot-scope="scope">
          <span v-if="scope.row.fileState === 0" style="color: #FF0000;">{{scope.row.descript}}</span>
          <span v-else-if="scope.row.fileState === 1 || scope.row.fileState === 2" style="color: limegreen;">{{scope.row.descript}}</span>
          <span v-else>{{scope.row.descript}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="130" align="center" :label="$t('table.actions')">
        <template slot-scope="scope">
          <el-button size="mini" type="success" :id="scope.row.online" :state="scope.row.state" class="deployBtn" :disabled="!scope.row.online"
                     @click="deployDevice(scope.row)" :loading="scope.row.deployLoading">部署</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="部署详情" :visible.sync="dialogTableVisible">

      <el-table :key='tableKey' :data="deviceDeployDetail" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" :label="$t('table.compName')">
          <template slot-scope="scope">
            <span>{{scope.row.componentEntity.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.deployFileName')">
          <template slot-scope="scope">
            <span>{{scope.row.componentDetailEntity.name}}</span>
          </template>
        </el-table-column>
        <el-table-column width="110px" align="center" :label="$t('table.deviceState')">
          <template slot-scope="scope">
            <span class="el-tag el-tag--danger" v-if="scope.row.state === false">部署失败</span>
            <span class="el-tag el-tag--primary" v-else>部署成功</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import { doDeploy, getDeployDevice } from '@/api/deploy'
  import waves from '@/directive/waves' // 水波纹指令
  import service from '@/utils/request'
  import Stomp from 'stompjs'
  import SockJS from 'sockjs-client'
  import Vue from 'vue'

  /* eslint-disable */
  export default {
    name: 'deploy',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: null,
        listQuery: {
          page: 0,
          size:20,
          limit: 5,
          tagname: ''
        },
        searchQuery: '',
        userData:{
          username: '',
          password: ''
        },
        proId: '',
        deployPlanId: '',       //所选部署设计的id
        listLoading: true,
        deployLoading: false,
        dialogTableVisible: false,
        errorDetails: [],      //部署失败的文件
        completedDeatils: [],  //部署成功的文件
        deployDetailInfo: {},   //部署详情
        deployDetailInfo2: [],   //部署详情
        deviceDeployDetail: [],  //某设备的部署详情
        webResBody: [],
        webProgressBody: []
      }
    },
    created() {
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.proId = this.getCookie('projectId')

      this.deployPlanId = this.$route.params.id
      this.getList()

    },
    methods: {
      getList() {    //获取设备信息
        this.listLoading = true
        getDeployDevice(this.deployPlanId, this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.data.totalElements
          this.listLoading = false
          for(let i=0;i<this.list.length;i++){
            this.list[i].online = false;
            this.list[i].virtual = false;
            this.list[i].speed = 0;
            this.list[i].state = 0;
            this.list[i].descript = '--';
          }
          this.listLength = response.data.data.length
          // this.total = response.data.data.totalElements
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
           // $("#onlineheartbeatmessages").html(resBody);

            if(that.list.length > 0){
              for(let i=0;i<that.list.length;i++){
                that.list[i].online = false;

                if(that.list[i].online === false && that.list[i].virtual === true){
                  that.list.splice(i,1);
                  i--;
                }
              }
            }

            console.log("设备")
            console.log(that.webResBody)
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

          stompClient.subscribe('/topic/deployprogress/' + that.deployPlanId, function (response) {
            let progressBody = response.body;
            let progressBody2 = progressBody.replace(/[\\]/g, '');
            that.webProgressBody.push(JSON.parse(progressBody2));

            if(that.webProgressBody.length > 0){
              for(let i=0;i<that.webProgressBody.length;i++){
                if(that.list.length > 0){
                  for(let j=0;j<that.list.length;j++){
                    if(that.webProgressBody[i].hostName == that.list[j].ip){      //查找此设备
                      that.list[j].progress = parseFloat(that.webProgressBody[i].progress.toFixed(2));
                      that.list[j].speed = parseFloat(that.webProgressBody[i].speed.toFixed(2));
                      that.list[j].state = that.webProgressBody[i].state;
                      that.list[j].fileState = that.webProgressBody[i].state;
                      that.list[j].descript = that.webProgressBody[i].description;
                    }
                  }
                }
              }
            }

            $("#onlineheartbeatmessages2").html(response.body);
          });
        });

      },

      deployDevice: function (row) {
        let id = row.id;
        let online = false;
        let thisState;

        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id === id) {
            online = this.list[i].online;
            thisState = this.list[i].state;
            break;

          }
        }

        if (online) {
          if(thisState !== 1){      //部署状态为1时表示正在部署
            this.$confirm('确认部署吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let data = {
                'deployMethod': 'TCP'
              }
              let qs = require('qs')
              let deployData = qs.stringify(data);
              // this.deployLoading = true
              row.deployLoading = true
              doDeploy(this.deployPlanId, id, deployData).then(() => {
                // this.deployLoading = false
                row.deployLoading = false
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '部署结束',
                  type: 'success',
                  duration: 2000
                })
                /*setInterval(() => {
                  this.getList()
                }, 10 * 1000);*/

                this.setProjectNum(this.listLength)

              }).catch(err => {
                // console.log("提示---------");
                // console.log(err.response.data.data);
                // this.deployLoading = false
                row.deployLoading = false
                if(err.response.data.data.length != 0){
                  this.$notify({
                    title: '失败',
                    message: err.response.data.data,
                    type: 'error',
                    duration: 2000
                  })
                }
              })
              }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消部署'
              })
            })
          }else{
            // this.deployLoading = true
            row.deployLoading = false
            this.$message({
              message: '此设备正在部署!',
              type: 'warning'
            })
          }

        }
      },

      deployDetails: function (row) {

        this.deviceDeployDetail.splice(0, this.deviceDeployDetail.length);    //清空某设备的部署详情数组
        this.errorDetails.splice(0, this.errorDetails.length);    //清空某设备的失败文件数组
        this.completedDeatils.splice(0, this.completedDeatils.length);    //清空某设备的成功文件数组

        let ifexist = false;      //设备是否部署，false为未部署

        let id = row.id;
        let i = 0;

        console.log("详情部署信息------------");
        console.log(id);
        console.log(this.list);
        console.log(this.list.length);

        if(this.list.length > 0){
          for (i = 0; i < this.list.length; i++) {      //循环结果数组，找到点击的设备对应的数据
            if (id === this.list[i].id) {
              console.log(this.list[i].id);
              console.log(this.list[i].progress);
              if(this.list[i].progress !== 0){      //判断此设备是否已部署，进度不为0则已部署

                if(this.list[i].errorFileList.length !== 0){                         //未成功文件存入失败详情数组
                  for(let x=0;x<this.list[i].errorFileList.length;x++){
                    this.errorDetails.push(this.list[i].errorFileList[x]);
                  }

                }

                if(this.list[i].completedFileList !== 0){                           //成功文件存入完成详情数组
                  for(let y=0;y<this.list[i].completedFileList.length;y++){
                    this.completedDeatils.push(this.list[i].completedFileList[y]);
                  }
                }

                ifexist = true;           //设备已部署
                break;
              }
            }
          }
        }

        console.log("失败成功文件------");
        console.log(this.errorDetails);
        console.log(this.completedDeatils);

        if(this.errorDetails.length !== 0){
          for (let i = 0; i < this.errorDetails.length; i++) {
            this.errorDetails[i].state = false;
          }
        }

        if(this.completedDeatils.length !== 0){
          for (let i = 0; i < this.completedDeatils.length; i++) {
            this.completedDeatils[i].state = true;
          }
        }

        console.log(this.completedDeatils);

        this.deployDetailInfo.info = [];

        console.log("失败文件------------");
        console.log(this.errorDetails.length);
        if(this.errorDetails.length !== 0){
          for(let j=0;j<this.errorDetails.length;j++){
            this.deployDetailInfo.info.push(this.errorDetails[j]);
          }
        }

        if(this.completedDeatils.length !== 0){
          for(let k=0;k<this.completedDeatils.length;k++){
            this.deployDetailInfo.info.push(this.completedDeatils[k]);
          }

        }

        this.deployDetailInfo2.push(this.deployDetailInfo);

        console.log("部署详情-------------");
        console.log(this.deployDetailInfo);
        console.log(this.deployDetailInfo2);



        /*for (i = 0; i < this.deployDetailInfo2.length; i++) {
          console.log(this.deployDetailInfo2[i]);
          console.log(this.deployDetailInfo2[i].deviceId);
          if (id == this.deployDetailInfo2[i].deviceId) {

            ifexist = true;           //设备已部署
            break;
          }
        }*/
        console.log(ifexist);

        if (ifexist === true) {

          console.log(this.deployDetailInfo2);
          this.deviceDeployDetail = this.deployDetailInfo2[0].info;

          console.log("已部署的设备的信息-----------------");
          console.log(this.deviceDeployDetail);

          this.dialogTableVisible = true;
          //$("#modal-select").modal('show');

        } else {
          this.$message({
            message: '请先部署!',
            type: 'warning'
          })
        }

        console.log(this.deviceDeployDetail);

      },
      /*getDeployProgress: function () {
        // "/topic/deployprogress/" + this.deployPlanId
        let url = service.defaults.baseURL + '/OMS';
        let socket = new SockJS(url);
        let stompClient = Stomp.over(socket);
        let that = this;
        stompClient.connect({}, function (frame) {
          stompClient.subscribe("/topic/deployprogress/" + this.deployPlanId, function (response) {
            let resBody = response.body;
            let resBody2 = resBody.replace(/[\\]/g, '');
            that.webResBody = JSON.parse(resBody2);
            $("#onlineheartbeatmessages2").html(resBody);

            /!*if(that.list.length > 0){
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
              }
            }

            if(that.list.length > 0) {
              for (let i = 0; i < that.list.length; i++) {
                Vue.set(that.list, i, that.list[i]);
              }
              /!*console.log("设备----------");
              console.log(that.list);*!/
            }*!/
          });
        });
      }*/
    },
    computed: {
      listA: function () {
        let self = this;
        console.log("list---------------");
        console.log(self.list);
        if(self.list !== null){
          return self.list.filter(function (item) {
            return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
          })
        }

      },
      listenProjectId () {
        return this.$store.state.app.projectId
      },
      computedProgress() {
        return function(num) {
          if(num == 0 || !num) {
            return 0
          } else {
            return Math.round(num)
          }
        }
      },
      computedDeploySpeed() {
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
