<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="项目名" v-model="searchQuery">
      </el-input>

      <el-button class="filter-item" style="float:right;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column min-width="150px" :label="$t('table.projectName')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="$t('table.projectDesc')">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.projectName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.projectDesc')" prop="description">
          <el-input v-model="temp.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchPv } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { projectList, createProject, updateProject, deleteProject } from '@/api/project'
  import { mapMutations } from 'vuex'
  /* eslint-disable */
  export default {
    name: 'project',
    directives: {
      waves
    },
    data() {
      return {
        selectedId: '',
        tableKey: 0,
        list: [],
        total: null,
        listLoading: true,
        /*listQuery: {
          page: 1,
          limit: 20,
          sort: '',
          name: '',
          description: ''
        },*/
        importanceOptions: [1, 2, 3],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: '',
          name: '',
          description: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false,
        listLength: 0,
        projectExist: true,
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

      this.getList()
    },
    computed: {
      /*...mapGetters([
        'projectNum'
      ]),*/
      listenProjectNum() {
        return this.$store.state.app.projectNum
      },
      listenProExist(){
        return this.$store.state.app.projectExist
      },
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      }
    },
    watch: {
      listenProjectNum: function(a, b) {
        this.getList()
      },
      listenProExist: function(a,b) {
        this.getList()
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        projectList(this.userData).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
          this.listLength = response.data.data.length
        })
      },
      resetTemp() {
        this.temp = {
          id: '',
          name: '',
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
      createData() {        //创建项目
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let data = {
              'name': this.temp.name,
              'description': this.temp.description
            };
            let proData = qs.stringify(data);
            createProject(this.userData, proData).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.setProjectNum(this.listLength)
            })
          }
        })
      },
      handleUpdate(row) {
        this.selectedId = row.id;
        console.log(this.selectedId);
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let data = {
              'name': this.temp.name,
              'description': this.temp.description
            };

            const id = this.selectedId;
            let beforUpdateName = '';

            console.log("改前改后-----------")


            for(let i=0;i<this.list.length;i++){
              if(id == this.list[i].id){
                beforUpdateName = this.list[i].name;
                console.log(beforUpdateName);
              }
            }

            console.log(this.temp.name);

            console.log(id);
            let proData = qs.stringify(data);
            updateProject(this.userData, proData, id).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              // this.setProjectNum(this.listLength)
              if(this.temp.name != beforUpdateName){
                this.projectExist = false;
              }

              this.setProjectExist(this.projectExist)

            })
          }
        })
      },
      /*handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },*/
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDelete(row) {
        let id = row.id;
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProject(this.userData, id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.setProjectNum(this.listLength)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      ...mapMutations ({
        setProjectNum:'SET_PROJECTNUM',
        setProjectExist: 'SET_PROJECTEXIST'
      })
    }
  }
</script>
