<template>
  <div style="">
    <webix-ui :config="filemanageUI" id="fileManageUi" style="height: 800px"></webix-ui>
  </div>
</template>

<!--<script>
  /*eslint-disable*/
  window.onload = function () {
    webix.ready(function(){
      webix.ui({
        view:"filemanager",
        id:"files"
      });
      $$("files").parse([
        {id: "files", value: "Files", open: true,  type: "folder", date:  new Date(2014,2,10,16,10), data:[
            { id: "documents", value: "Documents", date:  new Date(2014,2,10,16,10),  type: "folder", open: true, data:[
                {id: "presentations", value: "Presentations", type: "folder", date:  new Date(2014,2,10,16,10), data:[
                    {id: "pres1", value: "October 2014.ppt", type:"pp", date: new Date(2014,2,10,16,10), size: "12830"},
                    {id: "pres2", value: "June 2014.ppt",  type:"pp", date:  new Date(2014,2,10,16,10), size: "20100"},
                    {id: "pres3", value: "April 2014.ppt", type:"pp", date:  new Date(2014,2,10,16,10), size: "15750"}
                  ]},
                {id: "reports", value: "Reports",  type: "folder", date: new Date(2014,2,10,16,10), open: true, data:[
                    {id: "usa", value: "USA",  type: "folder", date:  new Date(2014,2,10,16,10), data:[
                        {id: "salesUS", value: "Sales USA.ppt",  type:"excel", date: new Date(2014,2,10,16,10), size: "12830"},
                        {id: "overviewUS", value: "Overview USA.doc",  type:"doc", date:  new Date(2014,2,10,16,10), size: "15030"},
                        {id: "pricesUS", value: "Prices USA.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "15830"},
                        {id: "productsUS", value: "Products USA.ppt",  type:"excel", date:  new Date(2014,2,10,16,10), size: "20830"}
                      ]},
                    {id: "europe", value: "Europe",  type: "folder", date:  new Date(2014,2,10,16,10), data:[
                        {id: "salesEurope", value: "Sales Europe.ppt",  type:"archive", date:  new Date(2014,2,10,16,10), size: "12830"},
                        {id: "pricesEurope", value: "Prices Europe.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "15830"},
                        {id: "productsEurope", value: "Products Europe.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "20830"},
                        {id: "overviewEurope", value: "Overview Europe.doc",  type:"doc", date:  new Date(2014,2,10,16,10), size: "15030"}
                      ]},
                    {id: "asia", value: "Asia",  type: "folder", date:  new Date(2014,2,10,16,10), data:[
                        {id: "salesAsia", value: "Sales Asia.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "12083"},
                        {id: "pricesAsia", value: "Prices Asia.ppt",  type:"excel", date:  new Date(2014,2,10,16,10), size: "15830"},
                        {id: "overviewAsia", value: "Overview Asia.doc",  type:"doc", date:  new Date(2014,2,10,16,10), size: "15030"},
                        {id: "productsAsia", value: "Products Asia.ppt",  type:"excel", date:  new Date(2014,2,10,16,10), size: "20830"}
                      ]}
                  ]}
              ]},
            { id: "images", value: "Images", type: "folder", date:  new Date(2014,2,10,16,12), open: true, data:[
                {id: "thumbnails", value: "Thumbnails", type: "folder", date:  new Date(2014,2,10,16,12), data:[
                    {id: "thumbnails1", value: "Product 1-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "34.83 KB"},
                    {id: "thumbnails2", value: "Product 2-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "40.10 KB"},
                    {id: "thumbnails3", value: "Product 3-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "33.75 KB"},
                    {id: "thumbnails4", value: "Product 4-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "35.13 KB"},
                    {id: "thumbnails5", value: "Product 5-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "34.72  KB"},
                    {id: "thumbnails6", value: "Product 6-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "37.06  KB"}
                  ]},
                {id: "base", value: "Base images", type: "folder", date:  new Date(2014,2,10,16,12), data:[
                    {id: "base1", value: "Product 1.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "74.83 KB"},
                    {id: "base2", value: "Product 2.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "80.10 KB"},
                    {id: "base3", value: "Product 3.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "73.75 KB"},
                    {id: "base4", value: "Product 4.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "75.13 KB"},
                    {id: "base5", value: "Product 5.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "74.72 KB" },
                    {id: "base6", value: "Product 6.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "77.06 KB"}
                  ]}
              ]},
            { id: "video", value: "Video", type: "folder", date:  new Date(2014,2,10,16,12), data:[
                {id: "video1", value: "New Year 2013.avi", icon: "file-video-o", type:"video", date:  new Date(2014,2,10,16,12), size: "25030000", pId: "video" },
                {id: "video2", value: "Presentation.avi", icon: "file-video-o",type:"video", date:  new Date(2014,2,10,16,12), size: "11072000" , pId: "video"},
                {id: "video3", value: "Conference.avi", icon: "file-video-o", type:"video", date:  new Date(2014,2,10,16,12), size: "31256000", pId: "video" }
              ]}
          ]}
      ]);
    });
  }
    export default {
      name: 'filemanager',
      data() {
        return {
          list:[]
        }
      },
      created() {
      }
    }
</script>-->
<script>
  /*eslint-disable*/
  export default {
    data() {
      return {
        filemanageUI: {
          view: "filemanager",		// 渲染的格式
          container: "fileManageUi",	// 渲染区的容器
          id: "fileManageUi",			// 必须，与渲染的容器的id相对应
        }
      }
    },
    created () {
      // 中文化
      webix.i18n.locales["zh-CN"].filemanager = {
        actions: "动作",
        back: "返回",
        forward: "前进",
        levelUp: "上一级",
        name: "名称",
        size: "大小",
        type: "类型",
        date: "日期",
        copy: "复制",
        cut: "剪切",
        paste: "粘贴",
        upload: "上传",
        remove: "移除",
        create: "创建",
        rename: "重命名",
        location: "目标",
        select: "选择",
        sizeLabels: ["B","KB","MB","GB"],
        iconsView: "缩略图模式",
        tableView: "列表模式",
        hideTree: "隐藏文件目录",
        showTree: "显示文件目录",
        collapseTree: "收起文件目录",
        expandTree: "展开文件目录",
        saving: "保存中...",
        errorResponse: "错误: 操作不会被保存!",
        replaceConfirmation: "您想要替换已存在的文件吗?",
        createConfirmation: "文件夹已存在，您想要替换它吗?",
        renameConfirmation: "文件已存在，您想要替换它吗?",
        yes: "是",
        no: "否",
        types:{
          folder: "Folder",
          doc: "Document",
          excel: "Excel",
          pdf: "PDF",
          pp: "PowerPoint",
          text: "Text File",
          video: "Video File",
          image: "Image",
          code: "Code",
          audio: "Audio",
          archive: "Archive",
          file: "File"
        }
      };
      webix.i18n.setLocale('zh-CN')
      this.$nextTick(() => {
        webix.ready(function () {
          // 初始化数据
          $$("fileManageUi").parse([
            {id: "fileManageUi", value: "Files", open: true,  type: "folder", date:  new Date(2014,2,10,16,10), data:[
                { id: "documents", value: "Documents", date:  new Date(2014,2,10,16,10),  type: "folder", open: true, data:[
                    {id: "presentations", value: "Presentations", type: "folder", date:  new Date(2014,2,10,16,10), data:[
                        {id: "pres1", value: "October 2014.ppt", type:"pp", date: new Date(2014,2,10,16,10), size: "12830"},
                        {id: "pres2", value: "June 2014.ppt",  type:"pp", date:  new Date(2014,2,10,16,10), size: "20100"},
                        {id: "pres3", value: "April 2014.ppt", type:"pp", date:  new Date(2014,2,10,16,10), size: "15750"}
                      ]},
                    {id: "reports", value: "Reports",  type: "folder", date: new Date(2014,2,10,16,10), open: true, data:[
                        {id: "usa", value: "USA",  type: "folder", date:  new Date(2014,2,10,16,10), data:[
                            {id: "salesUS", value: "Sales USA.ppt",  type:"excel", date: new Date(2014,2,10,16,10), size: "12830"},
                            {id: "overviewUS", value: "Overview USA.doc",  type:"doc", date:  new Date(2014,2,10,16,10), size: "15030"},
                            {id: "pricesUS", value: "Prices USA.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "15830"},
                            {id: "productsUS", value: "Products USA.ppt",  type:"excel", date:  new Date(2014,2,10,16,10), size: "20830"}
                          ]},
                        {id: "europe", value: "Europe",  type: "folder", date:  new Date(2014,2,10,16,10), data:[
                            {id: "salesEurope", value: "Sales Europe.ppt",  type:"archive", date:  new Date(2014,2,10,16,10), size: "12830"},
                            {id: "pricesEurope", value: "Prices Europe.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "15830"},
                            {id: "productsEurope", value: "Products Europe.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "20830"},
                            {id: "overviewEurope", value: "Overview Europe.doc",  type:"doc", date:  new Date(2014,2,10,16,10), size: "15030"}
                          ]},
                        {id: "asia", value: "Asia",  type: "folder", date:  new Date(2014,2,10,16,10), data:[
                            {id: "salesAsia", value: "Sales Asia.ppt", type:"excel",  date:  new Date(2014,2,10,16,10), size: "12083"},
                            {id: "pricesAsia", value: "Prices Asia.ppt",  type:"excel", date:  new Date(2014,2,10,16,10), size: "15830"},
                            {id: "overviewAsia", value: "Overview Asia.doc",  type:"doc", date:  new Date(2014,2,10,16,10), size: "15030"},
                            {id: "productsAsia", value: "Products Asia.ppt",  type:"excel", date:  new Date(2014,2,10,16,10), size: "20830"}
                          ]}
                      ]}
                  ]},
                { id: "images", value: "Images", type: "folder", date:  new Date(2014,2,10,16,12), open: true, data:[
                    {id: "thumbnails", value: "Thumbnails", type: "folder", date:  new Date(2014,2,10,16,12), data:[
                        {id: "thumbnails1", value: "Product 1-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "34.83 KB"},
                        {id: "thumbnails2", value: "Product 2-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "40.10 KB"},
                        {id: "thumbnails3", value: "Product 3-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "33.75 KB"},
                        {id: "thumbnails4", value: "Product 4-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "35.13 KB"},
                        {id: "thumbnails5", value: "Product 5-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "34.72  KB"},
                        {id: "thumbnails6", value: "Product 6-th.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "37.06  KB"}
                      ]},
                    {id: "base", value: "Base images", type: "folder", date:  new Date(2014,2,10,16,12), data:[
                        {id: "base1", value: "Product 1.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "74.83 KB"},
                        {id: "base2", value: "Product 2.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "80.10 KB"},
                        {id: "base3", value: "Product 3.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "73.75 KB"},
                        {id: "base4", value: "Product 4.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "75.13 KB"},
                        {id: "base5", value: "Product 5.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "74.72 KB" },
                        {id: "base6", value: "Product 6.jpg", type:"image", date:  new Date(2014,2,10,16,12), size: "77.06 KB"}
                      ]}
                  ]},
                { id: "video", value: "Video", type: "folder", date:  new Date(2014,2,10,16,12), data:[
                    {id: "video1", value: "New Year 2013.avi", icon: "file-video-o", type:"video", date:  new Date(2014,2,10,16,12), size: "25030000", pId: "video" },
                    {id: "video2", value: "Presentation.avi", icon: "file-video-o",type:"video", date:  new Date(2014,2,10,16,12), size: "11072000" , pId: "video"},
                    {id: "video3", value: "Conference.avi", icon: "file-video-o", type:"video", date:  new Date(2014,2,10,16,12), size: "31256000", pId: "video" }
                  ]}
              ]}
          ]);
          $$("fileManageUi").getMenu().add({
            id: "uploadFolder",
            method: "uploadFile",
            directory: true,
            icon: "upload",
            value: '上传文件夹'  // "Upload"
          }, 0);
          console.log($$("fileManageUi").getMenu())
        })
      })
    }
  }
</script>

<style scoped>

</style>
