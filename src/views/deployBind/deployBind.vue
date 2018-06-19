<template>
  <div class="app-container calendar-list-container">

    <split-pane v-on:resize="resize" split="vertical" class="splicClass">
      <template slot="paneL">
        <div class="left-container">
          <div class="filter-container" style="margin-top:5px;">
            <el-input style="width: 200px;" class="filter-item" placeholder="设备名" v-model="searchQuery">
            </el-input>

          </div>
          <div style="height: 440px;overflow-y: auto;">
            <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                      style="width: 100%;">
              <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

              <div>

              </div>
              <el-table-column align="center" :label="$t('table.deviceName')" min-width="140">
                <template slot-scope="scope">
                  <span @click="getDeployComList(scope.row)" style="cursor: pointer">{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column width="150px" align="center" :label="$t('table.deviceIP')">
                <template slot-scope="scope">
                  <span>{{scope.row.ip}}</span>
                </template>
              </el-table-column>
              <el-table-column width="110px" align="center" :label="$t('table.deviceState')">
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

                    <div style="height: 425px;overflow-y: auto;margin-top: 20px;" id="compTab">
                      <el-table :key='tableKey' :data="listB" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                                highlight-current-row
                                style="width: 100%;"
                                @selection-change="handleCheckedCompsChange" id="compTable">
                        <el-table-column
                          type="selection"
                          width="55"
                          align="center">
                        </el-table-column>
                        <el-table-column :label="$t('table.compName')" width="140" align="center">
                          <template slot-scope="scope">
                            <span @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column width="100px" align="center" :label="$t('table.compVersion')">
                          <template slot-scope="scope">
                            <span>{{scope.row.version}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column min-width="100px" align="center" :label="$t('table.compSize')">
                          <template slot-scope="scope">
                            <span>{{scope.row.displaySize}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="解绑" width="80" align="center">
                          <template slot-scope="scope">
                            <!--<span>{{scope.row.isBind}}</span>-->
                            <el-button type="danger" icon="el-icon-delete" size="mini" circle v-if="scope.row.isBind" @click="deleteBindRelation(scope.row)"></el-button>
                          </template>
                        </el-table-column>

                      </el-table>
                    </div>

                    <div style="margin-top: 20px;">
                      <el-button size="mini" type="success" style="float:right;" @click="submit()">绑定</el-button>
                    </div>
                    <el-button type="primary" size="mini" icon="el-icon-arrow-right" slot="reference" @click="showPop"></el-button>
                  </el-popover>

                </template>
              </el-table-column>
            </el-table>
          </div>


        </div>
      </template>
      <template slot="paneR">
        <div>
          <!--<div id="deviceComp" style="width: 100%;height:440px;"></div>-->
          <div class='chart-container'>
            <deployBindER height='450px' width='450px' :detaillist="bindedDeviceList"></deployBindER>
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
        total: null,
        listLoading: true,

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

        delBindId: ''

      }
    },
    created(){
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.proId = this.getCookie('projectId')
      this.deployPlanId = this.$route.params.id
      this.getList();
      //this.getListComp();

      //this.ifShow = false;
    },
    methods: {
      getList() {     //获取设备信息
        this.listLoading = true
        getDevices(this.proId, this.userData).then(response => {
          this.list = response.data.data
          this.listLoading = false
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

        console.log("所选设备的id--------");
        console.log(this.deviceCHId);

        this.deployPlanId = this.$route.params.id;  //所选择的部署设计的id
        console.log(this.deployPlanId);

        // this.getListComp();
        this.listComp = [];

        //查询已绑定信息
        getDeployComLists(this.deployPlanId, this.deviceCHId, this.userData).then(response => {
          this.listBind = response.data.data
          this.total = response.data.total
          this.listLoading = false

          console.log(this.listBind.length);
          console.log(this.listBind);

          compList(this.userData).then(response => {
            this.listComp = response.data.data
            this.total = response.data.total
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

             return;
           }


           let formData = new FormData();
           formData.append('componentIds', this.componentIds);

           doDeployBind(this.deployPlanId, this.deviceCHId, formData).then(() => {
             this.$notify({
               title: '成功',
               message: '绑定成功',
               type: 'success',
               duration: 2000
             })

             getDeployComLists(this.deployPlanId, this.deviceCHId, this.userData).then((res) => {
               this.bindedDeviceList = res.data.data
             })

             //this.ifShow = false;
             this.getListComp();

           })
             .catch(() =>{
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
         }


        /* var qs = require('qs');
        let username = this.getCookie('username');
        let password = this.getCookie('password');

        let deployPlanId = this.$route.params.id;  //所选择的部署设计的id
        console.log("所选择的部署设计的id-----------------");
        console.log(deployPlanId);

        if (this.diveceIdPass.length != 0) {   //是否有要绑定的数据
          let formData = new FormData();
          formData.append('deviceIds', this.diveceIdPass);
          formData.append('componentIds', this.compsIdPass);

          this.$axios.post(this.getIP() + 'deploymentdesigns/' + deployPlanId + "/deploymentdesigndetails", formData,

            {

              //设置头
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              auth: {
                username: username,
                password: password
              }
            }).then(res => {
            layer.msg("保存成功");
            this.$router.replace({path: '/deployplan'})
          })
            .catch(err => {
              layer.msg("保存失败！");
            })
        } else {
          layer.msg("无绑定信息");
        }*/


      },

      deleteBind: function(){

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

          deleteBind(this.delBindId, this.userData).then(() => {
            this.$message({
              type: 'success',
              message: '解绑成功!'
            });
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
        getDeployComLists(this.deployPlanId, row.id, this.userData).then((res) => {
          this.bindedDeviceList = res.data.data
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
    }
  }
</script>

<style scoped>
  .splicClass{
    min-height: 530px;
    position: relative;
    max-height: 530px;
    border: 1px solid lightgrey;
  }
  div.isBinded {
    background: #E6E6FA;
  }

</style>
