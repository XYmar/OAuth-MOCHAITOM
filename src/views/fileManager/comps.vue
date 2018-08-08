<template>
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" fit
              highlight-current-row
              style="width: 100%"
              class="fileList"
    >
      <el-table-column :label="$t('table.compName')" width="200">
        <template slot-scope="scope">
          <router-link :to='{name:"files",params:{id:scope.row.id, name:scope.row.name}}'>
            <span>
            <svg-icon :icon-class="classifyIcon(scope.row)" style="font-size: 30px;margin-right: 10px;"></svg-icon>
            <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
              <span class="link-type"
                    style="position:relative;top:2px;display:inline-block;width:70%;white-space:nowrap;overflow:hidden;text-overflow: ellipsis">
                {{scope.row.name}}
              </span>
            </el-tooltip>
          </span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column width="150px" :label="$t('table.compVersion')">
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" :label="$t('table.compSize')">
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
    </el-table>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { compList, createComp, updateComp, copyComp, importComp, deleteComp, compSingle, saveFolder, getCompFiles, saveFiles } from '@/api/component'
  export default {
    name: 'index',
    data() {
      return {
        iconMap: {
          png: 'img',
          jpg: 'img',
          gif: 'img',
          zip: 'compressed',
          rar: 'compressed',
          undifined: 'file'
        },
        projectId:'',
        componentId: '',
        parentNodeId: '',
        newFolderName: '',
        uploadDialog: false,
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
        quickSetFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        dialogPvVisible: false,
        pvData: [],
        componentRules: {
          name: [{ required: true, message: '请输入组件名', trigger: 'blur' }],
          version: [{ required: true, message: '请输入版本', trigger: 'blur' }],
          deployPath: [{ required: true, message: '请输入相对路径', trigger: 'blur' }]
          // description: [{ required: true, message: 'description is required', trigger: 'blur' }]
        },
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
        },
        quicksetList: [
          {
            name: '组件1',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件1',
            displaySize: '35MB'
          },
          {
            name: '组件2',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件2',
            displaySize: '9MB'
          },
          {
            name: '组件3',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件3',
            displaySize: '180KB'
          },
          {
            name: '组件4',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件4',
            displaySize: '26KB'
          },
          {
            name: '组件5',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件5',
            displaySize: '5MB'
          },
          {
            name: '组件6',
            version: '1.0',
            deployPath: 'D:/COMPS/',
            description: '组件6',
            displaySize: '3MB'
          },
        ],
        CheckedComps: []
      }
    },
    created() {
      /*this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')*/
      this.projectId = this.$store.getters.projectId
      this.getList();

      this.autoStart = false;      //取消自动上传
    },
    methods: {
      getList() {
        this.listLoading = true
        compList(this.projectId).then(response => {
          this.list = response.data.data.content
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
      loadListFile(row) {
        if(row.folder){
          if(row.parentNode && row.parentNode != null) {
            this.parentNodeId = row.parentNode
          } else {
            this.parentNodeId = ''
          }
          getCompFiles(this.componentId,this.parentNodeId).then((res) => {
            this.list = res.data.data
            this.parentNodeId = ''
            alert(this.parentNodeId)
          })
        }

        // this.list = row.componentDetailEntities

        /*for(var i=0; i < this.list.length; i++) {
          if(!this.list[i].type) {
            this.list[i].iconClass = 'folder'
          } else if(this.list[i].type === 'png' || this.list[i].type === 'jpg' || this.list[i].type === 'gif'){
            this.list[i].iconClass = 'img'
          } else if(this.list[i].type === 'rar' || this.list[i].type === 'zip') {
            this.list[i].iconClass = 'compressed'
          } else {
            this.list[i].iconClass = 'file'
          }
        }*/
      }
    },
    computed: {
      classifyIcon () {
        return function (row) {
          let iconType = ''
          if(!row.type) {
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
      }
    }
  }
</script>

<style scoped>

</style>

