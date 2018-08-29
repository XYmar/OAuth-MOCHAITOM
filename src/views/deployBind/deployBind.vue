<template>
  <div class="app-container calendar-list-container" style="position: absolute;top: 85px;bottom: 0;width: 100%;height: 90%">

    <split-pane v-on:resize="resize" split="vertical" class="splicClass" style="height: 96%">
      <template slot="paneL">
        <div class="left-container">
          <div class="filter-container" style="margin-top:8px;padding-left: 6px;">
            <el-input style="width: 200px;" class="filter-item" placeholder="设备名" v-model="searchQuery">
            </el-input>

          </div>
          <div style="height: 440px;overflow-y: auto;padding-left: 6px;">
            <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                      style="width: 100%;">
              <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

              <div>

              </div>
              <el-table-column align="center" :label="$t('table.deviceName')" width="180px">
                <template slot-scope="scope">
                  <span @click="getDeployComList(scope.row)" style="cursor: pointer">{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="140" align="center" :label="$t('table.deviceIP')">
                <template slot-scope="scope">
                  <span>{{scope.row.ip}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" :label="$t('table.deviceState')">
                <template slot-scope="scope">
                  <span class="el-tag el-tag--danger" v-if="scope.row.online == false">离线</span>
                  <span class="el-tag el-tag--primary" v-else>在线</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="选择组件" width="120" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-popover
                    ref="popover4"
                    placement="right"
                    width="520"
                    height="500"
                    trigger="click"
                    @show="beforeSubmit(scope.row)">
                    <div class="filter-container">
                      <el-input style="width: 200px;" class="filter-item" placeholder="组件名" v-model="searchQuery2">
                      </el-input>

                    </div>

                    <div style="height: 425px;overflow-y: auto;margin-top: 0;" id="compTab">
                      <el-table :key='tableKey' :data="listB" v-loading="complistLoading" element-loading-text="给我一点时间" border fit
                                highlight-current-row
                                style="width: 100%;"
                                @selection-change="handleCheckedCompsChange" id="compTable">
                        <el-table-column
                          type="selection"
                          width="55"
                          align="center">
                        </el-table-column>
                        <el-table-column :label="$t('table.compName')" width="160" align="center">
                          <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column width="100px" align="center" :label="$t('table.compVersion')">
                          <template slot-scope="scope">
                            <span>{{scope.row.version}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column min-width="90px" align="center" :label="$t('table.compPath')">
                          <template slot-scope="scope">
                            <span>{{scope.row.deployPath}}</span>
                          </template>
                        </el-table-column>
                        <!--<el-table-column min-width="100px" align="center" :label="$t('table.compSize')">
                          <template slot-scope="scope">
                            <span>{{Math.round(scope.row.size/1024/1024*100)/100}}M</span>
                          </template>
                        </el-table-column>-->
                        <el-table-column label="解绑" width="80" align="center">
                          <template slot-scope="scope">
                            <!--<span>{{scope.row.isBind}}</span>-->
                            <el-button type="danger" icon="el-icon-delete" size="mini" circle v-if="scope.row.isBind" @click="deleteBindRelation(scope.row)"></el-button>
                          </template>
                        </el-table-column>

                      </el-table>
                    </div>
                    <el-pagination
                      @size-change="handleSizeChange2"
                      @current-change="handleCurrentChange2"
                      :current-page="currentPage2"
                      :page-sizes="[10,20,30]"
                      :page-size="listQuery2.limit"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total2"
                      background
                      style="text-align: center;margin-top:20px"
                    >
                    </el-pagination>
                    <div style="margin-top: 20px;">
                      <el-button size="mini" type="success" style="float:right;" @click="submit()" :loading="bindLoading">绑定</el-button>
                    </div>
                    <el-button type="primary" size="mini" icon="el-icon-arrow-right" slot="reference" @click="showPop"></el-button>
                  </el-popover>

                </template>
              </el-table-column>
            </el-table>
            <span id="clicktag"></span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[20,50,100]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              background
              style="text-align: center;margin-top:20px"
            >
            </el-pagination>
          </div>


        </div>
      </template>
      <template slot="paneR" id="ERDiv">
        <div style="height: 100%;">
          <!--<div id="deviceComp" style="width: 100%;height:440px;"></div>-->
          <div class='chart-container' style="height: 100%">
            <deployBindER id="ER" :detaillist="bindedDeviceList"></deployBindER>
          </div>
        </div>
      </template>
    </split-pane>

  </div>
</template>

<script>
  import { getDevices } from '@/api/device'
  import { compList } from '@/api/component'
  import { doDeployBind, getDeployComLists, deleteBind } from '@/api/deployBind'
  import waves from '@/directive/waves' // 水波纹指令
  import splitPane from 'vue-splitpane'
  import Popper from 'vue-popper'
  import deployBindER from './deployBindER.vue'
  import service from '@/utils/request'
  import Stomp from 'stompjs'
  import SockJS from 'sockjs-client'
  import Vue from 'vue'

  /* eslint-disable */
  export default {
    name: 'deploy-bind',
    components: { splitPane,deployBindER },
    mixins: [Popper],
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        searchQuery: '',
        searchQuery2: '',
        userData: {
          username: '',
          password: ''
        },
        proId: '',
        listComp: [],
        listBind: [],
        listQuery: {
          page: 0,
          size:20,
          limit: 5,
          tagname: ''
        },
        listQuery2: {
          page: 0,
          size:10,
          limit: 10,
          tagname: ''
        },
        total: null,
        bindLoading: false,
        pagesize:10,//每页的数据条数
        currentPage:1,//默认开始页面
        total2: null,
        pagesize2:10,//每页的数据条数
        currentPage2:1,//默认开始页面
        listLoading: true,
        complistLoading: true,
        deployPlanId: '',       //所选部署设计的id
        deviceCHId: '',         //左侧表格中点击的设备的id
        compCHId: '',           //右侧表格中点击的组件的id
        chboxValue: [],         //选中的组件的id数组

        SelectFalse: false,     //判断是否有绑定信息

        checkedComps: [],
        componentIds: [],       //传给后台的组件的id数组
        componentNames: [],       //传给后台的组件的name数组
        deviceIds: [],          //传给后台的设备的id数组
        comps: [],
        bindedDeviceList: [],
        isIndeterminate: true,
        ifShow: '',

        bindCompsId: [],
        bindCompsName: [],
        repeatCompsId: [],
        repeatCompsName: [],

        delBindId: '',
        ERDiv: null

      }
    },
    created(){
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.proId = this.$store.getters.projectId
      this.deployPlanId = this.$route.params.id
      this.getList();

      //this.ifShow = false;
    },
    methods: {
      getList() {    //获取设备信息
        this.listLoading = true
        getDevices(this.proId, this.listQuery).then(response => {
          this.list = response.data.data.content
          this.total = response.data.data.totalElements
          this.listLoading = false
          for(let i=0;i<this.list.length;i++){
            this.list[i].online = false;
            this.list[i].virtual = false;
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
        });

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
      handleSizeChange2(val) {
        // this.listQuery2.size = val
        this.listQuery2.limit = val
        this.pagesize2 = val
        compList(this.proId,this.listQuery2).then(response => {
          this.listComp = response.data.data.content
          this.total2 = response.data.data.totalElements
          this.listLoading = false
          for(var j=0;j<this.listComp.length;j++){
            this.listComp[j].isBind = false;
          }
          //this.listComp.isBind = false;
          this.bindCompsId.splice(0, this.bindCompsId.length);
          //为是否绑定赋值
          for(var i=0;i<this.listBind.length;i++){
            for(var j=0;j<this.listComp.length;j++){
              if(this.listBind[i].componentEntity.id == this.listComp[j].id){//判断id是否相等
                this.listComp[j].isBind = true;
                console.log(this.listComp[j].name);
                this.bindCompsId.push(this.listComp[j].id);
                break;
              }
            }
          }
        })
      },
      handleCurrentChange2(val) {
        this.listQuery2.page = val - 1
        this.currentPage2 = val
        compList(this.proId,this.listQuery2).then(response => {
          this.listComp = response.data.data.content
          this.total2 = response.data.data.totalElements
          this.listLoading = false
          for(var j=0;j<this.listComp.length;j++){
            this.listComp[j].isBind = false;
          }
          //this.listComp.isBind = false;
          this.bindCompsId.splice(0, this.bindCompsId.length)
          //为是否绑定赋值
          for(var i=0;i<this.listBind.length;i++){
            for(var j=0;j<this.listComp.length;j++){
              if(this.listBind[i].componentEntity.id == this.listComp[j].id){//判断id是否相等
                this.listComp[j].isBind = true;
                console.log(this.listComp[j].name)
                this.bindCompsId.push(this.listComp[j].id);
                break;
              }
            }
          }
        })
      },
      showPop(){
        //this.ifShow = true;
        //console.log(this.ifShow);
      },
      resize() {
        console.log('resize')
      },
      beforeSubmit: function (row){     //绑定前的准备工作
        // 绑定前获取设备的id，获取所选部署设计的id

        this.deviceCHId = row.id;
        this.complistLoading = true

        console.log("所选设备的id--------");
        console.log(this.deviceCHId);

        this.deployPlanId = this.$route.params.id;  //所选择的部署设计的id
        console.log(this.deployPlanId);

        this.listComp = [];

        //查询已绑定信息
        getDeployComLists(this.deployPlanId, this.deviceCHId).then(response => {
          this.listBind = response.data.data
          // this.total = response.data.total
         /* console.log(this.listBind.length);
          console.log(this.listBind);*/

          compList(this.proId,this.listQuery2).then(response => {
            this.complistLoading = false
            this.listComp = response.data.data.content
            this.total2 = response.data.data.totalElements
            this.listLoading = false
            for(var j=0;j<this.listComp.length;j++){
              this.listComp[j].isBind = false;
            }

            //this.listComp.isBind = false;

            this.bindCompsId.splice(0, this.bindCompsId.length);

            //为是否绑定赋值
            for(var i=0;i<this.listBind.length;i++){
              for(var j=0;j<this.listComp.length;j++){
                if(this.listBind[i].componentEntity.id == this.listComp[j].id){//判断id是否相等
                  this.listComp[j].isBind = true;
                  console.log(this.listComp[j].name);

                  this.bindCompsId.push(this.listComp[j].id);
                  break;
                }
              }
            }
          }).catch(() => {
            this.complistLoading = false
            this.$notify({
              title: '失败',
              message: '获取信息失败',
              type: 'error',
              duration: 2000
            })
          })
        })
      },

      handleCheckedCompsChange(val) {          //所选的组件，checkbox

        this.checkedComps = val;
        console.log(this.checkedComps)

        this.componentIds.splice(0,this.componentIds.length);

        for(let i=0;i<this.checkedComps.length;i++){
          this.componentIds.push(this.checkedComps[i].id);
        }

        console.log(this.componentIds);
      },

      submit: function () {
        //alert("hh");
        this.bindLoading = true
        this.repeatCompsId.splice(0,this.repeatCompsId.length);

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
             this.bindLoading = false
             return;
           }

           let dataBindId = (this.componentIds + '').replace(/\[|]/g,'')
           console.log(dataBindId, '99980')
           let data = {
             'deviceId': this.deviceCHId,
             'componentIds': dataBindId
           }
           let qs = require('qs')
           let dataBind = qs.stringify(data)
           doDeployBind(this.deployPlanId, dataBind).then(() => {
             this.bindLoading = false
             document.getElementById('clicktag').click()
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
             this.bindLoading = false
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
           this.bindLoading = false
         }

      },


      deleteBindRelation(row) {
        this.$confirm('确认解绑吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let delCompId = row.id;

          for(let i=0;i<this.listBind.length;i++){
              if(this.listBind[i].componentEntity.id == delCompId){  //获取此组件的绑定关系的id
                this.delBindId = this.listBind[i].id;
                console.log("要删除的绑定关系的id-------");
                console.log(this.delBindId);
                break;
              }
          }

          deleteBind(this.delBindId).then(() => {
            this.$message({
              type: 'success',
              message: '解绑成功!'
            });
            getDeployComLists(this.deployPlanId, this.deviceCHId).then((res) => {
              this.bindedDeviceList = res.data.data
            })
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '解绑失败'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解绑'
          });
        });
      },


      getDeployComList(row) {
        getDeployComLists(this.deployPlanId, row.id).then((res) => {
          this.bindedDeviceList = res.data.data
          console.log(this.bindedDeviceList,1111111111)
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
      listB: function () {
        let self = this;
        return self.listComp.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery2.toLowerCase()) !== -1;
        })
      }
    },
    mounted() {
      /*console.log("宽高----------")
      this.ERDiv = document.getElementById("ERDiv");
      console.log(ERDiv.clientHeight);
      document.getElementById("ER").style.height = (this.ERDiv.clientHeight) * 9 / 10;
      document.getElementById("ER").style.width = (this.ERDiv.clientWidth) * 95 / 100;*/
    }

  }
</script>

<style scoped>
  .splicClass{
    min-height: 530px;
    position: relative;
    border: 1px solid lightgrey;
  }
  div.isBinded {
    background: #E6E6FA;
  }

</style>
