<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
      <router-link to="/components/index">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-components1">
            <svg-icon icon-class="components1" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">组件</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="compCounts" :duration="1600"></count-to>
          </div>
        </div>
      </router-link>
    </el-col>
    <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
      <router-link to="/device/device">
        <div class='card-panel'>
          <div class="card-panel-icon-wrapper icon-computer">
            <svg-icon icon-class="computer" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">设备</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="deviceCounts" :duration="1600"></count-to>
          </div>
        </div>
      </router-link>
    </el-col>
    <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
      <router-link to="/deployPlan/deployPlan">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="example" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">部署设计</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="designCounts" :duration="1600"></count-to>
          </div>
        </div>
      </router-link>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getCompCounts, getDeviceCounts, getDeployDesignCounts } from '@/api/getCounts'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      proId: '',
      compCounts: 0,
      deviceCounts: 0,
      designCounts: 0
    }
  },
  created() {
    this.proId = this.$store.getters.projectId
    this.initCounts(this.proId)
  },
  methods: {
    initCounts(id) {
      getCompCounts(id).then((res) => {
        this.compCounts = res.data.data
      })
      getDeviceCounts(id).then((res) => {
        this.deviceCounts = res.data.data
      })
      getDeployDesignCounts(id).then((res) => {
        this.designCounts = res.data.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      /*.icon-people {
         background: #40c9c6;
      }*/
      .icon-computer{
        background: #40c9c6;
        color:#fff;
      }
     /* .icon-message {
        background: #36a3f7;
      }*/
      .icon-components1 {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
   /* .icon-people {
      color: #40c9c6;
    }*/
    .icon-computer{
      color: #40c9c6;
    }
   /* .icon-message {
      color: #36a3f7;
    }*/
    .icon-components1 {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
