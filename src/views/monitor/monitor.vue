<template>
  <div class="app-container calendar-list-container"
       v-loading.fullscreen.lock="scanLoading"
       element-loading-text="正在扫描中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       style="position: absolute;top:85px;bottom:0;width:100%;height: 100%;background-color: #f0f2f5;"
  >
    <div class="selectedName" style="width:100%;height: 40px;line-height: 40px;color:#909399;">
      <span v-if="this.selectedDeviceName" style="margin-right: 10px">当前选中设备:{{selectedDeviceName}}</span>
      <span v-if="this.selectedCompName">组件:{{selectedCompName}}</span>
      <div class="btn-group" style="float:right;">
        <!--<el-button class="pan-btn light-blue-btn" style="width:150px" @click="scanAll">
          <svg-icon icon-class="circle"></svg-icon>
          完整扫描
        </el-button>-->
        <el-dropdown style="margin-right: 10px;">
          <el-button type="primary">
            完整扫描
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="width:120px;">
            <el-dropdown-item>
              <span @click="scanAllByDevice" style="padding:0 13px;">
                扫描设备
              </span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="scanAllByComp" style="padding:0 13px;">
                扫描组件
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown>
          <el-button type="primary">
            快速扫描
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="width:120px;">
            <el-dropdown-item>
              <span @click="handleScanQuickByDevice" style="padding:0 13px;">
                扫描设备
              </span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="handleScanQuickByComp" style="padding:0 13px;">
                扫描组件
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--<el-button class="pan-btn light-blue-btn" style="width:150px" @click="scanQuick">
          <svg-icon icon-class="lightning"></svg-icon>
          快速扫描
        </el-button>-->
      </div>
    </div>
    <div style="width:33%;float:left;margin-top: 10px;border:1px solid #ebeef5;height: 90%;">
      <el-table :data="deviceList" v-loading="listLoading" element-loading-text="给我一点时间" fit highlight-current-row
                style="width: 100%;height:100%;"
                :row-key="getRowKeysComp"
                :expand-row-keys="deviceExpands"
                class="deviceList"
      >
        <el-table-column align="left" width="40" type="expand">
          <template slot-scope="props">
            <el-table
              stripe highlight-current-row
              :data="props.row.comps"
              style="padding: 0 0"
              :show-header="false"
            >
              <el-table-column width="40">
                <template slot-scope="scope">
                  <span><svg-icon icon-class="组件"></svg-icon></span>
                </template>
              </el-table-column>
              <el-table-column label="组件名" align="left" width="160">
                <template slot-scope="scope">
                  <span class="link-type"
                        @dblclick="handleSelectComp(scope.row)">{{scope.row.componentEntity.name}}</span>
                </template>
              </el-table-column>
              <el-table-column label="路径" align="left">
                <template slot-scope="scope">
                  <span>{{scope.row.componentEntity.deployPath}}</span>
                </template>
              </el-table-column>
              <!--<el-table-column label="描述">
                <template slot-scope="scope">
                  <span>{{scope.row.componentEntity.description}}</span>
                </template>
              </el-table-column>-->
              <!--<el-table-column prop="correct" label="状态" align="center" width="80px">
                <template slot-scope="scope">
                  <svg-icon icon-class="correct"></svg-icon>
                </template>
              </el-table-column>-->
            </el-table>
          </template>
        </el-table-column>
        <el-table-column align="left" width="40">
          <template slot-scope="scope">
            <span v-if="scope.row.online"><svg-icon icon-class="设备"></svg-icon></span>
            <span v-else><svg-icon icon-class="devicefalse"></svg-icon></span>
          </template>
        </el-table-column>
        <el-table-column align="left" :label="$t('table.deviceName')" min-width="160">
          <template slot-scope="scope">
            <span class="link-type" @dblclick="getDetailByDevice(scope.row, scope.$index)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="IP" min-width="130">
          <template slot-scope="scope">
            <span class="link-type">{{scope.row.ip}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="状态" width="100">
          <template slot-scope="scope">
            <span class="el-tag el-tag--danger" v-if="!scope.row.online">离线</span>
            <span class="el-tag el-tag--primary" v-else>在线</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="width:65%;height:90%;float: right;margin-top: 10px;margin-bottom: 10px;border:1px solid #ebeef5">
      <el-table :data="deviceDetail" v-loading="listLoading" element-loading-text="给我一点时间" fit highlight-current-row
                style="width: 100%;height:100%;overflow-y: scroll"
                :row-key="getRowKeys"
                :expand-row-keys="expands"
                class="scanResTable"
      >
        <el-table-column align="center" type="expand">
          <template slot-scope="props">
            <el-tabs>
              <el-tab-pane label="正确">
                <el-table :data="props.row.correctFiles" stripe fit width="100%" :show-header="false">
                  <el-table-column label="文件名称" prop="name" min-width="240">
                  </el-table-column>
                  <el-table-column label="路径" prop="deployPath" min-width="240">
                  </el-table-column>
                  <el-table-column prop="correct" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                      <svg-icon icon-class="correct"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="已修改">
                <el-table :data="props.row.modifyedFiles" fit width="100%" :show-header="false">
                  <el-table-column label="文件名称" prop="name" min-width="240">
                    <!--<template props="fileName">
                      &lt;!&ndash;<span>{{scope.row.deployPath}}</span>&ndash;&gt;
                    </template>-->
                  </el-table-column>
                  <el-table-column label="路径" prop="deployPath" min-width="240">
                  </el-table-column>
                  <el-table-column prop="modifyed" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                      <svg-icon icon-class="modifyed"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="已删除">
                <el-table :data="props.row.missingFiles" fit width="100%" :show-header="false">
                  <el-table-column label="文件名称" prop="name" min-width="240">
                    <!--<template props="fileName">
                      &lt;!&ndash;<span>{{scope.row.deployPath}}</span>&ndash;&gt;
                    </template>-->
                  </el-table-column>
                  <el-table-column label="路径" prop="deployPath" min-width="240">
                  </el-table-column>
                  <el-table-column prop="missing" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                      <svg-icon icon-class="error"></svg-icon>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="未知">
                <el-table :data="props.row.unknownFiles" fit width="100%" :show-header="false">
                  <el-table-column label="文件名称" prop="name" min-width="240">
                    <!--<template props="fileName">
                      &lt;!&ndash;<span>{{scope.row.deployPath}}</span>&ndash;&gt;
                    </template>-->
                  </el-table-column>
                  <el-table-column label="路径" prop="deployPath" min-width="240">
                  </el-table-column>
                  <el-table-column prop="unknown" label="状态" align="center" width="80">
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
            <span class="link-type" :class="computedClass(scope.row)">{{scope.row.componentEntity.name}}</span>
            <!--<span class="link-type" v-else>{{scope.row.componentEntity.name}}</span>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="版本" width="130">
          <template slot-scope="scope">
            <span class="link-type" :class="computedClass(scope.row)">{{scope.row.componentEntity.version}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="路径" min-width="130">
          <template slot-scope="scope">
            <span class="link-type" :class="computedClass(scope.row)">{{scope.row.componentEntity.deployPath}}</span>
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
    </div>
    <div style="height:20px;width:100%;"></div>
    <el-dialog title="请填写后缀名" :visible.sync="dialogFormVisible" width="40%">
      <div class="dialog-body" style='width: 80%; margin:0 auto;'>
        <span>后缀名：</span>
        <el-autocomplete
          class="inline-input"
          v-model="type1"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
        ></el-autocomplete>
        <span>(例如:exe,txt)</span>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="formReset">取 消</el-button>
        <el-button v-if="dialogStatus=='scanByDevice'" type="primary" @click="scanQuickByDevice">
          {{$t('table.confirm')}}
        </el-button>
        <el-button v-else type="primary" @click="scanQuickByComp">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { deployplanDevice, getDeployDetailByDevice } from '@/api/deployplan'
  import { scanDevice, scanComp, scanQucikByDev, scanQucikByComp } from '@/api/scan'
  import Stomp from 'stompjs'
  import SockJS from 'sockjs-client'
  import Vue from 'vue'
  import service from '@/utils/request'

  export default {
    name: 'monitor',
    data() {
      return {
        listLoading: false,
        scanLoading: false,
        dialogFormVisible: false,
        isExpand: false,
        deployPlanId: '',
        deployplanName: '',
        deviceList: [],
        webResBody: [],
        selectedDeviceId: '',
        selectedDeviceName: '',
        selectedCompName: '',
        selectedCompId: '',
        deviceDetail: [],
        fileInfo: [],
        fileResult: [],
        getRowKeys(row) {
          return row.componentEntity.id
        },
        getRowKeysComp(row) {
          return row.id
        },
        // 要展开的行，数值的元素是row的key值
        expands: [],
        deviceExpands: [],
        type1: '',
        typeSuggest: [{ value: 'pdf' }, { value: 'txt' }, { value: 'sig' }],
        dialogStatus: '',
        textMap: {
          scanByDevice: '快速扫描设备',
          scanByComp: '快速扫描组件'
        }
      }
    },
    created() {
      // alert(this.$route.params.id)
      this.deployPlanId = this.$route.params.id
      this.deployplanName = this.$route.params.name
      this.getDevices(this.deployPlanId)
    },
    methods: {
      querySearch(queryString, cb) {
        cb(this.typeSuggest)
      },
      formReset: function() {
        this.type1 = ''
        this.dialogFormVisible = false
      },
      getDevices(id) {
        deployplanDevice(id).then((res) => {
          this.deviceList = res.data.data
          this.getList2()
        })
      },
      getList2() {
        let url = service.defaults.baseURL + '/OMS'
        let socket = new SockJS(url)
        let stompClient = Stomp.over(socket)
        let that = this
        stompClient.connect({}, function(frame) {
          stompClient.subscribe('/topic/onlineheartbeatmessages', function(response) {
            let resBody = response.body
            let resBody2 = resBody.replace(/[\\]/g, '')
            that.webResBody = JSON.parse(resBody2)

            if (that.deviceList.length > 0) {
              for (let i = 0; i < that.deviceList.length; i++) {
                that.deviceList[i].online = false
              }
            }
            if (that.webResBody.length > 0) {
              for (let i = 0; i < that.webResBody.length; i++) {
                let listIfExist = false
                let tempList = []
                if (that.deviceList.length > 0) {
                  for (let j = 0; j < that.deviceList.length; j++) {
                    if (that.webResBody[i].inetAddress === that.deviceList[j].ip) {      //查找在线设备
                      that.deviceList[j].online = true
                      break
                    }
                  }
                }
              }
            }

            if (that.deviceList.length > 0) {
              for (let i = 0; i < that.deviceList.length; i++) {
                Vue.set(that.deviceList, i, that.deviceList[i])
              }
              console.log('设备----------')
              console.log(that.deviceList)
            }
          })
        })

      },
      getDetailByDevice(row, index) {
        // this.isExpand = false
        this.selectedDeviceId = row.id
        this.selectedDeviceName = row.name
        getDeployDetailByDevice(this.deployPlanId, row.id).then((res) => {
          this.deviceDetail = res.data.data
          this.deviceList[index].comps = res.data.data
          this.deviceExpands.push(row.id)
        })
      },
      handleSelectComp(row) {
        this.selectedCompId = row.componentEntity.id
        this.selectedCompName = row.componentEntity.name
        this.deviceDetail = [row]
      },
      scanAllByDevice() {
        if (this.selectedDeviceId == '') {
          this.$message({
            message: '请先双击选择设备！',
            type: 'warning'
          })
          return
        }
        for (var i = 0; i < this.deviceList.length; i++) {
          if (this.selectedDeviceId == this.deviceList[i].id) {
            if (this.deviceList[i].online === true) {
              this.$notify({
                title: '扫描开始',
                message: '设备完整扫描',
                type: 'success',
                duration: 2000
              })
              this.scanLoading = true
              scanDevice(this.deployPlanId, this.selectedDeviceId).then((res) => {
                this.isExpand = false
                this.scanLoading = false
                const compResult = res.data.data
                this.expands = []
                this.deviceDetail = compResult
                for (var i = 0; i < this.deviceDetail.length; i++) {
                  this.expands.push(this.deviceDetail[i].componentEntity.id)
                }
                /*for (var i = 0; i < compResult.length; i++) {
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
                      /!*for (var k = 0; k < correctFiles.length; k++) {
                        correctFiles[k].correct = true
                        correctFiles[k].componentEntity = compResult[i].componentEntity
                        // const pos = correctFiles[k].deployPath.lastIndexOf('/')
                        // correctFiles[k].fileName = correctFiles[k].deployPath.substr(pos + 1)
                      }
                      for (var l = 0; l < modifyedFiles.length; l++) {
                        modifyedFiles[l].modifyed = true
                        modifyedFiles[l].componentEntity = compResult[i].componentEntity
                        // const pos1 = modifyedFiles[l].deployPath.lastIndexOf('/')
                        // modifyedFiles[l].fileName = modifyedFiles[l].deployPath.substr(pos1 + 1)
                      }
                      for (var m = 0; m < missingFiles.length; m++) {
                        missingFiles[m].missing = true
                        missingFiles[m].componentEntity = compResult[i].componentEntity
                        // const pos2 = missingFiles[m].deployPath.lastIndexOf('/')
                        // missingFiles[m].fileName = missingFiles[m].deployPath.substr(pos2 + 1)
                      }
                      for (var n = 0; n < unknownFiles.length; n++) {
                        unknownFiles[n].unknown = true
                        unknownFiles[n].componentEntity = compResult[i].componentEntity
                        // const pos3 = unknownFiles[n].deployPath.lastIndexOf('/')
                        // unknownFiles[n].fileName = unknownFiles[n].deployPath.substr(pos3 + 1)
                      }*!/
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
                      this.deviceDetail[j].correctFiles = correctFiles
                      this.deviceDetail[j].modifyedFiles = modifyedFiles
                      this.deviceDetail[j].unknownFiles = unknownFiles
                      this.deviceDetail[j].missingFiles = missingFiles
                      this.expands.push(this.deviceDetail[j].componentEntity.id)
                    }
                  }
                }*/
                this.$notify({
                  title: '成功',
                  message: '扫描成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(() => {
                this.scanLoading = false
                this.$notify({
                  title: '失败',
                  message: '扫描失败',
                  type: 'error',
                  duration: 2000
                })
              })
            } else {
              this.$message({
                message: '设备离线！',
                type: 'warning'
              })
            }
          }
        }
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
        })*/
      },
      scanAllByComp() {
        if (this.selectedDeviceId == '') {
          this.$message({
            message: '请先双击选择设备！',
            type: 'warning'
          })
          return
        }
        if (this.selectedCompId == '') {
          this.$message({
            message: '请先双击选择组件！',
            type: 'warning'
          })
          return
        }
        for (var i = 0; i < this.deviceList.length; i++) {
          if (this.selectedDeviceId == this.deviceList[i].id) {
            if (this.deviceList[i].online === true) {
              this.scanLoading = true
              scanComp(this.deployPlanId, this.selectedDeviceId, this.selectedCompId).then((res) => {
                this.scanLoading = false
                this.deviceDetail = []
                this.expands = []
                this.deviceDetail.push(res.data.data)
                this.expands.push(res.data.data.componentEntity.id)
                /*for(var i=0; i < res.data.data.length; i++){
                  this.expands.push(res.data.data.componentEntity.id)
                }*/
                console.log(this.expands)
                console.log('组件扫描')
                console.log(this.deviceDetail)
                this.$notify({
                  title: '成功',
                  message: '组件完整扫描成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(() => {
                this.scanLoading = false
                this.$notify({
                  title: '失败',
                  message: '组件完整扫描失败',
                  type: 'error',
                  duration: 2000
                })
              })
            } else {
              this.$message({
                message: '设备离线！',
                type: 'warning'
              })
            }
          }
        }

      },
      handleScanQuickByDevice() {
        if (this.selectedDeviceId == '') {
          this.$message({
            message: '请先双击选择设备！',
            type: 'warning'
          })
          return
        }
        this.dialogStatus = 'scanByDevice'
        this.type1 = ''
        this.dialogFormVisible = true
      },
      handleScanQuickByComp() {
        /*for(var i = 0; i < this.deviceList.length; i++) {
          if (this.selectedDeviceId == this.deviceList[i].id) {
            if (!this.deviceList[i].online) {
              this.$message({
                message: '设备离线！',
                type: 'warning'
              })
              return
            }
          }
        }*/
        if (this.selectedDeviceId == '') {
          this.$message({
            message: '请先双击选择设备！',
            type: 'warning'
          })
          return
        }
        if (this.selectedCompId == '') {
          this.$message({
            message: '请先双击选择组件！',
            type: 'warning'
          })
          return
        }
        this.dialogStatus = 'scanByComp'
        this.type1 = ''
        this.dialogFormVisible = true
      },
      scanQuickByDevice() {
        for (var i = 0; i < this.deviceList.length; i++) {
          if (this.selectedDeviceId == this.deviceList[i].id) {
            if (this.deviceList[i].online === true) {
              this.$notify({
                title: '扫描开始',
                message: '设备完整扫描',
                type: 'success',
                duration: 2000
              })
              this.scanLoading = true
              scanQucikByDev(this.deployPlanId, this.selectedDeviceId, this.type1).then((res) => {
                this.scanLoading = false
                // this.deviceDetail = []
                // this.deviceDetail.push(res.data.data)
                this.deviceDetail = res.data.data
                this.expands = []
                for (var k = 0; k < res.data.data.length; k++) {
                  this.expands.push(res.data.data[k].componentEntity.id)
                }
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '设备快速扫描成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(() => {
                this.dialogFormVisible = false
                this.scanLoading = false
                this.$notify({
                  title: '失败',
                  message: '设备快速扫描失败',
                  type: 'error',
                  duration: 2000
                })
              })
            } else {
              this.$message({
                message: '设备离线！',
                type: 'warning'
              })
            }
          }
        }
      },
      scanQuickByComp() {
        for (var i = 0; i < this.deviceList.length; i++) {
          if (this.selectedDeviceId == this.deviceList[i].id) {
            if (this.deviceList[i].online === true) {
              this.$notify({
                title: '扫描开始',
                message: '设备完整扫描',
                type: 'success',
                duration: 2000
              })
              this.scanLoading = true
              scanQucikByComp(this.deployPlanId, this.selectedDeviceId, this.selectedCompId, this.type1).then((res) => {
                this.scanLoading = false
                this.deviceDetail = []
                this.deviceDetail.push(res.data.data)
                this.expands = []
                this.expands.push(res.data.data.componentEntity.id)
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '组件快速扫描成功',
                  type: 'success',
                  duration: 2000
                })
              }).catch(() => {
                this.dialogFormVisible = false
                this.scanLoading = false
                this.$notify({
                  title: '失败',
                  message: '组件快速扫描失败',
                  type: 'error',
                  duration: 2000
                })
              })
            } else {
              this.$message({
                message: '设备离线！',
                type: 'warning'
              })
            }
          }
        }
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
      },
      computedClass() {
        return function(row) {
          if (row.correctFiles) {
            if (row.missingFiles.length > 0 || row.modifyedFiles.length > 0) {
              return 'abNormal'
            } else {
              return ''
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .abNormal {
    color: orangered;
  }
</style>

