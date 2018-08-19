<template>
  <div class="app-container calendar-list-container">
    <div style="width:33%;float:left;margin-top: 10px;">
      <el-table :data="deviceList" v-loading="listLoading" element-loading-text="给我一点时间" fit highlight-current-row
                style="width: 100%;height:600px"
      >
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
      <el-table :data="deviceDetail" v-loading="listLoading" element-loading-text="给我一点时间" fit highlight-current-row
                style="width: 100%;height:600px;overflow-y: scroll">
        <el-table-column align="center" width="40" type="expand">
          <template slot-scope="props">
            <el-tabs>
              <el-tab-pane label="正确">
                <el-table :data="props.row.correctFiles">
                  <el-table-column label="文件名称" prop="fileName">
                  </el-table-column>
                  <el-table-column label="路径" prop="deployPath">
                  </el-table-column>
                  <el-table-column prop="correct" label="状态" align="center" width="80px">
                    <template slot-scope="scope">
                      <svg-icon icon-class="correct"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="已修改">
                <el-table :data="props.row.modifyedFiles">
                  <el-table-column label="文件名称" prop="fileName">
                    <!--<template props="fileName">
                      &lt;!&ndash;<span>{{scope.row.deployPath}}</span>&ndash;&gt;
                    </template>-->
                  </el-table-column>
                  <el-table-column label="路径" prop="deployPath">
                  </el-table-column>
                  <el-table-column prop="modifyed" label="状态" align="center" width="80px">
                    <template slot-scope="scope">
                      <svg-icon icon-class="modifyed"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="已删除">
                <el-table :data="props.row.missingFiles">
                  <el-table-column label="文件名称" prop="fileName">
                    <!--<template props="fileName">
                      &lt;!&ndash;<span>{{scope.row.deployPath}}</span>&ndash;&gt;
                    </template>-->
                  </el-table-column>
                  <el-table-column label="路径" prop="deployPath">
                  </el-table-column>
                  <el-table-column prop="missing" label="状态" align="center" width="80px">
                    <template slot-scope="scope">
                      <svg-icon icon-class="error"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="未知">
                <el-table :data="props.row.modifyedFiles">
                  <el-table-column label="文件名称" prop="fileName">
                    <!--<template props="fileName">
                      &lt;!&ndash;<span>{{scope.row.deployPath}}</span>&ndash;&gt;
                    </template>-->
                  </el-table-column>
                  <el-table-column label="路径" prop="deployPath">
                  </el-table-column>
                  <el-table-column prop="unknown" label="状态" align="center" width="80px">
                    <template slot-scope="scope">
                      <svg-icon icon-class="unknown"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>
        <el-table-column align="center" width="40">
          <template slot-scope="scope">
            <span><svg-icon icon-class="组件"></svg-icon></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="组件名" min-width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.componentEntity.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="版本" width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.componentEntity.version}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="路径" min-width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.componentEntity.deployPath}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="文件" min-width="130">
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
        </el-table-column>-->
      </el-table>
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
    name: 'monitor1',
    data() {
      return {
        listLoading: false,
        deployPlanId: '',
        deployplanName: '',
        deviceList: [],
        selectedDeviceId: '',
        deviceDetail: [],
        fileInfo: [],
        fileResult: []
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
          this.deviceDetail = res.data.data
        })
      },
      scanAll() {
        scanDevice(this.deployPlanId, this.selectedDeviceId).then((res) => {
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
                /* if (correctFiles) {
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
                })*/
                this.deviceDetail[j].correctFiles = correctFiles
                this.deviceDetail[j].modifyedFiles = modifyedFiles
                this.deviceDetail[j].unknownFiles = unknownFiles
                this.deviceDetail[j].missingFiles = missingFiles
              }
            }
          }
          console.log(this.deviceDetail)
          this.$notify({
            title: '成功',
            message: '扫描成功',
            type: 'success',
            duration: 2000
          })
        })
        /*scanDevice(this.deployPlanId, this.selectedDeviceId).then((res) => {
          const compResult = res.data.data
          /!*for (var i = 0; i < compResult.length; i++) {
            for (var j = 0; j < this.fileInfo.length; j++) {
              if(compResult[i].componentEntity.id === this.fileInfo[j].componentEntity.id) {
                this.fileInfo[j].modifyedFiles = compResult[i].modifyedFiles
                this.fileInfo[j].missingFiles = compResult[j].missingFiles
                this.fileInfo[j].unknownFiles = compResult[j].unknownFiles
                this.fileInfo[j].correctFiles = compResult[j].correctFiles
                // this.fileInfo[j].files.concat(compResult[i].modifyedFiles).concat(compResult[i].missingFiles).concat(compResult[i].unknownFiles).concat(compResult[i].correctFiles)
              }
            }
          }*!/
          this.fileResult = [
            {
              correctFiles:[{deployPath:'1', id:'1'}]
            },
            {
              correctFiles:[{deployPath:'2', id:'2'}]
            }
          ]
          /!*for(var i = 0; i < this.fileInfo.length; i++) {
            for(var j = 0; j < compResult.length; j++ ) {
              if(this.fileInfo[i].componentEntity.id === compResult[j].componentEntity.id) {
                let resFile = {
                  modifyedFiles: [],
                  missingFiles: [],
                  unknownFiles: [],
                  correctFiles: []
                }
                resFile.modifyedFiles = compResult[j].modifyedFiles,
                resFile.missingFiles = compResult[j].missingFiles,
                resFile.unknownFiles = compResult[j].unknownFiles,
                resFile.correctFiles = compResult[j].correctFiles,
               /!* res = {
                  modifyedFiles: compResult[j].modifyedFiles,
                  missingFiles: compResult[j].missingFiles,
                  unknownFiles: compResult[j].unknownFiles,
                  correctFiles: compResult[j].correctFiles
                }*!/
                this.fileResult.push(res)
              }
            }
          }*!/
          console.log(this.fileResult)
          this.$notify({
            title: '成功',
            message: '扫描成功',
            type: 'success',
            duration: 2000
          })
        })*/.catch(() => {
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

