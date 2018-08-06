/**
 * Created by wangqiong on 2017/3/7.
 */
(function () {
    var
        local_json = {
            "pageInfo": {
                "index": 1, //当前页
                "count": 0, //总条数
                "size": 15 //每页个数
            },
            "queryInfo": {}
        },
        /*表单验证配置*/
        validator,
        validator_search, // 主页面查询的
        containerId, // 容器的id
        operateData;
     // -----------------------------------------------------$(function)开始-------------------------------------------------------------------------------
    $(function(){
//      console.log(UI)
        var validator_search = $(".search-bar").validate({
            rules: {
//              containerName: {
//                  maxlength: 100
//              },
            }
        });
      // 查询
      $(".search-bar").submit(function () {
          if (!validator_search.valid()) {
              // 表单中有输入错误的时候
              var errorField = validator_search.errorList[0].element;
              errorField.focus();
              errorField.scrollIntoView();
              return;
          } else {
              // formData.js中封装了getFormData()
              var formData = getFormData(".search-bar");
              console.log(formData)
              local_json.queryInfo = formData;
              local_json.pageInfo.index = 1;
              loadTable();
          }
      });
      // 点击返回（虚拟机页面）
      $(".goBack").on("click", function(){
          $(".page-module-image").addClass("hidden");
          $(".page-module-main").removeClass("hidden");
          loadTable();
      })
      // 关闭虚拟机
      $(".closeVm").on("click", function(){
         // 按钮禁止
//      $(this).addClass("disabled", "disabled")
        // 调用关闭虚拟机的请求
        closeVm()
      })
    })
     // -----------------------------------------------------$(function)结束-------------------------------------------------------------------------------
    /*列表配置信息*/
    var UI = window.UI
//  console.log(UI)
    $("#userManagement-table").table({
        id: "containerId", // 如果主键不是id，则需要配置
        showRadio: false,
        showNo: false,
        columns: [{
            title: "容器ID",
            field: "containerId"
        }, {
            title: "容器名",
            field: "containerName"
        }, {
            title: "镜像",
            field: "imageName"
        }, {
            title: "状态",
            field: "status"
        }, {
            title: "CPU",
            field: "cpuCoreNum"
        }, {
            title: "RAM",
            field: "ramSize"
        }, {
            title: "DISK",
            field: "diskSize"
        }, {
            title: "创建时间",
            field: "createTime",
            formatter: function (value) {
              var d = new Date(value)
              return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + format(d.getHours()) + ":" + format(d.getMinutes()) + ":" + format(d.getSeconds())
            }
        }, {
            title: "操作",
            field: "status",
            cls: 'operateBar',
            cellTitle: false,
            formatter: function (value, rowData) {
                return [$("<a/>", {
                        "class": "btn edit-btn btn-xs table-btn",
                        "click": function () {
                            $(".page-module-image").removeClass("hidden");
                            $(".page-module-main").addClass("hidden");
                            // 重置一下
                            $("#noVNC_screen").html('<canvas id="noVNC_canvas" width="0" height="0">Canvas not supported.</canvas>')
                            containerId = rowData.containerId
                            // 获取容器的信息（调用方法）
                            getImageRequest(rowData)
                        }
                    }).append(
                        $("<span/>", {
                            "class": "fa"
                        }),
                        document.createTextNode('运行')
                    )
                ];
            }
        }]
    });
    /* 添加的校验 */
    validator = $("#userInfo-form").validate({
        rules: {
            containerName: {
                required: true
            },
            imageName: {
                required: true
            },
            cpuCoreNum: {
                required: true,
                digits:true // 整数
            },
            ramSize: {
                required: true,
                digits:true
            },
            diskSize: {
                required: true,
                digits:true
            }
        }
    });
    /*添加*/
    $(".add-btn").on("click", function () {
        validator.resetFormExtra();
        $('#editDialog').on('show.bs.modal', function (event) {
            $(this).find('.modal-title').text('添加');
        });
        $('#editDialog').modal('show');
        addSubmit();
    });
    /**
     * 添加或修改提交表单的方法
     * @func
     */
    function addSubmit() {
        $("#userInfo-form").off("submit.submit").on("submit.submit", function () {
            if (!validator.valid()) {
                var errorField = validator.errorList[0].element;
                errorField.focus();
                errorField.scrollIntoView();
                return;
            } else {
                var formData = getFormData('#userInfo-form');
                console.log(formData)
                saveData(formData);
            }

        });
    }
    /**
     * 添加保存数据的方法
     * @func
     * @param url
     * @param newData  提交的数据
     */
    function saveData(newData) {
        $.ajax({
            url: rootPath + "/container/add",
            /* headers: {
                encrypt: window.ENCRYPT_TYPE.aes
            }, */
            data: JSON.stringify(newData)
        }).done(function (data) {
            if (data.code === "000") {
                simpleInfoDialog('type-success', code_message['000']);
                $('#editDialog').modal('hide');
                local_json.pageInfo.index = 1;
                loadTable();
            } else {
                simpleInfoDialog('type-warning', data.masg);
            }
        });
    }
    function format(Q){
      return Q < 10 ? '0' + Q : Q
    }
    loadTable();
    getImage()
    /*请求表格数据*/
    function loadTable() {
//      $("#userManagement-table").table("setDatas", []);
        return $.post(rootPath + '/container/list', JSON.stringify(local_json)).done(function (data) {
            if (data.code === "000") {
                $.extend(local_json.pageInfo, data.pageInfo);
            } else {
                simpleInfoDialog('type-warning', data.msg);
            }
        }).always(function (data) {
//          console.log(data.data);
            $("#userManagement-table").table("setDatas", data.data);
            loadPagination("#userManagement-pagination", local_json.pageInfo, loadTable);
        });
    }
    // 获取镜像
    function getImage(){
      $.post(rootPath + '/container/add/imageList').done(function (data) {
//        console.log(data)
          if (data.code === "000") {
//            console.log(data.data)
              fillSelect("#imgName", data.data, "imageId", "imageName");
          } else {
              simpleInfoDialog('type-warning', data.msg);
          }
      })
//    .always(function (data) {
//          console.log(data.data);
//          $("#userManagement-table").table("setDatas", data.data);
//          loadPagination("#userManagement-pagination", local_json.pageInfo, loadTable);
//      });
    }
    // 获取容器信息的（请求是否要，需要与后端协商）
    function getImageRequest(res) {
        var _res = res
        $.post(rootPath + '/container/vm/getConnectionInfo',JSON.stringify({containerId: res.containerId})).done(function (data) {
        	console.log(data);
            if (data.code == "000") {
                if (data.msg == "容器已开启") {
                  var current_guac = {};
                  current_guac.broker_host = data.data.ip;
                  current_guac.broker_port = data.data.vncPort;
                  current_guac.graphics_passwd = data.data.vncPassword;
                  console.log(current_guac)
                  window.UI.connect(current_guac);
                } else if (data.msg == "容器未开启正在开启请稍后") {
                  console.log(window.io)
//                socket = window.io("http://" + "192.168.50.98" + ":10012")
//                console.log(socket)
//                socket.emit('vm_login', data.result.mock_id);
//                socket.on('vm_status', function (data) {
//                  data.asp_vm_status === '1'
//                  if (data.asp_vm_status === '2') {
//                    console.log("启动失败")
//                    setTimeout(function () {
//                      window.location.reload()
//                    }, 1000);
//                    return false;
//                  }
//                });
                } else {
                  console.log(1)
                }
            }
        })
      // 容器基础信息填充
      fillFormData("#image-form", res);
    }
    // 关闭虚拟机
    function closeVm(){
      $.post(rootPath + '/container/vm/stopVm',JSON.stringify({containerId: containerId})).done(function (data) {
//        console.log(data);
//        $(".closeVm").removeClass("disabled")
          if (data.code === "000") {
              simpleInfoDialog('type-success', data.msg);
              setTimeout(function(){
                $(".page-module-image").addClass("hidden");
                $(".page-module-main").removeClass("hidden");
                loadTable();
              },500)
          }
      })
    }
})();