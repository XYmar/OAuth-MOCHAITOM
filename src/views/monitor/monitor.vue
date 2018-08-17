<template>
  <div class="app-container calendar-list-container">
    <div style="width:33%;float:left;margin-top: 10px;min-height:600px;">
      <el-table :data="deviceList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%;height:600px"
      >
        <!--@row-click="handleScanDevice"-->
        <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->
        <el-table-column align="center" width="40">
          <template slot-scope="scope">
            <span><svg-icon icon-class="设备"></svg-icon></span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.deviceName')" min-width="130">
          <template slot-scope="scope">
            <span class="link-type" @dblclick="getDetailByDevice(scope.row)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="IP" width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.ip}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="width:65%;float: right;margin-top: 10px;margin-bottom: 10px;">
      <el-table :data="fileInfo" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%;height:600px;overflow-y: scroll">
        <!-- <el-table :data="list" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">-->
        <el-table-column align="center" width="40">
          <template slot-scope="scope">
            <span><svg-icon icon-class="组件"></svg-icon></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="组件名" width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.componentEntity.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="版本" width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.componentEntity.version}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="路径" width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.componentEntity.deployPath}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="文件" min-width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.fileName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="80">
          <template slot-scope="scope">
            <span class="link-type">
              <svg-icon :icon-class="computedIcon(scope.row)"></svg-icon>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-table :data="fileInfo">
        <el-table-column align="center" width="40">
          <template slot-scope="scope">
            <span><svg-icon icon-class="组件"></svg-icon></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="组件名" width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.componentEntity.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="版本" width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.componentEntity.version}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="路径" width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.componentEntity.deployPath}}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope" label="文件名" width="130">
            <span class="link-type">{{scope.row.fileName}}</span>
          </template>
        </el-table-column>
      </el-table>-->
      <div class="btn-group" style="float:right;margin-top: 20px;padding-bottom: 20px;height: 80px;">
        <el-button class="pan-btn light-blue-btn" style="width:150px" @click="scanAll">
          <svg-icon icon-class="circle"></svg-icon>
          完整扫描
        </el-button>
        <el-button class="pan-btn light-blue-btn" style="width:150px" @click="scanQuick">
          <svg-icon icon-class="lightning"></svg-icon>
          快速扫描
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { deployplanDevice, getDeployDetailByDevice } from '@/api/deployplan'
  import { scanDevice } from '@/api/scan'

  export default {
    name: 'monitor',
    data() {
      return {
        listLoading: false,
        deployPlanId: '',
        deployplanName: '',
        deviceList: [],
        selectedDeviceId: '',
        deviceDetail: [],
        fileInfo: []
      }
    },
    created() {
      // alert(this.$route.params.id)
      this.deployPlanId = this.$route.params.id
      this.deployplanName = this.$route.params.name
      this.getDevices(this.deployPlanId)
    },
    methods: {
      getDevices(id) {
        deployplanDevice(id).then((res) => {
          this.deviceList = res.data.data
        })
      },
      getDetailByDevice(row) {
        this.selectedDeviceId = row.id
        getDeployDetailByDevice(this.deployPlanId, row.id).then((res) => {
          this.fileInfo = res.data.data
        })
      },
      scanAll() {
        /*scanDevice(this.deployPlanId, this.selectedDeviceId).then((res) => {
          const compResult = res.data.data
          for (var i = 0; i < compResult.length; i++) {
            for (var j = 0; j < this.deviceDetail.length; j++) {
              if (this.deviceDetail[j].componentEntity.id === compResult[i].componentEntity.id) {
                // this.deviceDetail[j].correctFiles = compResult[i].correctFiles
                // this.deviceDetail[j].missingFiles = compResult[i].missingFiles
                // this.deviceDetail[j].modifyedFiles = compResult[i].modifyedFiles
                // this.deviceDetail[j].unknownFiles = compResult[i].unknownFiles
                const correctFiles = compResult[i].correctFiles
                const missingFiles = compResult[i].missingFiles
                const modifyedFiles = compResult[i].modifyedFiles
                const unknownFiles = compResult[i].unknownFiles
                for (var k = 0; k < correctFiles.length; k++) {
                  correctFiles[k].correct = true
                  correctFiles[k].componentEntity = compResult[i].componentEntity
                  const pos = correctFiles[k].deployPath.lastIndexOf('/')
                  correctFiles[k].fileName = correctFiles[k].deployPath.substr(pos + 1)
                }
                for (var l = 0; l < modifyedFiles.length; l++) {
                  modifyedFiles[l].modifyed = true
                  modifyedFiles[l].componentEntity = compResult[i].componentEntity
                  const pos1 = modifyedFiles[l].deployPath.lastIndexOf('/')
                  modifyedFiles[l].fileName = modifyedFiles[l].deployPath.substr(pos1 + 1)
                }
                for (var m = 0; m < missingFiles.length; m++) {
                  missingFiles[m].missing = true
                  missingFiles[m].componentEntity = compResult[i].componentEntity
                  const pos2 = missingFiles[m].deployPath.lastIndexOf('/')
                  missingFiles[m].fileName = missingFiles[m].deployPath.substr(pos2 + 1)
                }
                for (var n = 0; n < unknownFiles.length; n++) {
                  unknownFiles[n].unknown = true
                  unknownFiles[n].componentEntity = compResult[i].componentEntity
                  const pos3 = unknownFiles[n].deployPath.lastIndexOf('/')
                  unknownFiles[n].fileName = unknownFiles[n].deployPath.substr(pos3 + 1)
                }
                /!* if (correctFiles) {
                  correctFiles.forEach(item => {
                    item.correct = true
                  })
                }
                missingFiles.forEach(function(value, index, arr) {
                  value.missing = true
                })
                modifyedFiles.forEach(function(value, index, arr) {
                  value.modifyed = true
                })
                unknownFiles.forEach(function(value, index, arr) {
                  value.unknown = true
                })*!/
                this.deviceDetail[j].files = correctFiles.concat(missingFiles)
                this.deviceDetail[j].files = this.deviceDetail[j].files.concat(modifyedFiles)
                this.deviceDetail[j].files = this.deviceDetail[j].files.concat(unknownFiles)
                console.log(this.deviceDetail[j].files)
              }
            }
          }
        })*/
        scanDevice(this.deployPlanId, this.selectedDeviceId).then((res) => {
          const compResult = res.data.data
          this.fileInfo = []
          for (var i = 0; i < compResult.length; i++) {
            const correctFiles = compResult[i].correctFiles
            const missingFiles = compResult[i].missingFiles
            const modifyedFiles = compResult[i].modifyedFiles
            const unknownFiles = compResult[i].unknownFiles
            for (var k = 0; k < correctFiles.length; k++) {
              correctFiles[k].correct = true
              correctFiles[k].componentEntity = compResult[i].componentEntity
              const pos = correctFiles[k].deployPath.lastIndexOf('/')
              correctFiles[k].fileName = correctFiles[k].deployPath.substr(pos + 1)
            }
            for (var l = 0; l < modifyedFiles.length; l++) {
              modifyedFiles[l].modifyed = true
              modifyedFiles[l].componentEntity = compResult[i].componentEntity
              const pos1 = modifyedFiles[l].deployPath.lastIndexOf('/')
              modifyedFiles[l].fileName = modifyedFiles[l].deployPath.substr(pos1 + 1)
            }
            for (var m = 0; m < missingFiles.length; m++) {
              missingFiles[m].missing = true
              missingFiles[m].componentEntity = compResult[i].componentEntity
              const pos2 = missingFiles[m].deployPath.lastIndexOf('/')
              missingFiles[m].fileName = missingFiles[m].deployPath.substr(pos2 + 1)
            }
            for (var n = 0; n < unknownFiles.length; n++) {
              unknownFiles[n].unknown = true
              unknownFiles[n].componentEntity = compResult[i].componentEntity
              const pos3 = unknownFiles[n].deployPath.lastIndexOf('/')
              unknownFiles[n].fileName = unknownFiles[n].deployPath.substr(pos3 + 1)
            }
            this.fileInfo = this.fileInfo.concat(correctFiles).concat(missingFiles).concat(modifyedFiles).concat(unknownFiles)
            /*this.fileInfo = this.fileInfo.concat(missingFiles)
            this.fileInfo = this.fileInfo.concat(modifyedFiles)
            this.fileInfo = this.fileInfo.concat(unknownFiles)*/
            console.log(this.fileInfo)
          }
          this.$notify({
            title: '成功',
            message: '扫描成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '扫描失败',
            type: 'error',
            duration: 2000
          })
        })
      },
      scanQuick() {
      },
      handleScanDevice(row) {
      }
    },
    computed: {
      computedIcon() {
        return function(row) {
          if (row.correct) {
            return 'correct'
          }
          if (row.modifyed) {
            return 'modifyed'
          }
          if (row.missing) {
            return 'error'
          }
          if (row.unknown) {
            return 'unknown'
          }
          return ''
        }
      }
    }
  }
</script>

<style scoped>

</style>

