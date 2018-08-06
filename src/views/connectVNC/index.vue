<template :id="vncIP">
  <div class="page-home" ref="canvas">
    <!--<canvas id="noVNC_canvas" width="800" height="600">
      Canvas not supported.
    </canvas>-->
    <iframe :src="url" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>
<script src="./containerManagement.js"></script>
<script>
  /*eslint-disable*/
  import * as WebUtil from './webutil'
  import Base64 from '@/novnc/core/base64'
  import Websock from '@/novnc/core/websock'
  import '@/novnc/core/des'
  import '@/novnc/core/input/keysymdef'
  import '@/novnc/core/input/xtscancodes'
  import '@/novnc/core/input/util'
  import { Keyboard } from '@/novnc/core/input/keyboard'
  import { Mouse } from '@/novnc/core/input/mouse'
  import Display from '@/novnc/core/display'
  import '@/novnc/core/inflator'
  import RFB from '@/novnc/core/rfb'
  import '@/novnc/core/input/keysym'
  import { getDevices } from "../../api/device";
  import UI from './novnc_ui'

  export default {
      name: 'connectvnc',
      data () {
        return {
          url: '',
          proId: '',
          vncIP: '',
          userData:{
            username: '',
            password: ''
          },
        }
      },
      created() {
        this.vncIP = this.$route.params.ip
        this.url = 'http://' + this.vncIP + ':9000'
        //window.open("http://" + this.vncIP + ':9000')
        this.proId = this.getCookie('projectId')
        this.userData.username = this.getCookie('username')
        this.userData.password = this.getCookie('password')
      },
      methods: {
        connectVNC() {
          var
            DEFAULT_HOST = '',
            DEFAULT_PORT = '9000',
            DEFAULT_PASSWORD = "",
            DEFAULT_PATH = "websockify"
          ;
          var cRfb = null;
          var oTarget = document.getElementById("noVNC_canvas");

          let that = this
          /*if (!this.currentEquipment) {
            return
          }*/
          // debugger
          // let novncPort = this.currentEquipment.novncPort
          let novncPort = 9000
          // getNovncIp().then(function (resData)
          var current_guac = {};
          current_guac.broker_host = this.vncIP// resData.data.ip;
          current_guac.broker_port = '9000' //resData.data.vncPort;
          current_guac.graphics_passwd = 'spy123456' //resData.data.vncPassword;
          console.log(current_guac)
          // UI.openConnectPanel()
          UI.connect(current_guac);
          // UI.start()
          // WebUtil.init_logging(WebUtil.getConfigVar("logging", "warn"));

          // var sHost =resData.data.data[0].ip || DEFAULT_HOST,
          var sHost = this.vncIP || DEFAULT_HOST,
            nPort = novncPort || DEFAULT_PORT,
            sPassword = DEFAULT_PASSWORD,
            sPath = DEFAULT_PATH
          ;
          /*cRfb = new RFB(oTarget,'192.168.31.173',{
            "target": oTarget, // 目标
            "focusContainer": top.document,  // 鼠标焦点定位
            "encrypt": WebUtil.getConfigVar("encrypt", window.location.protocol === "https:"),
            "repeaterID": WebUtil.getConfigVar("repeaterID", ""),
            "true_color": WebUtil.getConfigVar("true_color", true),
            "local_cursor": WebUtil.getConfigVar("cursor", true),
            "shared": WebUtil.getConfigVar("shared", true),
            "view_only": WebUtil.getConfigVar("view_only", false),
            "onFBUComplete": that._onCompleteHandler,    // 回调函数
            "onDisconnected": that._disconnected  // 断开连接
          });*/
          // cRfb._connect(sHost, nPort, sPassword, sPath);
        },
        _onCompleteHandler (rfb, fbu) {
          // 清除 onComplete 的回调。
          rfb.set_onFBUComplete(function () {
          });

          var oDisplay = rfb.get_display(),
            nWidth = oDisplay.get_width(),
            nHeight = oDisplay.get_height(),

            oView = oDisplay.get_target(),
            nViewWidth = oView.clientWidth,
            nViewHeight = oView.clientHeight
          ;
          // 设置当前与实际的比例。
          oDisplay.setScale(nWidth / nViewWidth, nHeight / nViewHeight);
        }
      },
      mounted() {
        this.$refs['canvas'].style.height = document.body.clientHeight + 'px'
        // this.connectVNC()
      },
      destroyed() {
        // UI.disconnect()
      }
    }
</script>

<style scoped>

</style>
