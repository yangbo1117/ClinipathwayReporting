export default {
  color: ['#FA9716', '#FFB82B', '#7562D9', '#FD7062', '#8977D9', '#B0A6E6'],
  backgroundColor: 'rgba(255,255,255,0)',
  textStyle: {},
  title: {
    textStyle: {
      color: '#516b91',
    },
    subtextStyle: {
      color: '#93b7e3',
    },
  },
  line: {
    itemStyle: {
      normal: {
        borderWidth: '2',
      },
    },
    lineStyle: {
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowBlur: 10,
      shadowOffsetY: 10,
      normal: {
        width: '2',
      },
    },
    symbolSize: '6',
    symbol: 'emptyCircle',
    smooth: true,
    label: {
      show: false,
      fontSize: 11,
      color: '#333',
      position: 'top',
    },
  },
  radar: {
    // shape: 'circle',
    name: {
      textStyle: {
        color: '#333',
      },
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(0,0,0,0.1)',
        width: 1,
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(0,0,0,0.1)',
        width: 1,
      },
    },
    splitArea: {
      areaStyle: {
        color: '#fff',
      },
    },
    itemStyle: {
      normal: {
        borderWidth: '2',
      },
    },
    lineStyle: {
      width: '0',
    },
    // areaStyle: {
    //   shadowBlur: 10,
    //   shadowColor: "rgba(0,0,0,.1)",
    //   shadowOffsetX: 0,
    //   shadowOffsetY: 15,
    //   opacity: 0.5
    // },
    symbolSize: '0',
    symbol: 'emptyCircle',
  },
  bar: {
    itemStyle: {
      normal: {
        barBorderWidth: 0,
        barBorderColor: '#ccc',
      },
      emphasis: {
        barBorderWidth: 0,
        barBorderColor: '#ccc',
      },
    },
    label: {
      show: false,
      fontSize: 11,
      color: '#333',
      position: 'top',
    },
  },
  pie: {
    // itemStyle: {
    //   shadowColor: "rgba(0,0,0,0.1)",
    //   shadowBlur: 10,
    //   shadowOffsetY: 10,
    //   normal: {
    //     borderWidth: 0,
    //     borderColor: "#ccc"
    //   },
    //   emphasis: {
    //     borderWidth: 0,
    //     borderColor: "#ccc"
    //   }
    // },
    label: {
      show: false,
      fontSize: 11,
      //color: "#333"
    },
  },
  scatter: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
    label: {
      show: false,
      fontSize: 11,
      color: '#333',
    },
  },
  boxplot: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  parallel: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  sankey: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  funnel: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  gauge: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  candlestick: {
    itemStyle: {
      normal: {
        color: '#edafda',
        color0: 'transparent',
        borderColor: '#d680bc',
        borderColor0: '#8fd3e8',
        borderWidth: '2',
      },
    },
  },
  graph: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
    lineStyle: {
      normal: {
        width: 1,
        color: '#aaaaaa',
      },
    },
    symbolSize: '6',
    symbol: 'emptyCircle',
    smooth: true,
    color: ['#516b91', '#59c4e6', '#edafda', '#93b7e3', '#a5e7f0', '#cbb0e3'],
    label: {
      normal: {
        textStyle: {
          color: '#eeeeee',
        },
      },
    },
  },
  map: {
    itemStyle: {
      normal: {
        areaColor: '#f3f3f3',
        borderColor: '#516b91',
        borderWidth: 0.5,
      },
      emphasis: {
        areaColor: 'rgba(165,231,240,1)',
        borderColor: '#516b91',
        borderWidth: 1,
      },
    },
    label: {
      normal: {
        textStyle: {
          color: '#333',
          fontSize: 11,
        },
      },
      emphasis: {
        textStyle: {
          color: '#333',
          fontSize: 11,
        },
      },
    },
  },
  geo: {
    itemStyle: {
      normal: {
        areaColor: '#f3f3f3',
        borderColor: '#516b91',
        borderWidth: 0.5,
      },
      emphasis: {
        areaColor: 'rgba(165,231,240,1)',
        borderColor: '#516b91',
        borderWidth: 1,
      },
    },
    label: {
      normal: {
        textStyle: {
          color: '#000000',
        },
      },
      emphasis: {
        textStyle: {
          color: 'rgb(81,107,145)',
        },
      },
    },
  },
  categoryAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#aaa',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#666',
      },
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: '#dedede',
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#ccc',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#666',
      },
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: '#eee',
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  logAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#000',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#eeeeee'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#000',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#eeeeee'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  toolbox: {
    iconStyle: {
      normal: {
        borderColor: '#000',
      },
      emphasis: {
        borderColor: '#666666',
      },
    },
    backgroundColor: '#fff',
  },
  legend: {
    left: 'center',
    textStyle: {
      color: '#333',
    },
  },
  tooltip: {
    confine: true,
    axisPointer: {
      lineStyle: {
        color: '#cccccc',
        width: 1,
      },
      crossStyle: {
        color: '#cccccc',
        width: 1,
      },
    },
  },
  timeline: {
    lineStyle: {
      color: '#8fd3e8',
      width: 1,
    },
    itemStyle: {
      normal: {
        color: '#8fd3e8',
        borderWidth: 1,
      },
      emphasis: {
        color: '#8fd3e8',
      },
    },
    controlStyle: {
      normal: {
        color: '#8fd3e8',
        borderColor: '#8fd3e8',
        borderWidth: 0.5,
      },
      emphasis: {
        color: '#8fd3e8',
        borderColor: '#8fd3e8',
        borderWidth: 0.5,
      },
    },
    checkpointStyle: {
      color: '#8fd3e8',
      borderColor: 'rgba(138,124,168,0.37)',
    },
    label: {
      normal: {
        textStyle: {
          color: '#8fd3e8',
        },
      },
      emphasis: {
        textStyle: {
          color: '#8fd3e8',
        },
      },
    },
  },
  visualMap: {
    color: ['#516b91', '#59c4e6', '#a5e7f0'],
  },
  dataZoom: {
    backgroundColor: 'rgba(0,0,0,0)',
    dataBackgroundColor: 'rgba(222,222,222,1)',
    fillerColor: 'rgba(218,238,255,0.2)',
    handleColor: '#cccccc',
    handleSize: '100%',
    textStyle: {
      color: '#333333',
    },
  },
  markPoint: {
    label: {
      normal: {
        textStyle: {
          color: '#eeeeee',
        },
      },
      emphasis: {
        textStyle: {
          color: '#eeeeee',
        },
      },
    },
  },
  grid: {
    borderColor: '#dedede',
  },
};
