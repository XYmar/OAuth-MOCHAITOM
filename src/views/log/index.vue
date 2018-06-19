<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 33%" @keyup.enter.native="handleFilter" id="search-deviceIP" class="filter-item" :placeholder="$t('table.deviceIP')" v-model="listQuery.deviceIP">
      </el-input>
      <el-input style="width: 33%" @keyup.enter.native="handleFilter" id="search-compName" class="filter-item" :placeholder="$t('table.componentsName')" v-model="listQuery.componentsName">
      </el-input>
      <el-input style="width: 33%" disabled="disabled" @keyup.enter.native="handleFilter" id="search-compSize" class="filter-item" :placeholder="$t('table.fileSize')" v-model="listQuery.fileSize">
      </el-input>
      <el-select clearable style="width:20%;margin-top:8px;" class="filter-item"  v-model="selected" :placeholder="$t('table.deployStatus')">
        <el-option v-for="item in depolyStatusOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-date-picker style="width: 70%;height: 36px;"
                      size="small"
                      v-model="value4"
                      type="datetimerange"
                      :picker-options="pickerOptions2"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="right"
      >
      </el-date-picker>
      <el-button style="margin-top: 8px;float:right;" class="filter-item" type="primary" v-waves icon="el-icon-search" @click="searchAll">{{$t('table.search')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <el-table-column min-width="120px" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" :label="$t('table.componentsName')">
        <template slot-scope="scope">
          <span>{{scope.row.componentEntity.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" :label="$t('table.startTime')">
         <template slot-scope="scope">
           <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
         </template>
       </el-table-column>
      <el-table-column width="180px" align="center" :label="$t('table.endTime')">
        <template slot-scope="scope">
          <span>{{scope.row.finishTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('table.fileSize')">
        <template slot-scope="scope">
          <span>{{scope.row.componentEntity.displaySize}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="部署状态" prop="state">
        <template slot-scope="scope">
          <span class="el-tag el-tag--danger" v-if="scope.row.state == 0">部署异常</span>
          <span class="el-tag el-tag--primary" v-else-if="scope.row.state == 1">部署进行中</span>
          <span class="el-tag el-tag--success" v-else>部署完成</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import { logList, logSearchList } from '@/api/log'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  // arr to obj ,such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})
  /* eslint-disable */
  export default {
    name: 'usermanage',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id',
          username: undefined
        },
        importanceOptions: [1, 2, 3],
        depolyStatusOptions: ['部署成功', '进行中', '部署异常'],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        downloadLoading: false,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        value4: '',
        startTime: '', // 日期开始时间
        startTimeTemp: '', // 查询时 日期开始时间戳
        endTime: '', // 日期结束时间
        endTimeTemp: '', // 查询时 日期结束时间戳
        compName: '', // 查询时组件名
        deviceIP: '', // 查询时设备IP
        compSize: '', // 查询时大小
        compState: '', // 查询时状态
        showTimeResult: false, // 时间查询显示标志
        selected: ""
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          '成功': 'success',
          '部署中': 'info',
          '失败': 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      deleteuser(event) {
        console.log(event.target.tagName)
        const target_btn = event.target
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(target_btn.parentNode.parentNode.parentNode)
          const target_tr = target_btn.parentNode.parentNode.parentNode
          if (target_tr.tagName.toLowerCase() === 'tr') {
            target_tr.style.display = 'none'
          } else if (target_tr.parentNode.tagName.toLowerCase() === 'tr') {
            target_tr.parentNode.style.display = 'none'
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      getList() {
        this.listLoading = true
        logList(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      searchAll: function() {
        console.log(this.value4)
        console.log(this.value4.length)
        console.log('A')
        if (this.value4.length != 0){
          console.log("空不该进")
          this.startTime = this.value4[0];
          this.endTime = this.value4[1];

          this.startTimeTemp = Math.floor(new Date(this.startTime).getTime() / 1000);
          this.endTimeTemp = Math.floor(new Date(this.endTime).getTime() / 1000);

          let start = parseInt(this.startTimeTemp);
          let end = parseInt(this.endTimeTemp);

          console.log(typeof(this.startTimeTemp));
          console.log(this.startTimeTemp);
        }

        console.log("B");

        //  /deploylogs

        let username = this.getCookie('username');
        let password = this.getCookie('password');

        this.deviceIP = $("input[id='search-deviceIP']").val();
        this.compName = $("input[id='search-compName']").val();
        this.compSize = $("input[id='search-compSize']").val();
        //this.compState = $("input[id='search-compState']").val();


        let state = this.selected;
        console.log(this.selected);
        console.log(state.length);

        if (state.length > 0) {
          if (state == "部署异常") {
            this.compState = 0;
          } else if (state == "进行中") {
            this.compState = 1;
          } else if (state == "部署成功") {
            this.compState = 2;
          }
        }

        let formData = new FormData();

        let searchObj = {};

        if (this.deviceIP.length != 0) {
          formData.append('ip', this.deviceIP);
          searchObj.ip = this.deviceIP;
        }

        if (this.compName.length != 0 || this.compSize.length != 0) {
          //searchObj.componentEntity = {};
          if (this.compName.length != 0) {
            formData.append('componentEntity.name', this.compName);
            searchObj.componentName = this.compName;
          }
          if (this.compSize.length != 0) {
            formData.append('componentEntity.size', this.compSize);
            searchObj.componentEntity.size = this.compSize;
          }
        }

        if (this.compState.length != 0) {
          formData.append('state', this.compState);
          searchObj.state = this.compState;
        }
        if (this.value4.length != 0) {
          formData.append('createTime', this.startTimeTemp);
          formData.append('finishTime', this.endTimeTemp);

          //searchObj.createTime = this.startTimeTemp;
          searchObj.startTime = new Date(this.startTime).getTime();
          searchObj.endTime = new Date(this.endTime).getTime();
        }

        console.log(searchObj);
        logSearchList(searchObj).then(response => {
          this.list = response.data.data
          this.listLoading = false
        })

      }
    }
  }
/*  const this.prototype.startTime = function () {
    const startTime = this.value4[0]
    const endTime = this.value4[1]
    const startTimeTemp = Math.floor(new Date(startTime).getTime() / 1000)
    const endTimeTemp = Math.floor(new Date(endTime).getTime() / 1000)
    return startTimeTemp
  }*/
</script>
