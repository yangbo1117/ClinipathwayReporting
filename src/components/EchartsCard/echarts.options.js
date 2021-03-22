
import { color, getLinebreakFormat } from "assets/js/echarts.extendtion";
import _ from "lodash";
import echarts from 'echarts/lib/echarts';
import theme from "./theme/chameleonBluePurple";

const SingleRenderImproveDeathInfectedRatioLine = (data) => {
    let keys = _.keys(data[0]);
    if (_.isEmpty(data)) {
        return {}
    };
    let options = {
        legend: {
            show: true,
        },
        grid: {
            top: "20%",
            bottom: "15%",
        },
        dataZoom: [
            {
                type: "slider",
                height: 20,
                bottom: "1%",
                showDetail: false,
                startValue: 0, //数值index
                endValue: 9,
            },
        ],
        tooltip: {
            trigger: "axis",
            backgroundColor: '#fff',
            textStyle: {
                color: '#5c6c7c'
            },
            padding: [10, 10],
            formatter: (params) => {
                let str = params[0].axisValueLabel + "<br />"
                params.forEach(i => {
                    str += `${i.seriesName}: ${i.data[i.seriesName]} % <br />`
                });
                return str;
            }
        },
        dataset: {
            source: data
        },
        xAxis: [
            {
                type: "category",
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dotted",
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                scale: true,
                boundaryGap: false,
                axisLabel: {
                    interval: 0,
                    rotate: -10,
                },
            },
        ],
        yAxis: [
            {
                gridIndex: 0,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#c1c1c1",
                        type: "dotted",
                    }
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                type: "value",
            },
        ],
        series: keys.slice(1).map((i, index) => {
            return (
                {
                    type: "line",
                    smooth: true,

                    lineStyle: {
                        normal: {
                            opacity: 1,
                            width: 2,
                            color: color[index],
                            shadowColor: "rgba(0,0,0,0)",
                        }
                    },
                    showSymbol: true
                }
            )
        })
    };
    return options;
}

//临床路径手术部位感染和非计划重返手术室人数比例变化
const SingleRenderPeopleRatioBarLine = (data) => {
    if (_.isEmpty(data)) {
        return {}
    };
    const colors = ['#4BC946', '#FDA975', '#27D3E2', '#27D3E2'];
    const splitNumber = 5; // 分割段数
    let option = {
        dataset: {
            source: data,
        },
        color: colors,
        // backgroundColor: '#fff',
        title: {
            show: false,
            x: 'center',
            textStyle: { color: '#2D527C', fontSize: '20', fontWeight: 'bold' },
            subtextStyle: { color: '#2D527C', fontSize: '14', fontWeight: 'bold' }
        },
        grid: {
            left: "8%",
            right: "12%",
        },
        dataZoom: [
            {
                type: "slider",
                height: 20,
                bottom: "1%",
                showDetail: false,
                startValue: 0, //数值index
                endValue: 9,
            },
        ],
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#fff',
            textStyle: {
                color: '#5c6c7c'
            },
            padding: [10, 10],
        },
        xAxis: {
            type: 'category',
            axisTick: { show: false },
            axisLabel: {
                textStyle: { color: '#333333', fontSize: 12 }
            },
            axisLine: {
                show: false,
                lineStyle: { color: '#707070' }
            },
        },
        yAxis: [{
            type: 'value',
            position: 'left',
            splitNumber: splitNumber,
            splitLine: {
                lineStyle: { type: 'dotted', color: '#ccc' }
            },
            axisLabel: {
                // formatter: '{value}mm',
                textStyle: { color: colors[0], fontSize: 14 }
            },
            axisLine: { show: false },
            axisTick: { show: false }
        }, {
            type: 'value',
            position: 'right',
            // offset: 30,
            min: 0,
            splitNumber: splitNumber,
            splitLine: { show: false },
            axisLine: { show: false },
            axisLabel: {
                formatter: '{value}%',
                textStyle: { color: colors[1], fontSize: 14 }
            },
            axisTick: { show: false }
        },],
        series: [{
            type: 'bar',
            barWidth: 20,
            yAxisIndex: 0,
        },
        {
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            yAxisIndex: 1,
        },
        {
            type: 'bar',
            barWidth: 20,
            yAxisIndex: 0,
        },
        {
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            yAxisIndex: 1,
        }
        ]
    };
    return option;
}

//trend
//病种
const EachDiseasesBar = (data) => {
    if (_.isEmpty(data)) {
        return {}
    }
    let keys = _.keys(data[0]);
    let legendStyle = {
        show: true
    };
    if (keys.length > 3) {
        legendStyle = {
            type: 'scroll',
            width: "65%",
            left: "15%",
        };
    }
    let options = {
        baseOption: {
            dataset: {
                source: data,
                // source: [
                //     { "Operator": "2013", "OperPatCnt": 5, "AvgPreOperPeriod": 5.000000, "AvgPostOperPeriod": 3.800000, "OperDeathCpn": 2.100 },
                //     { "Operator": "2015", "OperPatCnt": 5, "AvgPreOperPeriod": 4.400000, "AvgPostOperPeriod": 2.400000, "OperDeathCpn": 3.1200 },
                //     { "Operator": "2016", "OperPatCnt": 5, "AvgPreOperPeriod": 2.000000, "AvgPostOperPeriod": 9.800000, "OperDeathCpn": 5.200 },
                //     { "Operator": "2017", "OperPatCnt": 1, "AvgPreOperPeriod": 0.000000, "AvgPostOperPeriod": 45.000000, "OperDeathCpn": 4.2222 },
                //     { "Operator": "2018", "OperPatCnt": 2, "AvgPreOperPeriod": 2.000000, "AvgPostOperPeriod": 3.000000, "OperDeathCpn": 3.333 },
                //     { "Operator": "2019", "OperPatCnt": 38, "AvgPreOperPeriod": 3.000000, "AvgPostOperPeriod": 4.421052, "OperDeathCpn": 4.1500 },
                //     { "Operator": "2020", "OperPatCnt": 86, "AvgPreOperPeriod": 3.720930, "AvgPostOperPeriod": 3.406976, "OperDeathCpn": 3.1000 },
                // ]
            },
            legend: legendStyle,
            tooltip: {
                trigger: "axis",
                backgroundColor: '#fff',
                textStyle: {
                    color: '#5c6c7c'
                },
                confine: true,
                padding: [10, 10],
            },
            // grid: {
            //     top: "20%",
            //     left: "15%",
            //     bottom: "15%",
            // },
            dataZoom: [
                {
                    type: "slider",
                    height: 20,
                    bottom: "1%",
                    showDetail: false,
                    startValue: 0, //数值index
                    endValue: 4,
                },
            ],
            xAxis: {
                type: "category",
                axisLabel: {
                    //color: labelColor,
                    interval: 0, //横轴信息全部显示
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
            },
            yAxis: [
                {
                    //show: false,
                    type: "value",
                    position: "left",
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                },
            ],
            series: keys.slice(1).map((i, index) => {
                return (
                    {
                        name: i,
                        type: "bar",
                        barWidth: 15,
                        barCategoryGap: "30%",
                        itemStyle: {
                            normal: {
                                color: color[index],
                                shadowColor: "rgba(0,0,0,0.06)",
                                shadowBlur: 6,
                                shadowOffsetX: 8,
                                shadowOffsetY: 8,
                            }
                        },
                        label: {
                            normal: {
                                // show: true
                            }
                        }
                    }
                )
            })
        }
    }
    return options;
}

//好转/治愈/死亡 人数对比
let StackDiseasesBar = (data) => {
    if (_.isEmpty(data)) {
        return {}
    };
    let keys = _.keys(data[0])
    let option = {
        dataset: {
            source: data,
            // source: [
            //     { "year": 2015, "机构A": 120, "机构B": 80, "机构C": 34 },
            //     { "year": 2016, "机构A": 70, "机构B": 140, "机构C": 52 },
            //     { "year": 2017, "机构A": 85, "机构B": 130, "机构C": 98 },
            //     { "year": 2018, "机构A": 79, "机构B": 95, "机构C": 67 },
            // ]
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#fff',
            textStyle: {
                color: '#5c6c7c'
            },
            padding: [10, 10],
            formatter: (params) => {
                let labelTitle = params[0].axisValueLabel
                let str = labelTitle + "<br />";
                params.forEach(i => {
                    if (i.seriesName === "cureCnt") {
                        str += "治愈人数: " + i.data[i.seriesName] + "<br />";
                    }
                    if (i.seriesName === "improveCnt") {
                        str += "好转人数: " + i.data[i.seriesName] + "<br />";
                    }
                    if (i.seriesName === "deathCnt") {
                        str += "死亡人数: " + i.data[i.seriesName] + "<br />";
                    }
                });
                return str;
            }
        },
        grid: {
            x: "13%",
            x2: "20%",
            y: "15%",
            y2: "25%",
        },
        dataZoom: [
            {
                type: "slider",
                width: 25,
                right: "5%",
                showDetail: false,
                yAxisIndex: 0,
                // start: 0,
                // end: 50,
            },
            {
                type: "inside",
                // yAxisIndex: 0,
                startValue: 0,
            }
        ],
        legend: {
            formatter: (params) => {
                switch (params) {
                    case "cureCnt":
                        return "治愈人数"
                    case "improveCnt":
                        return "好转人数"
                    case "deathCnt":
                        return "死亡人数"
                    default:
                        return params
                }
            },
        },
        xAxis: {
            type: 'value',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "#c1c1c1",
                    type: "dotted",
                }
            },
        },
        yAxis: {
            type: 'category',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
            },
        },
        series: keys.slice(1).map((i, index) => {
            return (
                {
                    type: 'bar',
                    stack: 'number',
                    barWidth: 20,
                    barCategoryGap: "35%",
                    // yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            color: color[index + 1],
                            // barBorderRadius: 4,
                            shadowColor: "rgba(0,0,0,0.06)",
                            shadowBlur: 6,
                            shadowOffsetX: 6,
                            shadowOffsetY: 6,
                        }
                    },
                    label: {
                        normal: {
                            position: 'right',
                            fontSize: 10
                        }
                    }
                }
            )
        })
    };
    return option;
}

//治愈人数/比例对比
const TrendCureImproveDethCntBarLine = (data) => {
    // const arr = [
    //     { name: "2018年1季度", "治愈人数": 512, "临床路径入组人数": 899, "治愈率": 0.57 },
    //     { name: "2018年3季度", "治愈人数": 433, "临床路径入组人数": 899, "治愈率": 0.48 },
    //     { name: "2018年4季度", "治愈人数": 687, "临床路径入组人数": 899, "治愈率": 0.76 },
    //     { name: "2019年1季度", "治愈人数": 732, "临床路径入组人数": 899, "治愈率": 0.81 },
    // ]
    if (_.isEmpty(data)) {
        return {};
    }
    const option = {
        dataset: {
            source: data,
        },
        title: {
            show: false,
        },
        // grid: {
        //     top: "20%",
        //     bottom: "15%",
        // },
        dataZoom: [
            {
                type: "slider",
                height: 20,
                bottom: "1%",
                showDetail: false,
                startValue: 0, //数值index
                endValue: 9,
            },
        ],
        tooltip: {
            trigger: "axis",
            backgroundColor: '#fff',
            textStyle: {
                color: '#5c6c7c'
            },
            padding: [10, 10],
        },
        legend: {
            textStyle: {
                color: '#B4B4B4'
            },
            top: '7%',
        },
        xAxis: {
            type: "category",
            axisLine: {
                lineStyle: {
                    color: '#B4B4B4'
                }
            },
            axisTick: {
                show: false,
            },
        },
        yAxis: [{
            type: "value",
            splitLine: { show: false },
            axisLine: {
                lineStyle: {
                    color: '#B4B4B4',
                }
            },
            position: "left",
        },
        {
            type: "value",
            position: "right",
            splitLine: { show: false },
            axisLine: {
                lineStyle: {
                    color: '#B4B4B4',
                }
            },
            axisLabel: {
                formatter: '{value}%',
            }
        }],

        series: [
            {
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#956FD4' },
                                { offset: 1, color: '#3EACE5' }
                            ]
                        )
                    }
                },
            },
            {
                type: 'bar',
                barGap: '-100%',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: 'rgba(156,107,211,0.5)' },
                                { offset: 0.2, color: 'rgba(156,107,211,0.3)' },
                                { offset: 1, color: 'rgba(156,107,211,0)' }
                            ]
                        )
                    }
                },
                z: -12,
            },
            {
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 8,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: '#F02FC2'
                    },
                },
            },

        ]
    };
    return option;
}

//比例
let AvgFeeDayLine = (data) => {
    if (_.isEmpty(data)) {
        return {}
    };
    let keys = _.keys(data.result[0]);
    let legendStyle = {
        show: true,
    }
    if (keys.length > 3) {
        legendStyle = {
            type: 'scroll',
            width: "65%",
            top: "1%",
            left: "15%",
            align: 'auto',
        };
    };
    let options = {
        baseOption: {
            dataset: {
                // source: [
                //     { "Operator": "2013", "OperPatCnt": 5, "AvgPreOperPeriod": 5.000000, "AvgPostOperPeriod": 3.800000, "OperDeathCpn": 2.100 },
                //     { "Operator": "2015", "OperPatCnt": 5, "AvgPreOperPeriod": 4.400000, "AvgPostOperPeriod": 2.400000, "OperDeathCpn": 3.1200 },
                // ]
                source: data.result,
            },
            tooltip: {
                trigger: "axis",
                formatter: (params) => {
                    let labelTitle = params[0].axisValueLabel
                    let str = labelTitle + "<br />";
                    params.forEach(i => {
                        str += i.seriesName + ":" + i.data[i.seriesName] + "% <br />";
                    });
                    return str;
                }
            },
            legend: legendStyle,
            dataZoom: [
                {
                    type: "slider",
                    height: 20,
                    bottom: "1%",
                    showDetail: false,
                    startValue: 0, //数值index
                    endValue: 9,
                },
            ],
            xAxis: {
                type: "category",
            },
            yAxis: [
                {
                    max: data.maxVal,
                    min: data.minVal,
                    type: "value",
                    position: "left",
                    axisLabel: {
                        formatter: "{value}%",
                    }
                },
            ],
            series: keys.slice(1).map((i, index) => {
                return (
                    {
                        name: i,
                        type: "line",
                        itemStyle: {
                            normal: {
                                color: color[index]
                            }
                        },
                        lineStyle: {
                            normal: {
                                width: 3,
                            }
                        },
                        markLine: {
                            silent: true,
                            symbol: "none",               //去掉警戒线最后面的箭头
                            label: {
                                position: "end",         //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                                formatter: `均值${data.avgVal}%`
                            },
                            data: [{
                                lineStyle: {               //警戒线的样式 ，虚实  颜色
                                    color: "#f50"
                                },
                                yAxis: data.avgVal
                            }]
                        }
                    }
                )
            })
        }
    }
    return options;
}

//入组率 /变异率 /完成率
let RatioPathwayBar = (data) => {
    if (_.isEmpty(data)) {
        return {}
    };
    let keys = _.keys(data[0]);
    let options = {
        dataset: {
            // source: [
            //     { "OperName": "2011", "OperPatCnt": 424, "OperPatCntLoy": 403, "OperPatCntYoy": null },
            //     { "OperName": "2012", "OperPatCnt": 208, "OperPatCntLoy": 161, "OperPatCntYoy": null },
            //     { "OperName": "2013", "OperPatCnt": 74, "OperPatCntLoy": 68, "OperPatCntYoy": null },
            // ]
            source: data
        },
        tooltip: {
            confine: true,
            trigger: "axis",
            backgroundColor: '#fff',
            textStyle: {
                color: '#5c6c7c'
            },
            padding: [10, 10],
            formatter: (params) => {
                if (!_.isEmpty(params)) {
                    let str = params[0].axisValueLabel + "<br />";
                    params.forEach(i => {
                        str += i.seriesName + ": " + i.value[i.seriesName] + "<br />"
                    });
                    return str;
                } else {
                    return ""
                }
            },
        },
        dataZoom: [
            {
                type: "slider",
                width: 25,
                right: "5%",
                top: "15%",
                showDetail: false,
                yAxisIndex: 0,
                startValue: 0, //数值index
                endValue: 4,
            },
            {
                type: "inside",
                yAxisIndex: 0,
                startValue: 0,
            }
        ],
        grid: {
            x: "25%",
            x2: "8%",
            y: "10%",
            y2: "10%",
            width: '45%'
        },
        legend: {
            show: true,
            top: "3%",
        },
        xAxis: {
            show: false,
            type: "value",
            position: "left",
            splitLine: {
                // show: true,
                lineStyle: {
                    // color: "#efefef",
                    width: 1,
                    type: "dotted"
                }
            },
        },
        yAxis: [
            {

                type: "category",
                splitLine: {
                    // show: true,
                    lineStyle: {
                        // color: "#efefef",
                        width: 1,
                        type: "dotted"
                    }
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                inverse: true,
                axisLabel: {
                    // interval: 0,
                    formatter: getLinebreakFormat(8, 1, 8) //文字保留
                }
            }
        ],
        series: keys.slice(1).map((i, index) => {
            return (
                {
                    name: i,
                    type: "bar",
                    barWidth: 10,
                    barCategoryGap: "35%",
                    // yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            color: color[index],
                            barBorderRadius: 4,
                            // shadowColor: "rgba(0,0,0,0.06)",
                            // shadowBlur: 6,
                            // shadowOffsetX: 8,
                            // shadowOffsetY: 8,
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            fontSize: 10,
                            formatter: function (param) {
                                return `${param.data[param.seriesName]}%`
                            }
                        }
                    }
                }
            )
        })
    };
    return options
}

//全院出院人数/ 已开展临床路径的病种全院收治人数/ 全院进入路径人数
let ContainerPeopleLine = (data) => {
    if (_.isEmpty(data)) {
        return {}
    };
    const selfcolor = [
        "#0090FF",
        "#36CE9E",
        "#FFC005",
        "#FF515A",
        "#8B5CFF",
        "#00CA69"
    ];
    const hexToRgba = (hex, opacity) => {
        let rgbaColor = "";
        let reg = /^#[\da-f]{6}$/i;
        if (reg.test(hex)) {
            rgbaColor = `rgba(${parseInt("0x" + hex.slice(1, 3))},${parseInt(
                "0x" + hex.slice(3, 5)
            )},${parseInt("0x" + hex.slice(5, 7))},${opacity})`;
        }
        return rgbaColor;
    };
    let keys = _.keys(data[0]);
    let options = {
        dataset: {
            source: data,
            // source: [
            //     { "MonthDate": "2018-02-01", "FirstGradeOperPatCnt": 14, "SecondGradeOperPatCnt": 3, },
            //     { "MonthDate": "2018-03-01", "FirstGradeOperPatCnt": 22, "SecondGradeOperPatCnt": 2, },
            //     { "MonthDate": "2018-04-01", "FirstGradeOperPatCnt": 20, "SecondGradeOperPatCnt": 3, },
            // ]
        },
        legend: {
            show: true,
            top: "3%",
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: '#fff',
            textStyle: {
                color: '#5c6c7c'
            },
            padding: [10, 10],
            extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)',
            formatter: function (params) {
                let newparams = _.uniqBy(params, "seriesName");
                if (!_.isEmpty(newparams)) {
                    let str = newparams[0].axisValueLabel + "<br />";
                    newparams.forEach(i => {
                        str += i.seriesName + ": " + i.value[i.seriesName] + "<br />"
                    });
                    return str;
                } else {
                    return ""
                }
            }
        },
        dataZoom: [
            {
                type: "slider",
                bottom: "5%",
                height: 20,
                showDetail: false,
                startValue: 0, //数值index
                endValue: 9,
            },
        ],
        axisPointer: {
            show: true,
            type: "shadow"
        },
        // grid: {
        //     x: "10%",
        //     x2: "10%",
        //     y: "15%",
        //     y2: "20%",
        // },
        xAxis: [
            {
                type: "category",
                // splitLine: {
                //     show: true,
                //     lineStyle: {
                //         type: "dotted",
                //     },
                // },
                axisLabel: {
                    textStyle: {
                        color: "#333"
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#D9D9D9",
                    },
                },
                // scale: true,
                boundaryGap: false,
            },
        ],
        yAxis: [
            {
                type: "value",
                axisLabel: {
                    textStyle: {
                        color: "#666"
                    }
                },
                nameTextStyle: {
                    color: "#666",
                    fontSize: 12,
                    lineHeight: 40
                },
                splitLine: {
                    lineStyle: {
                        type: "dashed",
                        color: "#E9E9E9"
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                //offset: 20,
            },
        ],
        series: keys.slice(1).map((i, index) => {
            return (
                {
                    name: i,
                    type: "line",
                    smooth: true,
                    // showSymbol: false,/
                    symbolSize: 6,
                    zlevel: 3,
                    lineStyle: {
                        normal: {
                            color: selfcolor[index],
                            shadowBlur: 3,
                            shadowColor: hexToRgba(selfcolor[index], 0.5),
                            shadowOffsetY: 8
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: hexToRgba(selfcolor[index], 0.3)
                                },
                                {
                                    offset: 1,
                                    color: hexToRgba(selfcolor[index], 0.1)
                                }
                            ],
                                false,
                            ),
                            shadowColor: hexToRgba(selfcolor[index], 0.1),
                            shadowBlur: 10
                        }
                    },
                }
            )
        })
    };
    return options;
}

//散点
let ScatterBox = (data) => {
    // var data = [
    //     [
    //         [28604,77,'2012',"机构A"],
    //         [31163,77.4,'2013',"机构A"],
    //         [1516,68,'2014',"机构A"],
    //     ],
    //     [
    //         [44056,81.8,'2012',"机构B"],
    //         [43294,81.7,'2013',"机构B"],
    //         [13334,76.9,'2014',"机构B"],
    //     ]
    // ];
    if (_.isEmpty(data)) {
        return {}
    };
    let option = {
        // backgroundColor: "#efefef",
        legend: {
            type: 'scroll',
            width: "65%",
            left: "15%",
        },
        xAxis: {
            type: "category",
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        dataZoom: [
            {
                type: "slider",
                bottom: "5%",
                height: 20,
                showDetail: false,
                start: 0,
            },
            {
                type: "inside",
            }
        ],
        tooltip: {
            show: true,
            formatter: (params) => {
                let str = params.seriesName + "<br />";
                // str += "年份: " + params.data[0] + "<br />";
                str += "院内感染发生率: " + params.data[1] + "% <br />";
                str += "院内感染发生人数: " + params.data[2] + "<br />";
                return str;
            }
        },
        yAxis: {
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            axisLabel: {
                formatter: "{value}%"
            },
            scale: true
        },
        series: data.map((item, index) => {
            return (
                {
                    name: _.last(item[0]),
                    data: item,
                    type: 'scatter',
                    // symbolSize: 20,
                    symbolSize: function (params) {
                        if (params[1] <= 1) {
                            return (params[1] * 10 + 5)
                        } else if (params[1] < 10) {
                            return params[1];
                        } else if (params[1] > 10) {
                            return Number(parseInt(params[1] / 5) + 10);
                        };
                    },
                    emphasis: {
                        label: {
                            show: true,
                            color: color[index + 2],
                            // formatter: function (param) {
                            //     return `${param.data[2]}年
                            //     入组率：${param.data[1]}
                            //         变异率：${param.data[0]}
                            //     `;
                            // },
                            position: 'top',
                        }
                    },
                    itemStyle: {
                        color: color[index],
                        shadowBlur: 10,
                        shadowColor: 'rgba(120, 36, 50, 0.5)',
                        shadowOffsetY: 5,
                    }
                }
            )
        })
    };
    return option;
}

//桑基图
let SankeyLine = (data) => {
    if (_.isEmpty(data)) {
        return {}
    };
    let options = {
        title: {
            // text: ''
        },
        color: [
            "#000000",
            "#61a0a8",
            "#61a0a8",
            "#d48265",
            "#749f83",
            "#ca8622",
            "#bda29a",
            "#6e7074",
            "#546570",
            "#c4ccd3",
            "#f05b72",
            "#ef5b9c",
            "#f47920",
            "#905a3d",
            "#fab27b",
            "#2a5caa",
            "#444693",
            "#726930",
            "#b2d235",
            "#6d8346",
            "#ac6767",
            "#1d953f",
            "#6950a1",
            "#1d953f"
        ],
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'sankey',
                data: data.nodes,
                links: data.links,
                layout: "none",
                nodeGap: 12,
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: 'transparent'
                    }
                },
                focusNodeAdjacency: true, //鼠标 hover 到节点或边上，相邻接的节点和边高亮的交互
                label: {
                    fontSize: 12,
                    color: "#666",
                    formatter: (params) => {
                        return params.name;
                    }
                    // fontSize: 12,
                    // lineHeight: 14,
                    // padding: [2, 0,2,0]
                },
                lineStyle: {
                    normal: {
                        color: 'source',
                        curveness: 0.5
                    }
                }
            }
        ]
    }
    return options;
}

//上海市地图
let ShangHaiProviceMap = (data, json) => {
    if (_.isEmpty(data)) {
        return {}
    };
    // let minData = 0;
    // let maxData = 0;
    // if (!_.isEmpty(data)) {
    //     maxData = _.maxBy(data, function (o) { return o.value }).value; //最大值
    //     minData = _.minBy(data, function (o) { return o.value }).value; //最小值
    // };
    let geoCoordMap = {};
    json.features.map(i => {
        return i.properties
    })
        .forEach(i => {
            geoCoordMap[i.name] = i.cp
        });
    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
                res.push({
                    ...data[i],
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value)
                });
            }
        }
        return res;
    };
    let option = {
        title: {
            text: '上海市地图',
            // subtext: '市区统称为市区',
            x: 'left',
            textStyle: {
                color: '#ccc'
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: '#09bdb1',
            borderColor: '#FFFFCC',
            showDelay: 0,
            hideDelay: 0,
            enterable: true,
            transitionDuration: 0,
            extraCssText: 'z-index:100',
            formatter: function (params, ticket, callback) {
                //根据业务自己拓展要显示的内容
                var res = "";
                var name = params.name;
                var value = params.value;
                // console.log(params)
                if (params.data) {
                    // if (_.isArray(value)) {
                    //     res = "<span style='color:#fff;'>" + name + "</span><br/>全院临床路径平均住院费用：" + _.last(value) + "元";
                    // } else {
                    res += "全院临床路径平均住院费用： <br />";
                    params.data.totalValue.forEach(i => {
                        res += i.name + ":" + i.value + "元 <br />"
                    });
                    // }
                } else {
                    res = "<span style='color:#fff;'>" + name + "</span><br/>全院临床路径平均住院费用：" + value + "元";
                }
                return res;
            }
        },
        legend: {
            show: false,
            orient: 'vertical',
            top: 'top',
            left: 'right',
            data: ['totalFee'],
            textStyle: {
                color: '#fff'
            }
        },
        visualMap: { //颜色的设置  dataRange
            show: false,
            x: 'left',
            y: 'center',
            seriesIndex: [1],
            // min: minData,
            // max: maxData,
            text: ['高', '低'], // 文本，默认为数值文本
            textStyle: {
                color: '#fff'
            },
            inRange: {
                color: ['#5cd2c3', '#419bd3', '#7a95d2', '#5dcbdc', '#838dcd', '#5de9b1', '#5dc6df', '#5db8ea', '#2bbc90', '#5dc4e3']
            }
        },
        geo: {
            map: 'shanghai',
            itemStyle: { //地图区域的多边形 图形样式
                color: '#fff',
                normal: { //是图形在默认状态下的样式
                    label: {
                        show: true, //是否显示标签
                        textStyle: {
                            color: '#ff0'
                        },
                    },
                    borderWidth: 1,
                    borderColor: 'rgba(37,124,169)',
                    shadowColor: '#e8e8e8',
                    shadowOffsetY: 15,
                    shadowOffsetX: 8,
                },
            },
        },
        series: [{
            name: 'totalFee',
            type: 'effectScatter',
            // left: '150',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: function (val) {
                if (val > 1000) {
                    return val[2] / 1000;
                } else {
                    return 20
                }
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'bottom',
                    color: '#444',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#10f9ff',
                    shadowBlur: 0,
                    shadowColor: '#05C3F9'
                }
            },
            zlevel: 1
        }, {
            type: 'map',
            mapType: 'shanghai',
            // left: '350',
            // zoom: 1.2,
            roam: false, //是否开启鼠标缩放和平移漫游
            itemStyle: { //地图区域的多边形 图形样式
                // color: ['rgb(11,85,142)', 'rgb(13,106,177)'],
                normal: { //是图形在默认状态下的样式
                    label: {
                        show: true, //是否显示标签
                        textStyle: {
                            color: 'transparent'
                        },
                    },
                    borderWidth: 1,
                    borderColor: '#28729f',
                    areaColor: '#29b4b7',
                },
                emphasis: { //是图形在高亮状态下的样式,比如在鼠标悬浮或者图例联动高亮时
                    label: {
                        show: false,
                        textStyle: {
                            color: 'transparent'
                        },
                    },
                    borderColor: '#28729f',
                    areaColor: '#9ea9f7',
                }
            },
            data: data
        }]
    };
    return option;
}

//个项占比
let PercentageOfItems = (data, otherTitle) => {
    if (_.isEmpty(data)) {
        return {}
    };
    let keys = _.keys(data.lineNode[0]);
    let option = {
        color: color,
        title: [{
            show: false,
            left: '2%',
            top: '3%',
            textStyle: {
                fontSize: 22
            }
        }, {
            text: otherTitle,
            left: '77%',
            top: '20%',
            textAlign: 'center',
            textStyle: {
                fontSize: 15
            }
        }],
        dataset: {
            source: data.lineNode,
        },
        tooltip: {
            trigger: 'axis',
            
        },
        legend: {
            left: '25%',
            bottom: '2%',
            textStyle: {
                fontSize: 12,
                fontWeight: 'bold'
            },
            data: keys.slice(1, 3),
        },
        grid: {
            left: '2.5%',
            right: '40%',
            top: '8%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                textStyle: {
                    fontSize: 12,
                },
            },
            boundaryGap: false,
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: keys[1],
                smooth: true,
                type: 'line',
                symbolSize: 8,
                symbol: 'circle',
            }, {
                name: keys[2],
                smooth: true,
                type: 'line',
                symbolSize: 8,
                symbol: 'circle',
            },
            {
                type: 'pie',
                center: ['78%', '60%'],
                radius: ['20%', '35%'],
                encode: {
                    itemName: 'name',
                    value: "value",
                },
                label: {
                    normal: {
                        show: true,
                        // position: 'center',
                        // formatter: '{text|{b}}',
                        rich: {
                            text: {
                                fontSize: 18,
                                align: 'center',
                                verticalAlign: 'middle',
                                padding: 8
                            },
                        },
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: 14,
                        }

                    }
                },
                labelLine: {
                    show: true,
                    smooth: true,
                    length: 15,
                    //length2:10,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        return params.name + ": " + params.data.value + "%"
                    }
                },
            }
        ]
    };

    return option;
}

//平均药费及均次药费
const AvgTotalFeeAvgMedicineFeeBar = (data) => {
    if (_.isEmpty(data)) {
        return {};
    };
    let fontColor = '#666';

    let lineOption = {
        lineStyle: {
            color: 'rgba(151,151,151,0.5)',
            type: 'dashed'
        }
    }
    let option = {
        dataset: {
            source: data.result
        },
        legend: {
            show: true,
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#fff',
            padding: [10, 10],
            textStyle: {
                color: '#5c6c7c'
            },
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            top: '14%',
            right: '16%',
            left: '15%',
            bottom: '20%'
        },
        dataZoom: [
            {
                type: "slider",
                height: 20,
                bottom: "1%",
                showDetail: false,
                startValue: 0, //数值index
                endValue: 4,
            },
        ],
        xAxis: [{
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: 'rgba(151,151,151,0.5)',
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                margin: 10,
                color: fontColor,
                textStyle: {
                    fontSize: 12
                },
            },
        }],
        yAxis: [{
            max: data.maxVal,
            axisLabel: {
                formatter: '{value}',
                color: fontColor,
            },
            axisTick: {
                show: false
            },
            axisLine: lineOption,
            splitLine: {
                show: false,
            }
        }, {
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            }
        }],
        series: [
            {
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00BD89' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#C9F9E1' // 100% 处的颜色
                        }], false)
                    }
                },
                markLine: {
                    silent: true,
                    symbol: "none",               //去掉警戒线最后面的箭头
                    label: {
                        position: "end",         //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                        formatter: `平均值${data.avgArr[0]}`
                    },
                    data: [{
                        lineStyle: {               //警戒线的样式 ，虚实  颜色
                            type: "dashed",
                            color: "#00BD89"
                        },
                        yAxis: data.avgArr[0]
                    }]
                }
            },
            {
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(57,89,255,1)' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: 'rgb(46,200,207,1)' // 100% 处的颜色
                        }], false)
                    }
                },
                markLine: {
                    silent: true,
                    symbol: "none",               //去掉警戒线最后面的箭头
                    label: {
                        position: "end",         //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                        formatter: `平均值${data.avgArr[1]}`
                    },
                    data: [{
                        lineStyle: {               //警戒线的样式 ，虚实  颜色
                            type: "dashed",
                            color: 'rgb(46,155,207)'
                        },
                        yAxis: data.avgArr[1]
                    }]
                }
            }
        ]
    };
    return option;
}

//雷达图
const LessRatioRabar = (data) => {
    if (_.isEmpty(data)) {
        return {};
    }
    let option = {
        color: ['#35C96E', '#4DCEF8'],
        tooltip: {
            backgroundColor: '#fff',
            padding: [10, 10],
            textStyle: {
                color: '#5c6c7c'
            },
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            top: "10%",
        },
        legend: {
            show: true,
            orient: 'vertical',
            x: 'left',
            left: '10',
            top: '2%',
            textStyle: {
                color: '#6DaEe8'
            }
        },
        radar: {
            radius: "55%",
            name: {
                textStyle: {
                    fontSize: 12,
                },
                formatter: (params) => {
                    if (params) {
                        return _.replace(params, '全院临床路径', '');
                    }
                    return "未知"
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(81, 106, 134, .6)',
                        'rgba(81, 106, 134, 0.4)', 'rgba(81, 106, 134, 0.3)',
                        'rgba(81, 106, 134, 0.2)', 'rgba(81, 106, 134, 0.1)'
                    ],
                    opacity: .8,
                }
            },
            // shape: 'circle',
            indicator: data.indicator,
        },
        series: [{
            type: 'radar',
            // areaStyle: {normal: {}},
            label: {
                show: false,
                color: "#fff",
            },
            // symbol: "circle",
            symbolSize: 3,
            /** 如果是 echarts 3.8.0（这个官方示例那），得这么配置
            label: {
                normal: {
                    show: true
                }
            }
            */
            data: _.map(data.result, function (o) {
                return {
                    "areaStyle": {
                        normal: {
                            opacity: 0.7,
                        }
                    },
                    ...o,
                }
            }),
        }]
    };
    return option;
}

export {
    SingleRenderImproveDeathInfectedRatioLine,
    SingleRenderPeopleRatioBarLine,
    //trend
    TrendCureImproveDethCntBarLine,
    EachDiseasesBar, RatioPathwayBar,
    ContainerPeopleLine, AvgFeeDayLine,
    StackDiseasesBar, ScatterBox,
    SankeyLine, ShangHaiProviceMap,
    PercentageOfItems,
    AvgTotalFeeAvgMedicineFeeBar,
    LessRatioRabar,
};