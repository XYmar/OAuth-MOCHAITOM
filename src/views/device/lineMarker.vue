<template>
  <div>
    <div :class="className" :id="id" :style="{height:height,width:width}" :cpuData="cpuData" :ramData="ramData" style="margin: 20px auto ;border: 1px solid #f0f2f5;"></div>
    <div class="className" id="speed" :style="{height:height,width:width}" :upSpeed="upSpeed" :downSpeed="downSpeed" style="margin: 0 auto ;border: 1px solid #f0f2f5;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
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
      // default: '600px'
      default: '90%'
    },
    height: {
      type: String,
      default: '400px'
    },
    countTime: {
      type: String,
      default: ''
    },
    cpuData: {
      type: Number,
      default: null
    },
    ramData: {
      type: Number,
      default: 0
    },
    upSpeed: {
      type: Number,
      default: 0
    },
    downSpeed: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null,
      chartSpeed: null,
      cpuArr: [],
      ramArr: [],
      upstreamSpeedArr: [],
      downstreamSpeedArr: []
    }
  },
  mounted() {
    this.initChart()
    this.initSpeedChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    this.chartSpeed.dispose()
    this.chartSpeed = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        // backgroundColor: '#f0f2f5',
        // backgroundColor: '#fff',
        // backgroundColor: 'rgba(240, 242, 245, 0.6)',
        // backgroundColor: 'rgba(0, 0, 0, 0.1)',
        title: {
          top: 20,
          text: 'CPU、内存详情',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#000'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['CPU', 'RAM'],
          right: '4%',
          textStyle: {
            fontSize: 12
            // color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '3%',
          right: '4%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
        }],
        yAxis: [{
          // type: 'category',
          type: 'value',
          name: '(占用率：%)',
          axisTick: {
            show: false
          },
          max: 100,
          min: 0,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: 'CPU',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.6)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0.4)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          // itemStyle: { normal: { areaStyle: { type: 'default' }}},
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: this.cpuArr
          // data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
        },
        {
          name: 'RAM',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(199, 21, 133, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(199, 21, 133, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          // itemStyle: { normal: { areaStyle: { type: 'default' }}},
          itemStyle: {
            normal: {
              color: 'rgb(199, 21, 133)',
              borderColor: 'rgba(199, 21, 133, 0.2)',
              borderWidth: 12
            }
          },
          data: this.ramArr
          // data: [220, 182, 125, 145, 122, 191, 134, 150, 120, 110, 165, 122]
        }]
      })
    },
    initSpeedChart() {
      this.chartSpeed = echarts.init(document.getElementById('speed'))

      this.chartSpeed.setOption({
        // backgroundColor: '#f0f2f5',
        // backgroundColor: '#394056',
        // backgroundColor: 'rgba(240, 242, 245, 0.3)',
        // backgroundColor: 'rgba(0, 0, 0, 0.1)',
        title: {
          top: 20,
          text: '上下行速度',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
            // color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['上行速度', '下行速度'],
          right: '4%',
          textStyle: {
            fontSize: 12
            // color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '3%',
          right: '4%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
          // data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
        }],
        yAxis: [{
          // type: 'category',
          type: 'value',
          name: '（KB/S）',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
          // data: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100']
        }],
        series: [{
          name: '上行速度',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(65, 105, 225, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(65, 105, 225, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(65, 105, 225)',
              borderColor: 'rgba(65, 105, 225, 0.27)',
              borderWidth: 12

            }
          },
          data: this.upstreamSpeedArr
          // data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
        }, {
          name: '下行速度',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 69, 0, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(255, 69, 0, 0)'
              }], false),
              shadowColor: 'rgba(255, 69, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(255, 69, 0)',
              borderColor: 'rgba(255, 69, 0, 0.2)',
              borderWidth: 12
            }
          },
          data: this.downstreamSpeedArr
          // data: [220, 182, 125, 145, 122, 191, 134, 150, 120, 110, 165, 122]
        }]
      })
    }
  },
  computed: {
    /* listenCpuData() {
      return this.cpuData
    },*/
    listenCount() {
      return this.countTime
    }
  },
  watch: {
    listenCount: function() {
      this.cpuArr.push(this.cpuData)
      this.ramArr.push(this.ramData)
      this.upstreamSpeedArr.push(this.upSpeed)
      this.downstreamSpeedArr.push(this.downSpeed)
      if (this.cpuArr.length > 16) {
        this.cpuArr.splice(0, this.cpuArr.length - 16)
        this.ramArr.splice(0, this.ramArr.length - 16)
        this.upstreamSpeedArr.splice(0, this.upstreamSpeedArr.length - 16)
        this.downstreamSpeedArr.splice(0, this.downstreamSpeedArr.length - 16)
      }
      this.initChart()
      this.initSpeedChart()
    }
  }
}
</script>
