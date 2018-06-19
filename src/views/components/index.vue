<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="searchQuery">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>

      <el-button class="filter-item pull-right" style="float: right;margin-left: 10px;" @click="handleCreate" type="primary"
                 icon="el-icon-edit">{{$t('table.add')}}
      </el-button>


      <el-upload style="float: right;"
                 class="upload-demo"
                 action=""
                 :file-list="fileList"
                 :httpRequest="uploadCom"
                 :show-file-list="false"
                 multiple>

        <el-button class="filter-item" type="primary" style="margin-left: 10px;" v-waves icon="el-icon-download">导入</el-button>

      </el-upload>

    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column :label="$t('table.compName')" width="100">
        <template slot-scope="scope">
          <span @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" :label="$t('table.compVersion')">
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.compSize')">
        <template slot-scope="scope">
          <span>{{scope.row.displaySize}}</span>
        </template>
      </el-table-column>
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
      <el-table-column :label="$t('table.actions')" width="280" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="success" @click="compCopy(scope.row)">复制</el-button>
          <a @click="exportLink(scope.row)">
            <el-button size="mini" type="info">导出</el-button>
          </a>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="10vh" width="60%"
               v-if="dialogStatus=='create'">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style='height: 400px;overflow-y: auto;padding-right: 10%;padding-left: 10%;'>
        <el-form-item :label="$t('table.compName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.compVersion')" prop="version">
          <el-input v-model="temp.version"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.compPath')" prop="path">
          <el-input v-model="temp.deployPath"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.compDesc')" prop="desc">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>

        <el-form-item :label="$t('table.compUpload')" prop="files">
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
            <uploader-list></uploader-list>
          </uploader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="7vh" width="80%" v-else>

        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px"
                 style='width: 100%;'>
          <div style="height: 400px;overflow-y: auto;width: 60%;float: left;border-right: 1px solid lightgrey;padding-right: 30px;">
            <el-form-item :label="$t('table.compName')" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.compVersion')" prop="version">
              <el-input v-model="temp.version"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.compPath')" prop="path">
              <el-input v-model="temp.deployPath"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.compDesc')" prop="desc">
              <el-input v-model="temp.description"></el-input>
            </el-form-item>

            <el-form-item :label="$t('table.compUpload')" prop="fileAll">
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
          </el-form-item>
          </div>

          <div style="height: 400px;overflow: auto;width: 40%;float: right;padding-left: 30px;padding-top: 5px;">
            <label style="width: 100%;font-size: 14px;">组件详细信息</label>
            <br/>
            <ul id="treeDemo" class="ztree"></ul>
          </div>
        </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { compList, createComp, updateComp, copyComp, importComp, deleteComp, compSingle } from '@/api/component'
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
        selectedId: '',
        treeInfo: [],
        fileList: [],
        tableKey: 0,
        list: [],
        singleComp: null,
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
        }
      }
    },
    created() {
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')

      this.getList();

      this.autoStart = false;      //取消自动上传
    },
    methods: {
      getList() {
        this.listLoading = true
        compList(this.userData).then(response => {
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



          console.log("文件信息");
          console.log(this.$refs.uploader.uploader.files);
          this.$refs.uploader.uploader.files.splice(0,this.$refs.uploader.uploader.files.length);
          console.log(this.$refs.uploader.uploader.files);

          this.getList()
        })

        this.getList()
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

            this.fileAll = this.$refs.uploader.uploader.files;

            formData.append('name', this.temp.name);
            formData.append('version', this.temp.version);
            formData.append('deployPath', this.temp.deployPath);
            //formData.append('size', this.size);
            formData.append('description', this.temp.description);

            //开始上传后去掉暂停和删除按钮
            $(".uploader-file-actions").children(".uploader-file-pause").removeClass("uploader-file-pause");
            $(".uploader-file-actions").children(".uploader-file-remove").removeClass("uploader-file-remove");

            formData.append('enctype', "multipart/form-data");

            for (var i = 0; i < this.fileAll.length; i++) {
              //判断数组里是文件夹还是文件
              formData.append('componentfiles', this.fileAll[i].file);

            }

            createComp(this.userData, formData).then(() => {
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

              //console.log(document.getElementById('fileUp'));
              //document.getElementById('fileUp').innerHTML = "";
              //this.$refs.uploader.uploader.files = [];
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

          //树
          compSingle(this.userData, this.selectedId).then(response => {
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

              let path = (componentFile[m].path).split('/');

              for (let i = 1; i < path.length; i++) {
                item = this.$options.methods.handleInfo(item, path[i]);
              }
            };

            zNodes.push(this.singleComp);

            console.log(zNodes);

            let forderTemp = [];

            for (let i = 0; i < this.singleComp.componentDetailEntities.length; i++) {
              let info = this.singleComp.componentDetailEntities[i].path.split('/');
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

        })
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

        copyComp(this.userData, proData, id).then(() => {
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
            const id = this.selectedId;

            let formData = new FormData();

            this.fileAll = this.$refs.uploader.uploader.files;

            formData.append('name', this.temp.name);
            formData.append('version', this.temp.version);
            formData.append('deployPath', this.temp.deployPath);
            //formData.append('size', this.size);
            formData.append('description', this.temp.description);

            //开始上传后去掉暂停和删除按钮
            $(".uploader-file-actions").children(".uploader-file-pause").removeClass("uploader-file-pause");
            $(".uploader-file-actions").children(".uploader-file-remove").removeClass("uploader-file-remove");

            formData.append('enctype', "multipart/form-data");

            for (var i = 0; i < this.fileAll.length; i++) {
              //判断数组里是文件夹还是文件
              formData.append('componentfiles', this.fileAll[i].file);

            }

            updateComp(this.userData, formData,id).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              updateloading.close()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
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
          deleteComp(this.userData, id).then(() => {
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
        this.exportUrl = this.getIP() + 'components/' + id + '/export';

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
          .catch(err => {
            console.log(err);
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
