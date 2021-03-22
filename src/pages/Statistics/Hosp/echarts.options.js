import { color, getLinebreakFormat } from "assets/js/echarts.extendtion";
import _ from "lodash";
import echarts from 'echarts/lib/echarts';
import theme from "components/EchartsCard/theme/chameleonBluePurple";

const SingleRenderAvgFeeDayLine = (data) => {
    if (_.isEmpty(data)) {
        return {};
    }
    const colors = theme.color;
    const option = {
        dataset: {
            source: data,
        },
        title: {
            show: false,
        },
        dataZoom: [
            {
                type: 'slider',
                height: 20,
                bottom: '1%',
                showDetail: false,
                // minValueSpan: 9,
                startValue: 0, //数值index
                endValue: 4,
            },
        ],
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            top: '7%',
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                formatter: getLinebreakFormat(7, 2, 7), //文字保留
            },
        },
        yAxis: [
            {
                name: '费用',
                type: 'value',
                position: 'left',
                nameTextStyle: {
                    color: '#777',
                },
            },
            {
                name: '天数',
                type: 'value',
                position: 'right',
                nameTextStyle: {
                    color: '#777',
                },
            },
        ],
        series: [
            {
                type: 'bar',
                // barWidth: 10,
                barMaxWidth: 10,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            {
                                offset: 0,
                                color: colors[5],
                            },
                            {
                                offset: 1,
                                color: colors[2],
                            },
                        ]),
                    },
                },
            },
            {
                type: 'bar',
                // barWidth: 10,
                barMaxWidth: 10,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            {
                                offset: 0,
                                color: colors[1],
                            },
                            {
                                offset: 1,
                                color: colors[3],
                            },
                        ]),
                    },
                },
            },
        ],
    };
    return option;
};

const SingleRenderNumberOfPeopleFunnel = (data) => {
    if (_.isEmpty(data)) {
        return {}
    };
    let option = {
        dataset: {
            source: data
        },
        tooltip: {
            trigger: 'item',
            formatter: function (param) {
                return `${param.data.name}: ${param.data.value}`
            }
        },
        legend: {
            show: false,
            top: "3%",
        },
        series: [
            {
                type: 'funnel',
                x: '20%',
                x2: '5%',
                y: '17%',
                y2: '17%',
                width: '60%',
                sort: 'descending',
                gap: 2,
                label: {
                    show: true,
                    fontSize: 12,
                    position: 'inside',
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: .5
                },
                emphasis: {
                    label: {
                        fontSize: 16
                    }
                },

            }
        ]
    };
    return option;
};

//饼图
const CureImproveDethliquidFill = (data) => {
    if (_.isEmpty(data)) {
        return {};
    }
    let option = {
        tooltip: {
            formatter: '{b} : {c}%',
            //   formatter: '{b} : {c}人（{d}%）', // a->seriesName,b->legendName,c->value,d->percent
        },
        gird: {
            top: '8%',
        },
        legend: {
            orient: 'vertical',
            left: 0,
            bottom: '5%',
            itemWidth: 10,
            itemHeight: 10,
        },
        series: [
            {
                name: '分布',
                type: 'pie',
                clockwise: false,
                data: data,
                radius: ['35%', '60%'],
                center: ['50%', '50%'],
                hoverAnimation: false,
                // roseType: 'radius', //南丁格尔
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 2,
                    },
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{a|{b}：{c}%}\n{hr|}',
                    rich: {
                        hr: {
                            backgroundColor: 't',
                            borderRadius: 100,
                            width: 0,
                            height: 6,
                            padding: [3, 3, 0, -12],
                            shadowColor: '#1c1b3a',
                            shadowBlur: 1,
                            shadowOffsetX: 1,
                            shadowOffsetY: 2,
                        },
                        a: {
                            padding: [-35, 15, -20, 5],
                        },
                    },
                },
                labelLine: {
                    normal: {
                        length: 20,
                        length2: 30,
                        lineStyle: {
                            width: 0.5,
                        },
                    },
                },
            },
        ],
    };
    return option;
}

//折线图
const SingleRenderPatCntLine = data => {
    if (_.isEmpty(data)) {
        return {};
    }
    const colors = theme.color;
    let option = {
        dataset: {
            source: data,
        },
        title: {
            show: false,
        },
        tooltip: {
            trigger: 'axis',
            formatter: params => {
                let str = '';
                if (params) {
                    str = params[0].name + '<br />';
                    params.forEach(i => {
                        str += i.seriesName + '：' + i.data[i.seriesName] + '<br />';
                    });
                }
                return str;
            },
        },
        dataZoom: [
            {
                type: 'slider',
                height: 20,
                bottom: '1%',
                showDetail: false,
                // minValueSpan: 9,
                startValue: 0, //数值index
                endValue: 9,
            },
        ],
        legend: {
            show: true,
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                formatter: getLinebreakFormat(6, 3, 6), //文字保留
            },
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                type: 'line',
                symbol: 'circle',
                itemStyle: {
                    color: colors[2],
                },
                areaStyle: {
                    normal: {
                        opacity: 0.1,
                        color: colors[2],
                    },
                },
            },
        ],
    };
    return option;
};

const SingleRenderValueRatioLineBar = (data) => {
    if (_.isEmpty(data)) {
        return {}
    };
    let option = {
        dataset: {
            source: data,
        },
        tooltip: {
            show: true,
            trigger: 'axis',
            formatter: (params) => {
                let str = "";
                if (params) {
                    let obj = params[0];
                    str = obj.name + "<br />";
                    let keys = _.keys(obj.data).slice(1);
                    str += keys[0] + ": " + obj.data[keys[0]] + "<br />";
                    str += keys[1] + ": " + obj.data[keys[1]] + "%<br />";
                };
                return str;
            }
        },
        legend: {
            show: true,
            top: "5%",
        },
        dataZoom:
        {
            type: "slider",
            height: 20,
            bottom: "1%",
            showDetail: false,
            startValue: 0, //数值index
            endValue: 4,
        },
        xAxis: {
            type: "category",
            axisLabel: {
                formatter: getLinebreakFormat(7, 2, 7), //文字保留
            },
        },
        yAxis: [
            {
                type: "value",
                position: "left",
            },
            {
                type: "value",
                position: "right",
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        series: [
            {
                type: "bar",
                barMaxWidth: 12,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: theme.color[5]
                    },
                },
            },
            {
                type: "line",
                smooth: true,
                symbolSize: 7,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: theme.color[2]
                    },
                },
            }
        ]
    };
    return option;
}

export {
    SingleRenderAvgFeeDayLine,
    SingleRenderNumberOfPeopleFunnel,
    CureImproveDethliquidFill,
    SingleRenderValueRatioLineBar,
    SingleRenderPatCntLine,
}