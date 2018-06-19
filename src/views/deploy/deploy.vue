<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('table.deviceName')" v-model="searchQuery">
      </el-input>

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
      <el-table-column width="110px" align="center" :label="$t('table.deviceState')">
        <template slot-scope="scope">
          <span class="el-tag el-tag--danger" v-if="scope.row.online === false">离线</span>
          <span class="el-tag el-tag--primary" v-else>在线</span>
        </template>
      </el-table-column>
      <el-table-column width="210px" align="center" :label="$t('table.deployProgress')">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.progress"></el-progress>
        </template>
      </el-table-column>
      <el-table-column width="145px" align="center" :label="$t('table.deployDetail')">
        <template slot-scope="scope">
          <!--<el-button size="mini" type="primary">查看</el-button>-->
          <el-button type="text"  @click="deployDetails(scope.row)">查看</el-button>

        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="145" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="success" :id="scope.row.online"
                     @click="deployDevice(scope.row)">部署</el-button>
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
  import { getDevices } from '@/api/device'
  import { doDeploy } from '@/api/deploy'
  import waves from '@/directive/waves' // 水波纹指令

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
        searchQuery: '',
        userData:{
          username: '',
          password: ''
        },
        proId: '',
        deployPlanId: '',       //所选部署设计的id
        listLoading: true,
        dialogTableVisible: false,
        errorDetails: [],      //部署失败的文件
        completedDeatils: [],  //部署成功的文件
        deployDetailInfo: {},   //部署详情
        deployDetailInfo2: [],   //部署详情
        deviceDeployDetail: []  //某设备的部署详情

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
      getList() {
        this.listLoading = true
        getDevices(this.proId, this.userData).then(response => {
          this.list = response.data.data
          this.listLoading = false
        })
      },
      deployDevice: function (row) {
        let username = this.getCookie('username');
        let password = this.getCookie('password');

        let id = row.id;
        //alert(id);
        let qs = require('qs');

        let online = false;

        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id === id) {
            online = this.list[i].online;
            break;

          }
        }

        if (online) {
          let msg = "您确定部署吗？";
          if (confirm(msg) === true) {

            doDeploy(this.userData, this.deployPlanId, id).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '开始部署',
                type: 'success',
                duration: 2000
              })
              setInterval(() => {
                this.getList()
              }, 10 * 1000);

              this.setProjectNum(this.listLength)
            }).catch(err => {
              console.log("提示---------");
              console.log(err.response.data.data);
              if(err.response.data.data.length != 0){
                this.$notify({
                  title: '失败',
                  message: err.response.data.data,
                  type: 'error',
                  duration: 2000
                })
              }
            })


          } else {
            return false;
          }
        } else {
          this.$message({
            message: '设备离线!',
            type: 'warning'
          })
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

      }
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
