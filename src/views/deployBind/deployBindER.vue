<template>
  <div :class="className" :id="id" :style="{height:height,width:width,top:top}" :list="detaillist"></div>
</template>

<script>
  import echarts from 'echarts'
  import resize from '../../components/Charts/mixins/resize'
  /* eslint-disable */
  export default {
    name: 'deploy-bind-er',
    mixins: [resize],
    props: {
      detaillist: {
        type: Array,
        default:[]
      },
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '500px'
      },
      height: {
        type: String,
        default: '500px'
      },
      top: {
        type: String,
        default: '15px'
      }
    },
    data() {
      return {
        chart: null,
        list: [],
        dataList: [],
        dataItem: {},
        linksList: [],
        linksItem: {},
        centerDevice: {},
        centerX: 300,
        centerY: 400,
        childX: 550,
        stepY: 200
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id));

        this.chart.setOption({
          title: {
            text: '设备组件关系图'
          },
          tooltip: {},
          animationDurationUpdate: 300,
          animationEasingUpdate: 'quinticInOut',
          series: [
            {
              type: 'graph',
              layout: 'none',
              symbolSize: 50,
              roam: true,
              label: {
                normal: {
                  show: true
                }
              },
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                normal: {
                  textStyle: {
                    fontSize: 14
                  }
                }
              },
              data: this.dataList,
              /*data: [{
                name: '节点1',
                x: 300,
                y: 400
              },{
                name: '节点2',
                x: 550,
                y: 200
              },{
                name: '节点3',
                x: 550,
                y: 400
              }, {
                name: '节点4',
                x: 550,
                y: 600
              },{
                name: '节点5',
                x: 550,
                y: 600
              }
              ],*/
              // links: [],
              links: this.linksList
              /*links: [{
                source: '节点1',
                target: '节点3'
              },{
                source: '节点1',
                target: '节点2'
              }, {
                source: '节点1',
                target: '节点4'
              },{
                source: '节点2',
                target: '节点5'
              }]*/
            }
          ]
        })
      },
      initConfig() {
        if(this.list[0]) {
          this.centerDevice = {
            name: this.list[0].deviceEntity.name,
            x: this.centerX,
            y: this.centerY
          }
        }
        else {
          this.centerDevice = {
          }
        }

        this.dataList = []
        this.linksList = []
        this.dataList.push(this.centerDevice)
        for(let i=0;i<this.list.length;i++) {
          this.dataItem = {
            name: this.list[i].componentEntity.name,
            x: this.childX,
            y: this.stepY*i
          }
          this.linksItem = {
            source: this.centerDevice.name,
            target: this.list[i].componentEntity.name
          }
          this.dataList.push(this.dataItem)
          this.linksList.push(this.linksItem)
        }
        console.log(this.dataList,'jjjjjj')
        console.log(this.linksList, 'lllll')
      }
    },
    watch: {
      detaillist () {
        console.log('我变啦！！')
        console.log(this.detaillist)
        this.list = this.detaillist
        this.initConfig()
        this.initChart()
      }
    }
  }
</script>
