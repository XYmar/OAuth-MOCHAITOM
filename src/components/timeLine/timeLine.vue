<template>
  <div class="container">
    <div class="page-header">
      <h3 id="timeline" style="font-size: 28px;">操作日志</h3>
    </div>
    <ul class="timeline">
      <li class="timeline-inverted" v-for="(item, index) in logList">
        <div class="timeline-badge" :class="classifyType(item.type)"><i class="glyphicon glyphicon-check"></i></div>
        <div class="timeline-panel">
          <div class="timeline-heading">
            <span style="font-size: 26px">
              <svg-icon :icon-class="classifyObject(item.object)"></svg-icon>
              <span style="margin-left: 10px;">{{classifyObject(item.object)}}</span>
            </span>
            <!--<h4 class="timeline-title">用户 {{item.username}}</h4>-->
          </div>
          <div class="timeline-body">
            <p class="description">{{item.description}}</p>
          </div>
          <div class="timeBox">
            <small class="text-muted">
              <!--<i class="glyphicon glyphicon-time"></i>-->
              {{item.createTime}}
            </small>
          </div>
        </div>
      </li>
    </ul>
    <div class="pagination-container" style="text-align: center;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="listQuery.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getLogList, getLogAll } from '@/api/operationLog'

export default {
  data() {
    return {
      userId: '',
      role: '',
      logList: '',
      listQuery: {
        page: 0,
        size: 10,
        limit: 10,
        tagname: ''
      },
      total: 0, // 默认数据总数
      pagesize: 10, // 每页的数据条数
      currentPage: 1 // 默认开始页面
    }
  },
  created() {
    this.userId = this.getCookie('userId')
    this.role = this.$store.getters.roles
    this.getLog(this.userId)
  },
  methods: {
    getLog(id) {
      if (this.role === 'editor') {
        getLogList(id, this.listQuery).then((res) => {
          this.logList = res.data.data.content
          this.total = res.data.data.totalElements
        })
      } else {
        getLogAll(this.listQuery).then((res) => {
          this.logList = res.data.data.content
          this.total = res.data.data.totalElements
        })
      }
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.pagesize = val
      this.getLog(this.userId)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val - 1
      this.currentPage = val
      this.getLog(this.userId)
    }
  },
  computed: {
    classifyType() {
      return function(type) {
        if (type === 1) {
          return 'success'
        } else if (type === 2) {
          return 'danger'
        } else if (type === 3) {
          return 'info'
        } else if (type === 5) {
          return 'copy'
        } else if (type === 6) {
          return 'scan'
        } else {
          return ''
        }
      }
    },
    classifyObject() {
      return function(obj) {
        if (obj === 0) {
          return '错误'
        } else if (obj === 1) {
          return 'user'
        } else if (obj === 2) {
          return '工程'
        } else if (obj === 3) {
          return '设备'
        } else if (obj === 4) {
          return '组件'
        } else if (obj === 5) {
          return '文件'
        } else if (obj === 7) {
          return '部署设计'
        } else if (obj === 8) {
          return '部署设计详情'
        } else if (obj === 9) {
          return '基线'
        } else {
          return ''
        }
      }
    }
  }
}
</script>

<style scoped>
@import "timeline.css";
</style>
