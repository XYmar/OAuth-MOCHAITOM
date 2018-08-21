import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/projectManage', component: _import('projectManage/index'), hidden: true },
  { path: '/user_manage', component: _import('user_manage/index'), hidden: true },
  { path: '/register', component: _import('register/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'projectManage',
    hidden: true,
    meta: { allowBack: false },
    children: [{
      path: 'projectManage',
      component: _import('projectManage/index'),
      name: 'projectManage',
      meta: { title: 'projectManage', noCache: true }
    }]
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
/*  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [{
      path: 'index',
      component: _import('documentation/index'),
      name: 'documentation',
      meta: { title: 'documentation', icon: 'documentation', noCache: true }
    }]
  }*/
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // 以下都不用

/*  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    meta: { roles: ['admin'] }, // you can set roles in root nav
    children: [{
      path: 'index',
      component: _import('permission/index'),
      name: 'permission',
      meta: {
        title: 'permission',
        icon: 'lock',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }]
  },

  {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('svg-icons/index'),
      name: 'icons',
      meta: { title: 'icons', icon: 'icon', noCache: true }
    }]
  },

  {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'component-demo',
    meta: {
      title: 'components',
      icon: 'component'
    },
    children: [
      /!* { path: 'tinymce', component: _import('components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},*!/
      { path: 'markdown', component: _import('components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
      { path: 'json-editor', component: _import('components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
      { path: 'dnd-list', component: _import('components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
      { path: 'splitpane', component: _import('components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
      { path: 'avatar-upload', component: _import('components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
      { path: 'dropzone', component: _import('components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
      { path: 'sticky', component: _import('components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
      { path: 'count-to', component: _import('components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
      { path: 'mixin', component: _import('components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
      { path: 'back-to-top', component: _import('components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
      { path: 'drag-dialog', component: _import('components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }}
    ]
  },

  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: 'charts',
      icon: 'chart'
    },
    children: [
      { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
      { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table/complex-table',
    name: 'example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: '/example/table',
        component: _import('example/table/index'),
        redirect: '/example/table/complex-table',
        name: 'Table',
        meta: {
          title: 'Table',
          icon: 'table'
        },
        children: [
          { path: 'dynamic-table', component: _import('example/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
          { path: 'drag-table', component: _import('example/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
          { path: 'inline-edit-table', component: _import('example/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
          { path: 'tree-table', component: _import('example/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
          { path: 'custom-tree-table', component: _import('example/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
          { path: 'complex-table', component: _import('example/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
        ]
      },
      { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'tab' }}
    ]
  },

  {
    path: '/form',
    component: Layout,
    redirect: 'noredirect',
    name: 'form',
    meta: {
      title: 'form',
      icon: 'form'
    },
    children: [
      { path: 'create-form', component: _import('form/create'), name: 'createForm', meta: { title: 'createForm', icon: 'table' }},
      { path: 'edit-form', component: _import('form/edit'), name: 'editForm', meta: { title: 'editForm', icon: 'table' }}
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      { path: '401', component: _import('errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
      { path: '404', component: _import('errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'log', component: _import('errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      { path: 'export-excel', component: _import('excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
      { path: 'export-selected-excel', component: _import('excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
      { path: 'upload-excel', component: _import('excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'zip' },
    children: [{ path: 'download', component: _import('zip/index'), name: 'exportZip', meta: { title: 'exportZip' }}]
  },

  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: _import('theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  },

  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: _import('clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [{ path: 'index', component: _import('i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  },*/

//  以上都不用
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/components',
    component: Layout,
    children: [{ path: 'index', component: _import('components/index'), name: 'components', meta: { title: 'components', icon: 'components1' }}]
  },
  {
    path: '/componentTypes',
    component: Layout,
    hidden: true,
    children: [{ path: 'index', component: _import('componentTypes/index'), name: 'componentTypes', meta: { title: 'componentTypes', icon: 'components1' }}]
  },
  {
    path: '/device',
    component: Layout,
    children: [{ path: 'device', component: _import('device/device'), name: 'device', meta: { title: 'device', icon: 'computer' }}]
  },
  /* {
    path: '/scan',
    component: Layout,
    children: [{ path: 'index', component: _import('scan/index'), name: 'scan', meta: { title: 'scan', icon: 'scan2' }}]
  },*/
  {
    path: '/softPackage',
    component: Layout,
    hidden: true,
    children: [{ path: 'index', component: _import('softPackage/index'), name: 'softPackage', meta: { title: 'softPackage', icon: 'package' }}]
  },
  {
    path: '/deployPlan',
    component: Layout,
    children: [{ path: 'deployPlan', component: _import('deployPlan/deployPlan'), name: 'deployPlan', meta: { title: 'deployPlan', icon: 'example' }}]
  },
  {
    path: '/log',
    component: Layout,
    children: [{ path: 'index', component: _import('log/index'), name: 'log', meta: { title: 'log', icon: 'log' }}]
  },
  {
    path: '/deployPlanDetail',
    component: Layout,
    hidden: true,
    children: [{ path: 'deployPlanDetail/:id', component: _import('deployPlanDetail/deployPlanDetail'), name: 'deployPlanDetail', meta: { title: 'deployPlanDetail', icon: 'example' }}]
  },
  {
    path: '/deployBind',
    component: Layout,
    hidden: true,
    children: [{ path: 'deployBind/:id', component: _import('deployBind/deployBind'), name: 'deployBind', meta: { title: 'deployBind', icon: 'example' }}]
  },
  {
    path: '/usermanage',
    component: Layout,
    meta: {
      title: 'usermanage',
      roles: ['admin'] // or you can only set roles in sub nav
    },
    children: [{ path: 'index', component: _import('usermanage/index'), name: 'usermanage', meta: { title: 'usermanage', icon: 'peoples' }}]
  },
  {
    path: '/project',
    component: Layout,
    hidden: true,
    children: [{ path: 'project', component: _import('project/project'), name: 'project', meta: { title: 'project', icon: '工程' }}]
  },
  {
    path: '/deploy',
    component: Layout,
    hidden:true,
    children: [{ path: 'deploy/:id', component: _import('deploy/deploy'), name: 'deploy', meta: { title: 'deploy', icon: 'excel' }}]
  },
  {
    path: '/baseline',
    component: Layout,
    hidden: true,
    children: [{ path: 'baseline', component: _import('baseline/baseline'), name: 'baseline', meta: { title: 'baseline', icon: 'example' }}]
  },
  {
    path: '/connectvnc',
    component: Layout,
    hidden: true,
    children: [{ path: 'vnc/:id', component: _import('connectVNC/index'), name: 'connectvnc', meta: { title: 'vnc', icon: 'example' }}]
  },
  {
    path: '/comps',
    component: Layout,
    hidden: true,
    children: [{ path: 'comps', component: _import('fileManager/comps'), name: 'compd', meta: { title: 'files', icon: 'table', noCache: true }}]
  },
  {
    path: '/newfiles',
    component: Layout,
    hidden: true,
    children: [{ path: 'newfiles/:id', component: _import('fileManager/index'), name: 'files', meta: { title: 'files', icon: 'table' }}]
  },
  // {
  //   path: '/monitor',
  //   component: Layout,
  //   hidden: true,
  //   children: [{ path: 'monitor/:id', component: _import('monitor/monitor'), name: 'monitor', meta: { title: 'monitor', icon: 'table' }}]
  // },
  {
    path: '/monitor1',
    component: Layout,
    hidden: true,
    children: [{ path: 'monitor/:id', component: _import('monitor/monitor'), name: 'monitor', meta: { title: 'monitor', icon: 'table' }}]
  }
]
