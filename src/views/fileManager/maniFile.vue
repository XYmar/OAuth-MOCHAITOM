<template>
  <div class="fileComp">
    <div class="operationContainer" style="height: 40px;border-bottom:1px solid #ebeef5">
      <div style="float: left;padding-left: 10px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index"><span style="cursor: pointer;color:rgb(0, 171, 235);" @click="switchFolder(item,index)">{{item.name}}</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--<div style="float: right;color:rgb(0, 171, 235);cursor: pointer;padding-right: 20px;">
        <span style="margin-right: 18px" @click="addFolder">
          <svg-icon icon-class="add"></svg-icon>
          <span style="font-size: 14px;margin-left: 6px;">新建文件夹</span>
        </span>
        <span @click="handleuploadFile">
          <svg-icon icon-class="upload1"></svg-icon>
          <span style="font-size: 14px;margin-left: 6px;">上传文件</span>
        </span>
        <span>
          <el-dropdown trigger="click">
            <el-tooltip class="item" effect="dark" content="更多操作" placement="top">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon&#45;&#45;right" style="color:rgb(0, 171, 235);"></i>
                &lt;!&ndash;<svg-icon icon-class="ellipsis"></svg-icon>&ndash;&gt;
              </span>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="handleUploadFolder()">上传文件夹</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>-->
    </div>
    <el-table :key='tableKey' :data="listFolder" v-loading="listLoading" element-loading-text="给我一点时间" fit
              highlight-current-row
              style="width: 100%"
              class="fileList"
    >
      <el-table-column label="文件夹" min-width="200">
        <template slot-scope="scope">
          <span @click="loadListFile(scope.row)">
            <svg-icon icon-class="folder" style="font-size: 30px;margin-right: 10px;cursor: pointer;"></svg-icon>
            <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
              <span v-if="!scope.row.newFolder" class="link-type"
                    style="position:relative;top:2px;display:inline-block;width:70%;white-space:nowrap;overflow:hidden;text-overflow: ellipsis">
                {{scope.row.name}}
              </span>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <!--<el-table-column min-width="150px" :label="$t('table.compSize')">
        <template slot-scope="scope">
          <span v-if="scope.row.type != null">{{computedSize(scope.row.size)}}</span>
          <span v-if="scope.row.type == null&&scope.row.name">&#45;&#45;</span>
          <span v-if="scope.row.newFolder" style="cursor: pointer;" @click="cancelNewFolder">
            <svg-icon icon-class="cancel"></svg-icon>
          </span>
        </template>
      </el-table-column>-->
      <el-table-column min-width="150px" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column width="40px">
        <template slot-scope="scope">
          <el-dropdown v-if="scope.row.name" trigger="click">
            <el-tooltip class="item" effect="dark" content="更多操作" placement="top">
              <span class="el-dropdown-link">
              <svg-icon icon-class="ellipsis"></svg-icon>
            </span>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="deleteFile(scope.row)">删除</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="exportFile(scope.row)">下载</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="exportFile(scope.row)">复制到</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="exportFile(scope.row)">移动到</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="exportFile(scope.row)">重命名</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { compList, createComp, updateComp, copyComp, importComp, deleteComp, compSingle, saveFolder, getCompFiles, saveFiles, deleteCompFiles, uploadFolder } from '@/api/component'
  import { movefileTo, copyFileTo } from '@/api/component'

  export default {
    name: 'maniFile',
    props: {
      selectCompId: {
        type: String
      },
      selectCompName: {
        type: String
      },
      maniType: {
        type: String,
        default: ''
      },
      selectFileId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        ip: '',
        port: '',
        projectId:'',
        componentId: '',
        compName: '',
        parentNodeId: '',
        targetFolderId: '',
        targetName: '',
        newFolderName: '',
        uploadDialog: false,
        uploadFolderDialog: false,
        maniFileDialog: false,
        fileList: [],
        breadcrumbList: [],
        tableKey: 0,
        list: [],
        singleComp: null,
        total: null,
        listLoading: true,
        uploading: false,
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
        CheckedComps: []
      }
    },
    created() {
      this.initData()
      this.ip = this.getCookie('ip')
      this.port= this.getCookie('port')
      this.targetName = this.selectCompName
      this.getList();
    },
    methods: {
      initData() {
        this.projectId = this.$store.getters.projectId
        this.componentId = this.selectCompId
        this.compName = this.selectCompName
        this.targetFolderId = this.componentId
        this.breadcrumbList = []
        this.list = []
        this.breadcrumbList.push({
          name: this.compName,
          componentId: this.componentId,
          parentNodeId: '',
          folder: true
        })
        // this.autoStart = false; //取消自动上传
      },
      getList() {
        this.listLoading = true
        getCompFiles(this.componentId,this.parentNodeId).then((res) => {
          this.list = res.data.data
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
          this.$notify({
            title: '失败',
            message: '加载出错！',
            type: 'error',
            duration: 2000
          })
        })
      },
      loadListFile(row) {
        if(row.folder){
          this.parentNodeId = row.id
          this.listLoading = true
          getCompFiles(this.componentId,this.parentNodeId).then((res) => {
            this.targetFolderId = row.id
            this.targetName = row.name
            this.listLoading = false
            this.list = res.data.data
            this.breadcrumbList.push({
              name: row.name,
              componentId: this.componentId,
              parentNodeId: row.id,
              folder: true
            })
          }).catch(() => {
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: '加载出错！',
              type: 'error',
              duration: 2000
            })
          })
        } else {
          return
        }
      },
      /*addFolder() {
        if(this.list.length === 0) {
          let newFolder = {
            name: '',
            newFolder: true
          }
          this.list.splice(0, 0, newFolder);
        } else if(this.list[0].name != ''){
          let newFolder = {
            name: '',
            newFolder: true
          }
          this.list.splice(0, 0, newFolder);
        }
      },
      newFoler() {
        if(this.newFolderName) {
          this.list.splice(0, 1);
          let formData = new FormData();
          formData.append('name',this.newFolderName)
          formData.append('parentnodeid',this.parentNodeId)
          saveFolder(this.componentId, formData).then(() => {
            this.newFolderName = ''
            this.getList()
          }).catch(() => {
            this.newFolderName = ''
            this.$notify({
              title: '失败',
              message: '新建失败',
              type: 'error',
              duration: 2000
            })
          })
        }
      },
      cancelNewFolder() {
        if(!this.list[0].id) {
          this.list.splice(0,1)  // 删除新建行
          this.newFolderName = '' // 清空输入框
        }
      },
      handleuploadFile() {
        this.uploadDialog = true
        this.$nextTick(() => {
          this.$refs.uploader.uploader.cancel() //清空文件上传列表
        })
      },
      handleUploadFolder() {
        this.uploadFolderDialog = true
        this.$nextTick(() => {
          this.$refs.uploaderFolder.uploader.cancel() //清空文件上传列表
        })
      },
      uploadFile() {
        this.listLoading = true
        this.uploading = true
        let formData = new FormData()
        formData.append('parentnodeid', this.parentNodeId)
        this.fileAll = this.$refs.uploader.uploader.files
        for (var i = 0; i < this.fileAll.length; i++) {
          //判断数组里是文件夹还是文件
          formData.append('files', this.fileAll[i].file)
        }
        saveFiles(this.componentId, formData).then((res) => {
          this.uploading = false
          this.$refs.uploader.uploader.cancel()
          this.getList()
          this.listLoading = false
          this.uploadDialog = false
        }).catch((error) => {
          this.listLoading = false
          this.uploading = false
          this.$notify({
            title: '失败',
            message: '上传失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      upload_Folder(){
        this.listLoading = true
        this.uploading = true
        let formData = new FormData()
        formData.append('parentnodeid', this.parentNodeId)
        this.fileAll = this.$refs.uploaderFolder.uploader.files
        for (var i = 0; i < this.fileAll.length; i++) {
          //判断数组里是文件夹还是文件
          formData.append('files', this.fileAll[i].file)
        }
        uploadFolder(this.componentId, formData).then(() => {
          this.$refs.uploaderFolder.uploader.cancel()
          this.getList()
          this.listLoading = false
          this.uploading = false
          this.uploadFolderDialog = false
        }).catch((error) => {
          this.listLoading = false
          this.uploading = false
          this.uploadFolderDialog = false
          this.$notify({
            title: '失败',
            message: '上传失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      deleteFile(row) {
        this.listLoading = true
        deleteCompFiles(row.id).then((res) => {
          this.listLoading = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.listLoading = false
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        })
      },*/
      switchFolder(row,index){
        // console.log(this.breadcrumbList)
        if(row.folder){
          this.listLoading = true
          this.parentNodeId = row.parentNodeId
          this.targetFolderId = row.parentNodeId
          this.targetName = row.name
          getCompFiles(this.componentId,this.parentNodeId).then((res) => {
            this.listLoading = false
            this.list = res.data.data
            this.breadcrumbList.splice(index+1, this.breadcrumbList.length-index-1)
          }).catch(() => {
            this.listLoading = false
          })
        } else {
          return
        }
      },
      exportFile(row) {
        let url = 'http://' + this.ip + ':' + this.port + '/componentfiles/' + row.id + '/export'
        window.open(url)
      },
      moveFile() {
        let data = {
          'targetNodeId': this.targetFolderId
        }
        var qs = require('qs');
        let datapost = qs.stringify(data)
        movefileTo(this.selectFileId, this.targetFolderId, datapost).then(() => {
          // alert(1)
        })
      }
    },
    computed: {
      classifyIcon () {
        return function (row) {
          let iconType = ''
          if(row.type == null) {
            iconType = 'folder'
          } else if(row.type === 'png' || row.type === 'jpg' || row.type === 'gif'){
            iconType = 'image'
          } else if(row.type === 'rar' || row.type === 'zip') {
            iconType = 'compressed'
          } else {
            iconType = 'file'
          }
          return iconType
        }
      },
      computedSize() {
        return function(val) {
          let resVal
          if( val < 1024 ) {
            resVal = val + 'B'
          } else if(val >= 1024 && val < 1048576 ) {
            resVal = Math.round(val/1024*10)/10 + 'KB'
          } else if(val >= 1048576 && val < 1073741824) {
            resVal = Math.round(val/1048576*10)/10 + 'MB'
          } else if(val >= 1099511627776) {
            resVal = Math.round(val/1073741824*10)/10 + 'G'
          }
          return resVal
        }
      },
      listFolder: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.type == null
        })
      }
    },
    watch: {
      selectCompId(newValue, oldValue) {
        this.componentId = this.selectCompId,
          this.parentNodeId = ''
        this.initData()
        this.getList()
      },
      selectCompName(newValue, oldValue) {
        this.componentId = this.selectCompId,
          this.parentNodeId = ''
        this.initData()
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>
