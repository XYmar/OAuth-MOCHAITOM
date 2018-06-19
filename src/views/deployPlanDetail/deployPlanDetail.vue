<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="设备名" v-model="searchQuery">
      </el-input>
    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">
      <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->

      <el-table-column align="center" :label="$t('table.deviceName')" width="380">
        <template slot-scope="scope">
          <span>{{scope.row.deviceEntity.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="380px" align="center" :label="$t('table.deviceIP')">
        <template slot-scope="scope">
          <span>{{scope.row.deviceEntity.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300px" align="center" :label="$t('table.compName')">
        <template slot-scope="scope">
          <span>{{scope.row.componentEntity.name}}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import { bindDetailList } from '@/api/deployPlanDetail'
  import waves from '@/directive/waves' // 水波纹指令

  /* eslint-disable */
  export default {
    name: 'deploy-plan-detail',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        deployPlanId: '',       //所选部署设计的id
        searchQuery: '',
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
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true

        this.deployPlanId = this.$route.params.id;  //所选择的部署设计的id
        console.log(this.deployPlanId);

        bindDetailList(this.deployPlanId).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false

        })
      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.deviceEntity.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      },
      listenProId() {
        return this.$store.state.app.projectId
      }
    },
    watch: {
      listenProId: function(a,b) {
        this.$router.push('/deployPlan/deployPlan')
      }
    }
  }
</script>

<style scoped>

</style>
