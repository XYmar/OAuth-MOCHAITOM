<!--
<template>
  <div class="app-container">
    <div class="deployplanSelector" style="margin-bottom: 10px;">
      <el-select v-model="selectDeploy" filterable placeholder="请选择部署设计">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <tree-table :data="data" :columns="columns"></tree-table>
    <div class="container" style="float:left">
      请选择内容
    </div>
  </div>
</template>

<script>
  /**
   Auth: Lei.j1ang
   Created: 2018/1/19-14:54
   */
  import treeTable from './treeTable'

  export default {
    name: 'treeTableDemo',
    components: { treeTable },
    data() {
      return {
        columns: [
          {
            text: '设备（IP）/软件名',
            value: 'event'
          },
          {
            text: '软件状态',
            value: 'id'
          },
          {
            text: '设备状态',
            value: 'timeLine'
          }
        ],
        data: [
          {
            id: 0,
            event: '设备1',
            timeLine: '离线',
            comment: '无'
          },
          {
            id: 1,
            event: '设备2',
            timeLine: '离线',
            comment: '无',
            children: [
              {
                id: 2,
                event: '组件1',
                timeLine: '离线',
                comment: '无'
              },
              {
                id: 3,
                event: '组件2',
                timeLine: '离线',
                comment: '无',
                children: [
                  {
                    id: 4,
                    event: '文件1',
                    timeLine: '离线',
                    comment: '无'
                  },
                  {
                    id: 5,
                    event: '文件2',
                    timeLine: '离线',
                    comment: '无'
                  },
                  {
                    id: 6,
                    event: '文件3',
                    timeLine: '离线',
                    comment: '无',
                    children: [
                      {
                        id: 7,
                        event: '事件7',
                        timeLine: '离线',
                        comment: '无',
                        children: [
                          {
                            id: 71,
                            event: '事件71',
                            timeLine: '离线',
                            comment: 'xx'
                          },
                          {
                            id: 72,
                            event: '事件72',
                            timeLine: '离线',
                            comment: 'xx'
                          },
                          {
                            id: 73,
                            event: '事件73',
                            timeLine: '离线',
                            comment: 'xx'
                          }
                        ]
                      },
                      {
                        id: 8,
                        event: '事件8',
                        timeLine: '离线',
                        comment: '无'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        options: [{
          value: '选项1',
          label: '部署设计1'
        }, {
          value: '选项2',
          label: '部署设计2'
        }, {
          value: '选项3',
          label: '部署设计3'
        }, {
          value: '选项4',
          label: '部署设计4'
        }, {
          value: '选项5',
          label: '部署设计5'
        }, {
          value: '选项6',
          label: '部署设计1'
        }, {
          value: '选项7',
          label: '部署设计2'
        }, {
          value: '选项8',
          label: '部署设计3'
        }, {
          value: '选项9',
          label: '部署设计4'
        }, {
          value: '选项10',
          label: '部署设计5'
        }
        ],
        selectDeploy: ''
      }
    }
  }
</script>
-->
<template>
  <div class="app-container">
    <div class="container">
      <div class="content">
        <div class="selectBox">
          <!--<span class="text">
            选择部署设计
          </span>-->
          <div class="span8" id="scan-selection">
            <el-select v-model="selected" placeholder="请选择部署设计"
                       @change="changeDeployPlan"
                       value-key="id"
            >
              <el-option
                v-for="deployplan in deployplanInfos"
                :key="deployplan.id"
                :label="deployplan.name"
                :value="deployplan">
                {{ deployplan.name }}
              </el-option>
            </el-select>
          </div>
          <div class="searchBox">
            <el-input class="search" type="text" placeholder="搜索.." v-model="searchQuery"/>
          </div>
        </div>
        <div class="showDetail">
          <el-table :key='tableKey'
                    v-loading="listLoading"
                    element-loading-text="给我一点时间"
                    border fit highlight-current-row
                    style="width:100%;height:100%">
            <el-table-column min-width="140px" align="center" :label="$t('table.fileName')">
              <template slot-scope="scope">
                <span></span>
              </template>
            </el-table-column>
            <el-table-column min-width="140px" align="center" :label="$t('table.path')">
              <template slot-scope="scope">
                <span></span>
              </template>
            </el-table-column>
            <el-table-column width="100px" align="center" :label="$t('table.fileType')">
              <template slot-scope="scope">
                <span></span>
              </template>
            </el-table-column>
            <el-table-column width="180px" align="center" :label="$t('table.editDate')">
              <template slot-scope="scope">
                <span></span>
              </template>
            </el-table-column>
            <el-table-column width="120px" align="center" :label="$t('table.fileSize')">
              <template slot-scope="scope">
                <span></span>
              </template>
            </el-table-column>
            <el-table-column class-name="status-col" :label="$t('table.versionStatus')" width="120px">
              <template slot-scope="scope">
                <!--<el-tag :type="scope.row.deployStatus | statusFilter"></el-tag>-->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div id="areaTree">
          <div class="tree-box">
            <el-table class="table table-hover">
              <el-table-column label="设备/软件名">
              </el-table-column>
              <el-table-column label="软件状态">
              </el-table-column>
              <el-table-column label="设备状态">
              </el-table-column>
            </el-table>
            <div class="zTreeDemoBackground left">
              <ul id="treeDemo" class="ztree" style="white-space: nowrap;">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="btns">
        <div class="btn-group" style="margin-top: 20px;padding-bottom: 20px;height: 80px;">
          <el-col class="pan-btn light-blue-btn" style="width:150px" @click="scanAll()"><svg-icon icon-class="circle"></svg-icon>完整扫描
          </el-col>
          <el-col class="pan-btn light-blue-btn" style="width:150px" @click="scanQuick1()"><svg-icon icon-class="lightning"></svg-icon>快速扫描
          </el-col>
          <el-col class="pan-btn green-btn" style="width:130px; float: right;margin-right: 0"><svg-icon icon-class="upload"></svg-icon>上传
          </el-col>
        </div>
        <!-- <div class="btn-group pull-right" style="margin-top: 20px;">
           <button class="btn-glow success" style="width:130px"><i class="icon-cloud-upload"></i>上传
           </button>
         </div>-->
      </div>
    </div>
    <!--上传组件-->
    <!--<div class="modal fade" id="modal-select">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="formReset">
              <span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">请填写后缀名：</h4>
          </div>
          <div class="modal-body" style="width: 530px;">
            &lt;!&ndash; form start &ndash;&gt;
            <form class="form-horizontal">
              <div style="margin-top: 23px;">
                <span>后缀名:</span>
                <input type="text" id="input-extensions" style="height:20px">(例如:exe,txt)
              </div>

              <br/>

              &lt;!&ndash; <div style="margin-top: 17px;">
                <span>路径:</span>
                <input type="text" id="input-path" style="margin-left: 12px;height:25px">
              </div> &ndash;&gt;

              &lt;!&ndash;<div style="margin-left: 148px;margin-top: 22px;">
                <button type="submit" class="btn-glow primary" @click="scanQuick">确认</button>
                <button type="submit" class="btn-glow primary" @click="formReset">取消</button>
              </div>&ndash;&gt;

              <div class="pull-right">
                <button type="submit" class="btn-flat danger" @click="scanQuick">确认</button>
                <button type="submit" class="btn-flat primary" @click="formReset">取消</button>
              </div>


            </form>

          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
  /* eslint-disable */
  var relativePath = "";
  function getCurrentRoot(treeNode) {
    if (treeNode.getParentNode() != null) {
      var parentNode = treeNode.getParentNode();
      relativePath =
        treeNode.getParentNode().name + "/" + relativePath + treeNode.name;
      return getCurrentRoot(parentNode);
    } else {
      return treeNode.id;
    }
  }
  let deviceNodeId;
  let deployPlanId;
  let deviceId;
  let componentNodeId;//以上为点击树显示时所用变量

  let deviceAllId;
  let deployAllId;//扫描时用的变量

  let deviceName; //扫描的设备名

  let deployPlanDetailEntities;
  let deployplanZtreeId;

  let zNodes = [
    { id:1,pid:0,name:"大良造菜单",open:true,nocheck:false,
      children: [
        { id:11,pid:1,name:"当前项目"},
        { id:12,pid:1,name:"工程管理",open:true,
          children: [
            { id:121,pid:12,name:"我的工程"},
            { id:122,pid:12,name:"施工调度"},
            { id:1211,pid:12,name:"材料竞价"}
            ]
        },
        { id:13,pid:1,name:"录入管理",open:true,
          children: [
            { id:131,pid:13,name:"用工录入"},
            { id:132,pid:13,name:"商家录入"},
            { id:1314,pid:13,name:"机构列表"}
            ]
        },
        { id:14,pid:1,name:"审核管理",open:true,
          children: [
            { id:141,pid:14,name:"用工审核"},
            { id:142,pid:14,name:"商家审核"},
            { id:145,pid:14,name:"机构审核"}
            ]
        },
        { id:15,pid:1,name:"公司管理",open:true,
          children: [
            { id:1517,pid:15,name:"我的工程案例"},
            { id:1518,pid:15,name:"联系人设置"},
            { id:1519,pid:15,name:"广告设置"}
            ]
        },
        { id:16,pid:1,name:"业务管理",open:true,
          children: [
            { id:164,pid:16,name:"合同范本"},
            { id:165,pid:16,name:"合同列表"},
            { id:166,pid:16,name:"需求调度"}
            ]
        },
        { id:17,pid:1,name:"订单管理",open:true,
          children: [
            { id:171,pid:17,name:"商品订单"},
            { id:172,pid:17,name:"用工订单"},
            { id:175,pid:17,name:"供应菜单"}
            ]
        },
        { id:18,pid:1,name:"我的功能",open:true,
          children: [
            { id:181,pid:18,name:"免费设计"},
            { id:182,pid:18,name:"装修报价"},
            { id:1817,pid:18,name:"项目用工"}
            ]
        },
        { id:19,pid:1,name:"分润管理",open:true,
          children: [
            { id:191,pid:19,name:"分润列表"}
            ]
        },
        { id:110,pid:1,name:"运营管理",open:true,
          children: [
            { id:1101,pid:110,name:"代理列表"},
            { id:1102,pid:110,name:"代售商品"}
            ]
        },
        ]
    }
    ]
  let setting = {
    view: {
      dblClickExpand: false,
    },
    edit: {
      enable: true,
      showRenameBtn: false,
      showRemoveBtn: false
    },
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {

      onClick: this.zTreeOnClick,
      onDblClick: this.zTreeOnDblClick
    },
    check: {                                 //树上加CheckBox
      autoCheckTrigger: false,
      chkboxType: {"Y": "ps", "N": "ps"},
      chkStyle: "checkbox",
      enable: true
    }
  };

  let childrenInfo = [];//所有文件的信息

  let zTree;
  let zTreeDblFlag = false;//为true时，代表扫描结束，双击显示的为扫描之后的信息
  let tempZtree = [];//存放扫描之后的树节点信息
  export default {
    name: "areaTree",
    components: {
    },
    /* eslint-disable */
    data() {
      return {
        list: [],
        searchQuery: '',
        componentEntity: [],
        selected: "",
        deployplanInfos: [],
      };
    },
    created() {
      //日历
      this.$nextTick(function () {
        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
      });

      //下拉框数据
     /* this.$axios.get(this.getIP() + "projects/" + projectId + "/deploymentdesigns", {
        //设置头
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        auth: {
          username: username,
          password: password
        }
      }).then(res => {

        for (let i = 0; i < res.data.data.length; i++) {
          this.deployplanInfos.push({
            id: res.data.data[i].id,
            name: res.data.data[i].name
          })
        }


      }).catch(err => {
        console.log(err);
      });
*/
    },
    methods: {

      formReset: function () {
        $("input").val('');
        $("#modal-select").modal('hide');
      },

      //截取路径生成树，例如：从路径中的某个节点与他父节点之下的节点比较
      handleInfo: function (item, path, idCom, idFlag) {
        if (item == null)
          return;

        if (item.hasOwnProperty("children")) {
          //循环当前父节点下的子节点，与将要插入的比较
          //如果有相等的，则返回该子节点，如果没有，则将节点添加到树上并返回该节点。
          let flag;
          for (let i = 0; i < item.children.length; i++) {
            flag = true;
            if (item.children[i].name == path) {
              item = item.children[i];
              flag = false;
              return item;
            }
          }

          if (flag) {
            item.children.push({"name": path, "id": idCom});
            item = item.children[item.children.length - 1];
            return item;
          }

        } else {
          if (idFlag == true) {
            item.children = [];
            item.children.push({"name": path, "id": idCom});
            item = item.children[0];
            return item;
          }
          item.children = [];
          item.children.push({"name": path});
          item = item.children[0];
          return item;
        }

      },

      //下拉框选择部署，显示树
      changeDeployPlan: function () {

        let username = this.getCookie('username');
        let password = this.getCookie('password');

        zNodes.length = 0;
        // deployplanZtreeId = this.selected
        deployplanZtreeId = this.selected.id;

        setting = {
          view: {
            dblClickExpand: false,
          },
          edit: {
            enable: true,
            showRenameBtn: false,
            showRemoveBtn: false
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {

            onClick: this.zTreeOnClick,
            onDblClick: this.zTreeOnDblClick
          },
          check: {                                 //树上加CheckBox
            autoCheckTrigger: false,
            chkboxType: {"Y": "ps", "N": "ps"},
            chkStyle: "checkbox",
            enable: true
          }
        };


        this.$axios.get(this.getIP() + 'deploymentdesigns/' + deployplanZtreeId + '/deploymentdesigndetails', {
          //设置头
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          },
          auth: {
            username: username,
            password: password
          }
        }).then(res => {

          let item;

          deployPlanDetailEntities = res.data.data;

          for (let j = 0; j < deployPlanDetailEntities.length; j++) {

            let deviceNode = {};//设备
            let componentNode = {};//组件

            deviceNode.id = deployPlanDetailEntities[j].deviceEntity.id;
            deviceNode.state = deployPlanDetailEntities[j].deviceEntity.online;

            componentNode.id = deployPlanDetailEntities[j].componentEntity.id;
            componentNode.name = deployPlanDetailEntities[j].componentEntity.name;
            componentNode.deviceId = deployPlanDetailEntities[j].deviceEntity.id;
            componentNode.componentNodeInfo = deployPlanDetailEntities[j].componentEntity.componentDetailEntities;
            componentNode.state = "--";


            //生成树，只包括设备和组件
            if (zNodes.length > 0) {
              let flag = true;
              all:
                for (let k = 0; k < zNodes.length; k++) {

                  if (zNodes[k].id == deviceNode.id) {

                    for (let l = 0; l < zNodes[k].children.length; l++) {
                      if (zNodes[k].children[l].id == componentNode.id) {
                        flag = false;
                        break all;

                      }
                    }

                    zNodes[k].children.push(componentNode);

                    flag = false;
                    break;
                  }
                }

              if (flag) {

                if (deployPlanDetailEntities[j].deviceEntity.online == false) {
                  deployPlanDetailEntities[j].deviceEntity.online = "离线";
                } else {
                  deployPlanDetailEntities[j].deviceEntity.online = "在线";

                }
                deviceNode.name =
                  deployPlanDetailEntities[j].deviceEntity.name + "(" +
                  deployPlanDetailEntities[j].deviceEntity.ip + ")" + "" + deployPlanDetailEntities[j].deviceEntity.online;

                var ary = deviceNode.name.split(")");
                deviceNode.name = deviceNode.name.replace(')', ')           ');

                deviceNode.deployPlanId = deployplanZtreeId;

                deviceNode.nocheck = true;                 //去掉设备后的CheckBox

                let children = [];
                children.push(componentNode);
                deviceNode.children = children;
                zNodes.push(deviceNode);
              }

            } else {
              if (deployPlanDetailEntities[j].deviceEntity.online == false) {
                deployPlanDetailEntities[j].deviceEntity.online = "离线";
              } else {
                deployPlanDetailEntities[j].deviceEntity.online = "在线";
              }

              deviceNode.name =
                deployPlanDetailEntities[j].deviceEntity.name + "(" +
                deployPlanDetailEntities[j].deviceEntity.ip + ")" + "" + deployPlanDetailEntities[j].deviceEntity.online;

              var ary = deviceNode.name.split(")");
              deviceNode.name = deviceNode.name.replace(')', ')           ');
              deviceNode.deployPlanId = deployplanZtreeId;

              deviceNode.nocheck = true;                   //去掉设备后的CheckBox

              let children = [];
              children.push(componentNode);
              deviceNode.children = children;

              zNodes.push(deviceNode);

            }
          }


          for (let j = 0; j < zNodes.length; j++) {
            for (let l = 0; l < zNodes[j].children.length; l++) {
              //对比时，是路径节点与根节点下的孩子节点比较
              let componentFile = zNodes[j].children[l].componentNodeInfo;//组件

              for (let m = 0; m < componentFile.length; m++) {
                childrenInfo.push(componentFile[m]);//存放所有的文件信息

                let item = zNodes[j].children[l];//组件作为判断开始的父节点

                let path = (componentFile[m].path).split('/');
                let idCom = componentFile[m].id;

                for (let i = 1; i < path.length; i++) {
                  let idFlag;
                  if (i == path.length - 1) {
                    idFlag = true;//最后一个即为单个的文件
                  }
                  item = this.$options.methods.handleInfo(item, path[i], idCom, idFlag);
                }
              }
            }
          }

          $.fn.zTree.init($("#treeDemo"), setting, zNodes);

        }).catch(err => {
          console.log(err);
        });

      },

      //双击动作
      zTreeOnDblClick: function (e, treeId, treeNode) {
        let username = this.getCookie('username');
        let password = this.getCookie('password');

        deviceNodeId = '';
        deployPlanId = '';
        componentNodeId = '';

        deviceId = '';

        this.componentEntity = [];//表格数据

        zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.expandNode(treeNode);

        if (zTreeDblFlag) {//扫描之后的数据显示

          if (zTree.getSelectedNodes()[0].deviceId) {
            componentNodeId = zTree.getSelectedNodes()[0].id;
            this.$axios.get(this.getIP() + "components/" + componentNodeId, {
              headers: {
                "content-type": "application/x-www-form-urlencoded"
              },
              auth: {
                username: username,
                password: password
              }
            }).then(res => {
              for (let i = 0; i < res.data.data.componentDetailEntities.length; i++) {
                for (let j = 0; j < tempZtree.length; j++) {//扫描之后的数据信息
                  if (res.data.data.componentDetailEntities[i].id == tempZtree[j].id) {
                    res.data.data.componentDetailEntities[i] = tempZtree[j];
                  }
                }
                this.componentEntity.push(res.data.data.componentDetailEntities[i]);

                //size
                /*for (let j = 0; j < this.componentEntity.length; j++) {
                  this.componentEntity[j].size = ((this.componentEntity[j].size) / 1024 / 1024).toFixed(5);
                }*/

              }
              ;

            }).catch(err => {

            });
          } else if (zTree.getSelectedNodes()[0].deployPlanId) {
            deviceNodeId = zTree.getSelectedNodes()[0].id;
            deployPlanId = zTree.getSelectedNodes()[0].deployPlanId;
            this.$axios.get(this.getIP() + "deploymentdesigns/" + deployPlanId + "/deploymentdesigndetails/devices/" + deviceNodeId, {
              headers: {
                "content-type": "application/x-www-form-urlencoded"
              },
              auth: {
                username: username,
                password: password
              }
            }).then(res => {
              for (let i = 0; i < res.data.data.length; i++) {
                for (let j = 0; j < res.data.data[i].componentEntity.componentDetailEntities.length; j++) {
                  for (let k = 0; k < tempZtree.length; k++) {
                    if (res.data.data[i].componentEntity.componentDetailEntities[j].id == tempZtree[k].id) {
                      res.data.data[i].componentEntity.componentDetailEntities[j] = tempZtree[k];
                    }
                  }
                  this.componentEntity.push(res.data.data[i].componentEntity.componentDetailEntities[j]);
                }
              }

              //size
              /*for (let j = 0; j < this.componentEntity.length; j++) {
                this.componentEntity[j].size = ((this.componentEntity[j].size) / 1024 / 1024).toFixed(5);
              }*/
            }).catch(err => {

            });

          } else if (zTree.getSelectedNodes()[0].hasOwnProperty("children")) {
            for (let i = 0; i < zTree.getSelectedNodes()[0].children.length; i++) {
              if (zTree.getSelectedNodes()[0].children[i].hasOwnProperty("children") == false) {
                for (let j = 0; j < childrenInfo.length; j++) {
                  if (childrenInfo[j].id == zTree.getSelectedNodes()[0].children[i].id) {
                    zTree.getSelectedNodes()[0].children[i] = childrenInfo[j];
                    this.componentEntity.push(childrenInfo[j]);
                    break;
                  }
                }
              }
            }

            //size
            /*for (let j = 0; j < this.componentEntity.length; j++) {
              this.componentEntity[j].size = ((this.componentEntity[j].size) / 1024 / 1024).toFixed(5);
            }*/

          } else if (zTree.getSelectedNodes()[0].hasOwnProperty("children") == false) {

            for (let j = 0; j < childrenInfo.length; j++) {
              if (childrenInfo[j].id == zTree.getSelectedNodes()[0].id) {
                this.componentEntity.push(childrenInfo[j]);

                break;
              }
            }

            //size
            /*for (let j = 0; j < this.componentEntity.length; j++) {
              this.componentEntity[j].size = ((this.componentEntity[j].size) / 1024 / 1024).toFixed(5);
            }*/
          }
        } else {//没有扫描之前的数据显示

          this.componentEntity.splice(0, this.componentEntity.length);

          if (zTree.getSelectedNodes()[0].deviceId) {//有deviceId字段，说明是组件
            componentNodeId = zTree.getSelectedNodes()[0].id;

            this.$axios.get(this.getIP() + "components/" + componentNodeId, {
              headers: {
                "content-type": "application/x-www-form-urlencoded"
              },
              auth: {
                username: username,
                password: password
              }
            }).then(res => {

              for (let i = 0; i < res.data.data.componentDetailEntities.length; i++) {
                res.data.data.componentDetailEntities[i].state = "--";
                this.componentEntity.push(res.data.data.componentDetailEntities[i]);
              }

              //size
              /*for (let j = 0; j < this.componentEntity.length; j++) {
                this.componentEntity[j].size = ((this.componentEntity[j].size) / 1024 / 1024).toFixed(5);
              }*/

            }).catch(err => {

            });
          } else if (zTree.getSelectedNodes()[0].deployPlanId) {//有deployPlanId字段，说明是设备
            deviceNodeId = zTree.getSelectedNodes()[0].id;
            deployPlanId = zTree.getSelectedNodes()[0].deployPlanId;
            this.$axios
              .get(this.getIP() + "deploymentdesigns/" + deployPlanId + "/deploymentdesigndetails/devices/" + deviceNodeId, {
                headers: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                auth: {
                  username: username,
                  password: password
                }
              }).then(res => {

              for (let i = 0; i < res.data.data.length; i++) {
                for (let j = 0; j < res.data.data[i].componentEntity.componentDetailEntities.length; j++) {
                  res.data.data[i].componentEntity.componentDetailEntities[j].state = "--";
                  this.componentEntity.push(res.data.data[i].componentEntity.componentDetailEntities[j]);

                }
              }

              //size
              /*for (let j = 0; j < this.componentEntity.length; j++) {
                this.componentEntity[j].size = ((this.componentEntity[j].size) / 1024 / 1024).toFixed(5);
              }*/

            }).catch(err => {
            });
          } else if (zTree.getSelectedNodes()[0].hasOwnProperty("children")) {//除设备和组件之外的文件夹

            this.componentEntity.splice(0, this.componentEntity.length);

            for (let i = 0; i < zTree.getSelectedNodes()[0].children.length; i++) {
              if (zTree.getSelectedNodes()[0].children[i].hasOwnProperty("children") == false) {
                for (let j = 0; j < childrenInfo.length; j++) {
                  if (childrenInfo[j].id == zTree.getSelectedNodes()[0].children[i].id) {
                    zTree.getSelectedNodes()[0].children[i] = childrenInfo[j];
                    this.componentEntity.push(childrenInfo[j]);
                    break;
                  }
                }
              }
            }

            //size
            /*for (let j = 0; j < this.componentEntity.length; j++) {
              this.componentEntity[j].size = ((this.componentEntity[j].size) / 1024 / 1024).toFixed(5);
            }*/

          } else if (zTree.getSelectedNodes()[0].hasOwnProperty("children") == false) {//没有孩子的单个文件

            this.componentEntity.splice(0, this.componentEntity.length);

            for (let j = 0; j < childrenInfo.length; j++) {
              if (childrenInfo[j].id == zTree.getSelectedNodes()[0].id) {
                this.componentEntity.push(childrenInfo[j]);
                break;
              }
            }

            //size
            /*for (let j = 0; j < this.componentEntity.length; j++) {
              this.componentEntity[j].size = ((this.componentEntity[j].size) / 1024 / 1024).toFixed(5);
            }*/
          }

        }
      },

      zTreeOnClick: function (e, treeId, treeNode) {
        zTree = $.fn.zTree.getZTreeObj("treeDemo");

        console.log(zTree.getSelectedNodes());
        console.log(zTree.getSelectedNodes()[0].deviceId);
        if (zTree.getSelectedNodes()[0].deployPlanId) {
          deviceAllId = zTree.getSelectedNodes()[0].id;
          deployAllId = zTree.getSelectedNodes()[0].deployPlanId;

          deviceName = zTree.getSelectedNodes()[0].name;

          console.log(deviceName);
        }else{
          deviceName = "";
        }
        /*if (zTree.getSelectedNodes()[0].deviceId) {
        } else if (zTree.getSelectedNodes()[0].deployPlanId) {
          deviceAllId = zTree.getSelectedNodes()[0].id;
          deployAllId = zTree.getSelectedNodes()[0].deployPlanId;

          deviceName = zTree.getSelectedNodes()[0].name;

          console.log(deviceName);


        }*/
      },

      scanAll: function () {
        let username = this.getCookie('username');
        let password = this.getCookie('password');


        if (zTree.getSelectedNodes()[0].state == false) {//设备不在线，无法扫描
          layer.msg("设备离线！");
        }
        else if (deviceName == "") {
          layer.msg("请选择设备！");
        }
        else {
          console.log(deviceAllId);
          console.log(deployAllId);

          layer.load();

          this.$axios.get(
            this.getIP() + "deploymentdesigns/" +
            deployAllId +
            "/devices/" +
            deviceAllId + "/scan" + "?extensions",
            {
              //设置头
              headers: {
                "content-type": "application/x-www-form-urlencoded"
              },
              auth: {
                username: username,
                password: password
              }
            }).then(res => {
            layer.closeAll('loading');

            //连续扫描，组件后面的软件状态会保留每次的结果，所以下次扫描后，先把上次的结果去掉
            for (let i = 0; i < zNodes.length; i++) {
              for (let j = 0; j < zNodes[i].children.length; j++) {
                var regex = /\(/g;
                var str = zNodes[i].children[j].name;
                if (regex.test(str)) {
                  let zname = zNodes[i].children[j].name.split('(');
                  zNodes[i].children[j].name = zname[0];
                }
              }
            }

            let correct = [];
            let unknown = [];
            let modifyed = [];
            let miss = [];
            //上面四个数组存放扫描后的文件，排序使用

            if (res.data.data.length > 0) {
              for (let i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].correctComponentFiles.length > 0) {
                  for (let j = 0; j < res.data.data[i].correctComponentFiles.length; j++) {

                    for (let k = 0; k < this.componentEntity.length; k++) {

                      if (res.data.data[i].correctComponentFiles[j].id == this.componentEntity[k].id) {
                        this.componentEntity[k].state = '√';

                        correct.push(this.componentEntity[k]);

                        break;
                      }
                    }
                  }
                }
                ;

                if (res.data.data[i].unknownFiles.length > 0) {
                  for (let j = 0; j < res.data.data[i].unknownFiles.length; j++) {

                    for (let k = 0; k < this.componentEntity.length; k++) {

                      if (res.data.data[i].unknownFiles[j].id == this.componentEntity[k].id) {
                        this.componentEntity[k].state = '?';

                        unknown.push(this.componentEntity[k]);
                        break;

                      }

                    }

                  }
                }
                ;

                if (res.data.data[i].modifyedComponentFiles.length > 0) {
                  for (let j = 0; j < res.data.data[i].modifyedComponentFiles.length; j++) {

                    for (let k = 0; k < this.componentEntity.length; k++) {

                      if (res.data.data[i].modifyedComponentFiles[j].id == this.componentEntity[k].id) {
                        this.componentEntity[k].state = '×';
                        modifyed.push(this.componentEntity[k]);
                        break;
                      }

                    }

                  }

                }
                ;
              }
              ;

              for (let k = 0; k < this.componentEntity.length; k++) {

                if (this.componentEntity[k].state == "--") {

                  this.componentEntity[k].state = "!";
                  miss.push(this.componentEntity[k]);
                }
                ;

              }
              ;

              //表格数据排序
              this.componentEntity.splice(0, this.componentEntity.length);
              for (let i = 0; i < unknown.length; i++) {
                this.componentEntity.push(unknown[i]);
                tempZtree.push(unknown[i]);
              }

              for (let i = 0; i < modifyed.length; i++) {
                this.componentEntity.push(modifyed[i]);
                tempZtree.push(modifyed[i]);
              }

              for (let i = 0; i < miss.length; i++) {
                this.componentEntity.push(miss[i]);
                tempZtree.push(miss[i]);
              }

              for (let i = 0; i < correct.length; i++) {
                this.componentEntity.push(correct[i]);
                tempZtree.push(correct[i]);
              }


            }
            ;


            //扫描完后，添加软件状态
            for (let i = 0; i < zNodes.length; i++) {
              if (zNodes[i].id == zTree.getSelectedNodes()[0].id) {
                for (let j = 0; j < zNodes[i].children.length; j++) {

                  for (let k = 0; k < res.data.data.length; k++) {
                    if (zNodes[i].children[j].id == res.data.data[k].componentId) {
                      if (res.data.data[k].hasCorrectComponentFiles == true && res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == false) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "√" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == false) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == false) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "?" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == true) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "!" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == false) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×," + "?" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == true) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×," + "!" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == true) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "?," + "!" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == true) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×," + "?," + "!" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      }

                    }
                  }
                }
              }
            }


            $.fn.zTree.init($("#treeDemo"), setting, zNodes);

            zTreeDblFlag = true;//代表扫描结束，树的双击事件信息显示由此判断

            layer.msg("扫描结束");

            //扫描之后更新存放文件信息的数组childrenInfo
            for (let i = 0; i < tempZtree.length; i++) {
              for (let j = 0; j < childrenInfo.length; j++) {
                if (childrenInfo[j].id == tempZtree[i].id) {
                  childrenInfo[j] = tempZtree[i];
                }
              }
            }

          }).catch(err => {
            console.log(err);
            layer.msg("完整扫描异常");
            layer.closeAll('loading');


          });


        }
      },
      //扫描弹框的实现
      scanQuick1: function () {
        if (zTree.getSelectedNodes()[0].state == false) {
          layer.msg("设备离线！");
        } else {
          $("#modal-select").modal('show');

          if (this.getCookie('extensions')) {//防止乱码
            document.getElementById("input-extensions").value = decodeURIComponent(this.getCookie('extensions'));
          }

          let temp = [];
          //快速扫描,扫描某种后缀的文件
          for (let i = 0; i < childrenInfo.length; i++) {
            if (childrenInfo[i].type == document.getElementById("input-extensions").value) {
              temp.push(childrenInfo[i]);
            }
          }

          for (let j = 0; j < temp.length; j++) {
            childrenInfo.splice(0, childrenInfo.length);
            childrenInfo.push(temp[j]);
          }
        }

      },

      //快速扫描
      scanQuick(event) {
        let username = this.getCookie('username');
        let password = this.getCookie('password');

        $("#modal-select").modal('hide');
        layer.load();

        let extensions = document.getElementById("input-extensions").value;
        let expireDays = 1000 * 60 * 60 * 24 * 15;
        this.setCookie('extensions', extensions, expireDays);

        //表格显示所选后缀名文件
        let temp = [];
        for (let i = 0; i < this.componentEntity.length; i++) {
          if (this.componentEntity[i].type == extensions) {
            temp.push(this.componentEntity[i]);
          }
        }
        this.componentEntity.splice(0, this.componentEntity.length);
        this.componentEntity = temp;


        //防止多次扫描软件状态叠加
        for (let i = 0; i < zNodes.length; i++) {
          for (let j = 0; j < zNodes[i].children.length; j++) {
            var regex = /\(/g;
            var str = zNodes[i].children[j].name;
            if (regex.test(str)) {
              let zname = zNodes[i].children[j].name.split('(');
              zNodes[i].children[j].name = zname[0];
            }
          }
        }


        this.$axios
          .get(this.getIP() +
            "deploymentdesigns/" +
            deployAllId +
            "/devices/" +
            deviceAllId + "/scan" + "?extensions=" + extensions,
            {
              //设置头
              headers: {
                "content-type": "application/x-www-form-urlencoded"
              },
              auth: {
                username: username,
                password: password
              }
            }).then(res => {

          let correct = [];
          let unknown = [];
          let modifyed = [];
          let miss = [];


          //快速扫描后，更新表格数据
          if (res.data.data.length > 0) {
            for (let i = 0; i < res.data.data.length; i++) {

              for (let j = 0; j < res.data.data[i].correctComponentFiles.length; j++) {

                for (let k = 0; k < this.componentEntity.length; k++) {

                  if (res.data.data[i].correctComponentFiles[j].id == this.componentEntity[k].id) {
                    this.componentEntity[k].state = '√';
                    correct.push(this.componentEntity[k]);
                    break;
                  }

                }

              }

              for (let j = 0; j < res.data.data[i].unknownFiles.length; j++) {

                for (let k = 0; k < this.componentEntity.length; k++) {

                  if (res.data.data[i].unknownFiles[j].id == this.componentEntity[k].id) {
                    this.componentEntity[k].state = '?';
                    unknown.push(this.componentEntity[k]);
                    break;

                  }
                }
              }

              for (let j = 0; j < res.data.data[i].modifyedComponentFiles.length; j++) {

                for (let k = 0; k < this.componentEntity.length; k++) {

                  if (res.data.data[i].modifyedComponentFiles[j].id == this.componentEntity[k].id) {
                    this.componentEntity[k].state = '×';
                    modifyed.push(this.componentEntity[k]);
                    break;
                  }
                }
              }

              for (let k = 0; k < this.componentEntity.length; k++) {

                if (this.componentEntity[k].state == "--") {

                  this.componentEntity[k].state = "!";
                  miss.push(this.componentEntity[k]);
                }
              }

              //表格排序
              this.componentEntity.splice(0, this.componentEntity.length);
              for (let i = 0; i < unknown.length; i++) {
                this.componentEntity.push(unknown[i]);
                tempZtree.push(unknown[i]);
              }

              for (let i = 0; i < modifyed.length; i++) {
                this.componentEntity.push(modifyed[i]);
                tempZtree.push(modifyed[i]);
              }

              for (let i = 0; i < miss.length; i++) {
                this.componentEntity.push(miss[i]);
                tempZtree.push(miss[i]);
              }

              for (let i = 0; i < correct.length; i++) {
                this.componentEntity.push(correct[i]);
                tempZtree.push(correct[i]);
              }

            }
          }


          //扫描完后添加软件状态
          for (let i = 0; i < zNodes.length; i++) {
            for (let j = 0; j < zNodes[i].children.length; j++) {
              for (let k = 0; k < res.data.data.length; k++) {
                if (zNodes[i].children[j].id == res.data.data[k].componentId) {
                  if (res.data.data[k].hasCorrectComponentFiles == true && res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == false) {
                    zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "√" + ")";
                    zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                  } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == false) {
                    zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×" + ")";
                    zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                  } else if (res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == false) {
                    zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "?" + ")";
                    zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                  } else if (res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == true) {
                    zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "!" + ")";
                    zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                  } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == false) {
                    zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×," + "?" + ")";
                    zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                  } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == true) {
                    zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×," + "!" + ")";
                    zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                  } else if (res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == true) {
                    zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "?," + "!" + ")";
                    zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                  } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == true) {
                    zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×," + "?," + "!" + ")";
                    zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                  }
                }
              }
            }
          }

          $.fn.zTree.init($("#treeDemo"), setting, zNodes);
          layer.closeAll('loading');
          zTreeDblFlag = true;
          layer.msg("扫描结束");
          for (let i = 0; i < tempZtree.length; i++) {
            for (let j = 0; j < childrenInfo.length; j++) {
              if (childrenInfo[j].id == tempZtree[i].id) {
                childrenInfo[j] = tempZtree[i];
              }
            }
          }
        }).catch(err => {
          console.log(err);
          layer.closeAll('loading');
          layer.msg("快速扫描异常");
        });
      },
      directQuick: function () {
        let username = this.getCookie('username');
        let password = this.getCookie('password');

        let extensions = decodeURIComponent(this.getCookie('extensions'));
        if (zTree.getSelectedNodes()[0].state == false) {
          layer.msg("设备离线！");
        } else {
          if (this.getCookie('extensions')) {
            layer.load();
            //表格显示所选后缀名文件
            let temp = [];
            for (let i = 0; i < this.componentEntity.length; i++) {
              if (this.componentEntity[i].type == extensions) {
                temp.push(this.componentEntity[i]);
              }
            }
            this.componentEntity.splice(0, this.componentEntity.length);
            this.componentEntity = temp;
            //防止多次扫描软件状态叠加
            for (let i = 0; i < zNodes.length; i++) {
              for (let j = 0; j < zNodes[i].children.length; j++) {
                var regex = /\(/g;
                var str = zNodes[i].children[j].name;
                if (regex.test(str)) {
                  let zname = zNodes[i].children[j].name.split('(');
                  zNodes[i].children[j].name = zname[0];
                }
              }
            }
            this.$axios
              .get(this.getIP() +
                "deploymentdesigns/" +
                deployAllId +
                "/devices/" +
                deviceAllId + "/scan" + "?extensions=" + extensions,
                {
                  //设置头
                  headers: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  auth: {
                    username: username,
                    password: password
                  }
                }).then(res => {
              let correct = [];
              let unknown = [];
              let modifyed = [];
              let miss = [];
              //快速扫描后，更新表格数据
              if (res.data.data.length > 0) {
                for (let i = 0; i < res.data.data.length; i++) {
                  for (let j = 0; j < res.data.data[i].correctComponentFiles.length; j++) {
                    for (let k = 0; k < this.componentEntity.length; k++) {
                      if (res.data.data[i].correctComponentFiles[j].id == this.componentEntity[k].id) {
                        this.componentEntity[k].state = '√';
                        correct.push(this.componentEntity[k]);
                        break;
                      }
                    }
                  }
                  for (let j = 0; j < res.data.data[i].unknownFiles.length; j++) {
                    for (let k = 0; k < this.componentEntity.length; k++) {
                      if (res.data.data[i].unknownFiles[j].id == this.componentEntity[k].id) {
                        this.componentEntity[k].state = '?';
                        unknown.push(this.componentEntity[k]);
                        break;
                      }
                    }
                  }
                  for (let j = 0; j < res.data.data[i].modifyedComponentFiles.length; j++) {

                    for (let k = 0; k < this.componentEntity.length; k++) {

                      if (res.data.data[i].modifyedComponentFiles[j].id == this.componentEntity[k].id) {
                        this.componentEntity[k].state = '×';
                        modifyed.push(this.componentEntity[k]);
                        break;
                      }
                    }
                  }
                  for (let k = 0; k < this.componentEntity.length; k++) {
                    if (this.componentEntity[k].state == "--") {
                      this.componentEntity[k].state = "!";
                      miss.push(this.componentEntity[k]);
                    }
                  }
                  // 表格排序
                  this.componentEntity.splice(0, this.componentEntity.length);
                  for (let i = 0; i < unknown.length; i++) {
                    this.componentEntity.push(unknown[i]);
                    tempZtree.push(unknown[i]);
                  }
                  for (let i = 0; i < modifyed.length; i++) {
                    this.componentEntity.push(modifyed[i]);
                    tempZtree.push(modifyed[i]);
                  }
                  for (let i = 0; i < miss.length; i++) {
                    this.componentEntity.push(miss[i]);
                    tempZtree.push(miss[i]);
                  }
                  for (let i = 0; i < correct.length; i++) {
                    this.componentEntity.push(correct[i]);
                    tempZtree.push(correct[i]);
                  }
                }
              }
              // 扫描完后添加软件状态
              for (let i = 0; i < zNodes.length; i++) {
                for (let j = 0; j < zNodes[i].children.length; j++) {
                  for (let k = 0; k < res.data.data.length; k++) {
                    if (zNodes[i].children[j].id == res.data.data[k].componentId) {
                      if (res.data.data[k].hasCorrectComponentFiles == true && res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == false) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "√" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == false) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == false) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "?" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == true) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "!" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == false) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×," + "?" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == false && res.data.data[k].hasMissingFile == true) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×," + "!" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == false && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == true) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "?," + "!" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      } else if (res.data.data[k].hasModifyedComponentFiles == true && res.data.data[k].hasUnknownFiles == true && res.data.data[k].hasMissingFile == true) {
                        zNodes[i].children[j].name = zNodes[i].children[j].name + "(" + "×," + "?," + "!" + ")";
                        zNodes[i].children[j].name = zNodes[i].children[j].name.replace('(', '           (');
                      }
                    }
                  }
                }
              }

              $.fn.zTree.init($("#treeDemo"), setting, zNodes);

              layer.closeAll('loading');
              zTreeDblFlag = true;

              layer.msg("扫描结束");

              for (let i = 0; i < tempZtree.length; i++) {
                for (let j = 0; j < childrenInfo.length; j++) {
                  if (childrenInfo[j].id == tempZtree[i].id) {
                    childrenInfo[j] = tempZtree[i];
                  }
                }
              }

            }).catch(err => {
              console.log(err);
              layer.closeAll('loading');
              layer.msg("快速扫描异常");

            });
          }
        }
      }
    },
    computed: {
      //搜索框
      componentEntityA: function () {
        var self = this;
        return self.componentEntity.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      }
    }
  }

</script>
<style type="text/css">
  .tree-box div.el-table__body-wrapper {
    display: none;
  }
  .tree-box table th{
    border:none;
  }
  .showDetail table{
  }
  .showDetail div.el-table__body-wrapper{
    height: 100%;
  }
  div.pan-btn{
    cursor: pointer;
  }
</style>
<style type="text/css" scoped>
  .content{
    height:90%;
  }
  div.selectBox{
    margin-bottom: 20px;
  }
  div.selectBox span.text {
    margin-left: 7px;
    dispaly:inline-block;
    width:100px;
    font-size: 14px;
    font-weight: 700;
    color:#909399;
  }
  #scan-selection{
    display: inline-block;
  }
  .searchBox{
    float: right;
  }
  div.showDetail{
    float:right;
    width:70%;
    height:800px;
  }
  #areaTree {
    margin-left: -1px;
    height: 800px;
    overflow-y: auto;
    white-space: pre;
    width: 28%;
    border:1px solid #ebeef5;
  }
  .zTreeDemoBackground {
    margin-top: -10px;
  }
</style>

