<template>
  <div class="app-container calendar-list-container" id="components">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 240px;" class="filter-item" placeholder="标题" v-model="searchQuery">
      </el-input>

      <el-button id="addComBtn"
                 v-show="!isHistory"
                 class="filter-item pull-right"
                 style="float: right;margin-left: 10px;"
                 @click="handleCreate" type="primary"
                 icon="el-icon-edit">{{$t('table.add')}}
      </el-button>

      <!--<router-link to="/componentTypes/index">
        <el-button class="filter-item pull-right" style="float: right;margin-left: 10px;" type="primary"
                   icon="el-icon-edit">组件分类
        </el-button>
      </router-link>-->

      <el-upload style="float: right;"
                 class="upload-demo"
                 action=""
                 :file-list="fileList"
                 :httpRequest="uploadCom"
                 :show-file-list="false"
                 multiple>

        <!--<el-button class="filter-item" type="primary" style="margin-left: 10px;" v-waves icon="el-icon-download">导入</el-button>-->

      </el-upload>
      <el-button type="danger" @click="showHistory" style="float: right;" icon="el-icon-delete" v-show="!isHistory" :loading="hisBtnLoading">
        回收站
      </el-button>
      <el-button type="success" @click="showNow" style="float: right;" icon="el-icon-back" v-show="isHistory" :loading="hisBtnLoading">
        退出回收站
      </el-button>
    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column :label="$t('table.compName')" min-width="100">
        <template slot-scope="scope">
          <span v-if="!scope.row.deleted" class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" :label="$t('table.compVersion')">
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column min-width="100px" :label="$t('table.compSize')">
        <template slot-scope="scope">
          <span>{{Math.round(scope.row.size/1024/1024*100)/100}}M</span>
        </template>
      </el-table-column>-->
      <el-table-column min-width="100px" :label="$t('table.compPath')">
        <template slot-scope="scope">
          <span>{{scope.row.deployPath}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.compDesc')">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="140" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)" style="margin-left: 10px;">{{$t('table.edit')}}</el-button>-->
          <el-dropdown trigger="click" v-if="!scope.row.deleted">
            <!--<el-tooltip class="item" effect="dark" content="更多操作" placement="top">
              <span class="el-dropdown-link">
              <svg-icon icon-class="ellipsis"></svg-icon>
            </span>
            </el-tooltip>-->
            <span class="el-dropdown-link">
              <el-button type="success" plain>更多操作</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="handleUpdate(scope.row)">编辑</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="compCopy(scope.row)">复制</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="exportLink(scope.row)">导出</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleDelete(scope.row)">删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click" v-else>
            <!--<el-tooltip class="item" effect="dark" content="更多操作" placement="top">
              <span class="el-dropdown-link">
              <svg-icon icon-class="ellipsis"></svg-icon>
            </span>
            </el-tooltip>-->
            <span class="el-dropdown-link">
              <el-button type="success" plain>更多操作</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="handleDelHisCom(scope.row)">删除</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleResHisCom(scope.row)">恢复</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--<el-button size="mini" type="success" @click="compCopy(scope.row)">复制</el-button>
          <a @click="exportLink(scope.row)">
            <el-button size="mini" type="info">导出</el-button>
          </a>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>-->
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container" style="text-align: center;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--创建-->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible"
               top="10vh" width="86%"
               class="filesDialog"
               v-if="dialogStatus == 'create'"
    >
      <el-form :rules="componentRules" ref="dataForm" :model="temp" label-width="100px"
               style='width: 100%;height: 100%'>
        <div style="height: 90%;overflow-y: auto;width: 40%;float: left;padding-right: 16px;position: relative;">
          <el-form-item :label="$t('table.compName')" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.compVersion')" prop="version">
            <el-input v-model="temp.version"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.compPath')" prop="deployPath">
            <el-input v-model="temp.deployPath" placeholder="/test/，必须以斜杠开头，斜杠结尾"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.compDesc')" prop="desc">
            <el-input v-model="temp.description"></el-input>
          </el-form-item>
          <div class="button-container">
            <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
            <el-button type="primary" @click="createData" :loading="creComLoading">{{$t('table.confirm')}}</el-button>
          </div>
        </div>
        <div style="height: 100%;overflow: auto;width: 60%;float: right;padding:5px 0 10px 10px;border-left:1px solid #ccc;margin-top: -44px"
             v-loading="managerLoading"
             element-loading-text="请先填写组件的基本信息并创建"
        >
          <comFileManage ref="createComFile" :selectCompId="selectedId" :selectCompName="selectdName"></comFileManage>
        </div>
      </el-form>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible"
               top="7vh" width="86%"
               class="filesDialog"
               v-else
    >

        <el-form :rules="componentRules" ref="dataForm" :model="temp" label-width="100px"
                 style='width: 100%;height: 100%'>
          <div style="height: 90%;overflow-y: auto;width: 40%;float: left;padding-right: 16px;position: relative;">
            <el-form-item :label="$t('table.compName')" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.compVersion')" prop="version">
              <el-input v-model="temp.version"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.compPath')" prop="deployPath">
              <el-input v-model="temp.deployPath" placeholder="/test/，必须以斜杠开头，斜杠结尾"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.compDesc')" prop="desc">
              <el-input v-model="temp.description"></el-input>
            </el-form-item>
            <div class="button-container">
              <el-button @click="dialogFormVisible = false" style="margin-right: 10px">{{$t('table.cancel')}}</el-button>
              <el-button type="primary" @click="updateData" :loading="upComLoading">{{$t('table.confirm')}}</el-button>
            </div>
            <!--去除修改组件时的文件上传模块-->
            <!--<el-form-item :label="$t('table.compUpload')" prop="fileAll">
            <uploader :options="options"
                      :autoStart="autoStart"
                      :file-status-text="statusText"
                      :started="started"
                      ref="uploader"
                      class="uploader-example">
              <uploader-unsupport></uploader-unsupport>
              <uploader-drop>
                <p>拖拽文件到此处或</p>
                <uploader-btn>选择文件</uploader-btn>
                <uploader-btn :directory="true">选择文件夹</uploader-btn>
              </uploader-drop>
              <uploader-list id="fileUp"></uploader-list>
            </uploader>
          </el-form-item>-->
          </div>
          <!--文件管理模块-->
          <div style="height: 100%;overflow: auto;width: 60%;float: right;padding:5px 0 10px 10px;border-left:1px solid #ccc;margin-top: -44px">
            <!--<label style="width: 100%;font-size: 14px;">组件详细信息</label>-->
            <comFileManage :selectCompId="selectedId" :selectCompName="selectdName"></comFileManage>
          </div>
        </el-form>
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogFormVisible = false" style="margin-right: 10px">{{$t('table.cancel')}}</el-button>-->
        <!--<el-button type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>-->
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disable */
  import { compList, createComp, updateComp, copyComp, importComp, deleteComp, compListHistory, compSingle, restoreCom, cleanCom } from '@/api/component'
  import waves from '@/directive/waves' // 水波纹指令
  import { Loading } from 'element-ui'
  import comFileManage from '@/views/fileManager/filecomp'

  export default {
    name: 'components',
    directives: {
      waves
    },
    data() {
      const validatePath = (rule, value, callback) => {
        let pattern = /^(\/([a-zA-Z0-9]+))*\/$/;

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
        projectId: '',
        selectedId: '',
        selectdName: '',
        treeInfo: [],
        fileList: [],
        tableKey: 0,
        list: [],
        singleComp: null,
        listLoading: true,
        listQuery: {
          page: 0,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id',
          deviceName: undefined
        },
        total:0,//默认数据总数
        pagesize:10,//每页的数据条数
        currentPage:1,//默认开始页面
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
        componentRules: {
          name: [{ required: true, message: '请输入组件名', trigger: 'blur' }],
          version: [{ required: true, message: '请输入版本', trigger: 'blur' }],
          deployPath: [{ required: true, trigger: 'blur', validator: validatePath }]
        },
        downloadLoading: false,
        managerLoading: false,
        creComLoading: false,
        upComLoading: false,
        hisBtnLoading: false,
        options: {
          // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
          //target: '//localhost:3000/upload',
          chunkSize: 1024 * 1024,
          testChunks: true
        },
        attrs: {
          accept: 'image/*'
        },
        statusText: {
          success: '成功了',
          error: '出错了',
          uploading: '上传中',
          paused: '暂停中',
          waiting: '等待中'
        },
        started: false,
        autoStart: '',

        fileInfo: [],
        folderInfo: [],
        files: [],
        folderClearData: [],        //文件夹需要清空的内容数组
        fileClearData: [],          //文件需要清空的内容数组

        fileAll: [],
        searchQuery: '',
        userData:{
          username: '',
          password: ''
        },
        errorMessage: '操作失败'
      }
    },
    components: {
      comFileManage
    },
    created() {
      this.isHistory = false
      this.projectId = this.$store.getters.projectId
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')

      this.getList();

      this.autoStart = false;      //取消自动上传
    },
    methods: {
      getList() {
        this.listLoading = true
        compList(this.projectId,this.listQuery).then(response => {
          this.isHistory = false
          this.list = response.data.data.content
          this.total = response.data.data.totalElements
          this.listLoading = false
          /*this.oldList = this.list.map(v => v.id);
          this.newList = this.oldList.slice();
          this.$nextTick(() => {
            this.setSort()
          })*/

          //console.log(this.list);
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
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
          id: '',
          name: '',
          version: '',
          deployPath: '',
          description: '',
          fileAll: ''
        }
      },
      handleCreate() {
        this.managerLoading = true
        this.resetTemp();
        this.selectedId = ''
        this.selectdName = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          if(this.$refs.createComFile.list) {
            this.$refs.createComFile.list = []
            this.$refs.createComFile.breadcrumbList = []
          }
          this.$refs['dataForm'].clearValidate()

          /*console.log("文件信息");
          console.log(this.$refs.uploader.uploader.files);
          this.$refs.uploader.uploader.files.splice(0,this.$refs.uploader.uploader.files.length);
          console.log(this.$refs.uploader.uploader.files);*/
          // this.getList()
        })
        // this.getList()
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const createloading = Loading.service({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading'
            })
            this.creComLoading = true
            let formData = new FormData();
            /*this.fileAll = this.$refs.uploader.uploader.files;
            console.log(this.fileAll,'所有文件')*/
            formData.append('name', this.temp.name);
            formData.append('version', this.temp.version);
            formData.append('deployPath', this.temp.deployPath);
            //formData.append('size', this.size);
            formData.append('description', this.temp.description);
            //开始上传后去掉暂停和删除按钮
            /*$(".uploader-file-actions").children(".uploader-file-pause").removeClass("uploader-file-pause");
            $(".uploader-file-actions").children(".uploader-file-remove").removeClass("uploader-file-remove");*/
            //formData.append('enctype', "multipart/form-data")
            /*for (var i = 0; i < this.fileAll.length; i++) {
              //判断数组里是文件夹还是文件
              formData.append('componentEntityFiles', this.fileAll[i].file);
            }*/
            // debugger
            createComp(this.projectId, formData).then((res) => {
              this.creComLoading = false
              createloading.close()
              // this.list.unshift(this.temp)
              // this.dialogFormVisible = false
              this.selectedId = res.data.data.id
              this.selectdName = res.data.data.name
              this.managerLoading = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) => {
              this.creComLoading = false
              createloading.close()
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
      handleUpdate(row) {
        this.selectedId = row.id;
        this.selectdName = row.name
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          /*if(this.$refs.createComFile.list) {
            this.$refs.createComFile.list = []
            this.$refs.createComFile.breadcrumbList = []
          }*/
          this.$refs['dataForm'].clearValidate()
        })
        /*this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();

          //树
          compSingle(this.selectedId).then(response => {
            this.singleComp = response.data.data;
            this.listLoading = false

            console.log("树信息-------------------");
            console.log(this.singleComp);

            //对比时，是路径节点与根节点下的孩子节点比较
            let componentFile = this.singleComp.componentDetailEntities;//组件

            let zNodes = [];
            let item;
            for (let m = 0; m < componentFile.length; m++) {

              this.treeInfo.push(componentFile[m]);//放所有文件信息，用于树点击id的选择

              item = this.singleComp;

              let path = (componentFile[m].savePath).split('/');

              for (let i = 1; i < path.length; i++) {
                item = this.$options.methods.handleInfo(item, path[i]);
              }
            };

            zNodes.push(this.singleComp);

            console.log(zNodes);

            let forderTemp = [];

            for (let i = 0; i < this.singleComp.componentDetailEntities.length; i++) {
              let info = this.singleComp.componentDetailEntities[i].savePath.split('/');
              let clearId = this.singleComp.componentDetailEntities[i].id;

              if (info.length > 2) {

                if (forderTemp.length > 0) {
                  let flag = true;

                  for (let j = 0; j < forderTemp.length; j++) {
                    if (forderTemp[j].name == info[1]) {
                      flag = false;
                    }
                  }

                  if (flag) {
                    let info2 = {};
                    info2.name = info[1];
                    forderTemp.push(info2);
                  }

                } else {
                  let info2 = {};
                  info2.name = info[1];
                  forderTemp.push(info2);
                }


                this.folderClearData.push(clearId);
                console.log(this.folderClearData);
              } else {
                this.fileInfo.push(this.singleComp.componentDetailEntities[i]);
                this.fileClearData.push(clearId);
              }
            }

            console.log(forderTemp);

            for (let i = 0; i < forderTemp.length; i++) {
              this.folderInfo.push(forderTemp[i]);
            }


            let setting = {
              view: {
                dblClickExpand: false,
                addHoverDom: this.addHoverDom,
                removeHoverDom: this.removeHoverDom,
                selectedMulti: this.true
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
                beforeDrag: this.beforeDrag,
                beforeEditName: this.beforeEditName,
                beforeRemove: this.beforeRemove,
                beforeRename: this.beforeRename,
                onRemove: this.onRemove,
                onRename: this.onRename,
                onClick: this.zTreeOnClick
              }
            };

            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
          });

        })*/
      },
      compCopy(row) {
        let qs = require('qs');
        let id = row.id;
        this.temp = Object.assign({}, row) // copy obj

        let data = {
          'name': this.temp.name
        };
        let proData = qs.stringify(data);
        const copyloading = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading'
        })

        copyComp(proData, id).then(() => {
          this.list.unshift(this.temp)
          this.dialogFormVisible = false
          copyloading.close()
          this.$notify({
            title: '成功',
            message: '复制成功',
            type: 'success',
            duration: 2000
          })

          this.getList()
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '复制失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            /*const updateloading = Loading.service({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              fullscreen: true
            })*/
            this.upComLoading = true
            let id = this.selectedId;

            let formData = new FormData();

            // this.fileAll = this.$refs.uploader.uploader.files;

            formData.append('name', this.temp.name);
            formData.append('version', this.temp.version);
            formData.append('deployPath', this.temp.deployPath);
            //formData.append('size', this.size);
            formData.append('description', this.temp.description);

            //开始上传后去掉暂停和删除按钮
            //$(".uploader-file-actions").children(".uploader-file-pause").removeClass("uploader-file-pause");
            //$(".uploader-file-actions").children(".uploader-file-remove").removeClass("uploader-file-remove");

            formData.append('enctype', "multipart/form-data");

            /*for (var i = 0; i < this.fileAll.length; i++) {
              //判断数组里是文件夹还是文件
              formData.append('componentEntityFiles', this.fileAll[i].file);

            }*/
            // patch暂时不支持修改文件
            let data = {
              name: this.temp.name,
              version: this.temp.version,
              deployPath: this.temp.deployPath,
              description: this.temp.description
            }
            let qs = require('qs')
            let newdata = qs.stringify(data)
            updateComp(newdata,id).then(() => {
              /*for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }*/
              // updateloading.close()
              this.upComLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) => {
              this.errorMessage = '操作失败！'
              this.upComLoading = false
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
          deleteComp(id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      exportLink(row) {

        let id = row.id;
        this.exportUrl = this.getIP() + 'components/' + id + '/exportfiles';

        console.log(this.exportUrl);
        window.open(this.exportUrl);
      },

      uploadCom: function (file) {
        let formData = new FormData();

        console.log("导入组件文件----------");
        console.log(file);

        formData.append('importComponents', file.file);
        const uploading = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading'
        })

        importComp(this.userData, formData).then(() => {
          uploading.close()
          this.$notify({
            title: '成功',
            message: '导入成功',
            type: 'success',
            duration: 2000
          })
          //导入成功后再次查询
          this.getList()

        })
          .catch(error => {
            this.$notify({
              title: '失败',
              message: '导入失败',
              type: 'error',
              duration: 2000
            })
          })
      },

      handleInfo: function (item, path) {
        if (item == null)
          return;

        if (item.hasOwnProperty("children")) {
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
            item.children.push({"name": path});
            item = item.children[item.children.length - 1];
            return item;
          }

        } else {
          item.children = [];
          item.children.push({"name": path});
          item = item.children[0];
          return item;
        }

      },

      zTreeOnClick: function (e, treeId, treeNode) {

        let zTree = $.fn.zTree.getZTreeObj("treeDemo");
        let id;

        for (let i = 0; i < treeInfo.length; i++) {
          if (this.treeInfo[i].name == zTree.getSelectedNodes()[0].name) {
            id = this.treeInfo[i].id;
            break;
          }
        }

      },

      showHistory: function(){
        this.listLoading = true
        this.hisBtnLoading = true
        compListHistory(this.projectId, this.listQuery).then(response => {
          this.isHistory = true
          this.list = response.data.data.content
          this.total = response.data.total
          this.listLoading = false
          this.hisBtnLoading = false
        }).catch(() => {
          this.listLoading = false
          this.hisBtnLoading = false
          this.$notify({
            title: '失败',
            message: '操作失败！',
            type: 'error',
            duration: '2000'
          })
        })
      },

      showNow: function(){
        this.listLoading = true
        this.hisBtnLoading = true
        compList(this.projectId,this.listQuery).then(response => {
          this.list = response.data.data.content
          this.total = response.data.total
          this.listLoading = false
          this.hisBtnLoading = false
          this.isHistory = false
        }).catch(() => {
          this.listLoading = false
          this.hisBtnLoading = false
          this.$notify({
            title: '失败',
            message: '操作失败！',
            type: 'error',
            duration: '2000'
          })
        })
      },
      handleDelHisCom(row) {
        this.$confirm('确认彻底删除此组件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          cleanCom(row.id).then(() => {
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
      handleResHisCom(row) {
        this.$confirm('确认恢复此组件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          restoreCom(row.id).then(() => {
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
      }
    }
  }
</script>

<style scoped>
  .el-button+.el-button {
    margin-left: 0;
  }
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
  .button-container{
    position: absolute;
    bottom: 0;
    right: 15px;
  }

</style>
