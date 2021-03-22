import { color, getLinebreakFormat } from "assets/js/echarts.extendtion";
import _ from "lodash";
import echarts from 'echarts/lib/echarts';
import theme from "components/EchartsCard/theme/chameleonBluePurple";

const SingleRenderEachDiseaseBar = (data) => {
    if (_.isEmpty(data)) {
        return {}
    };
    const newdata = data.sort((a, b) => b.value - a.value);
    let option = {
        dataset: {
            source: newdata,
        },
        tooltip: {
            show: true,
            formatter: function (param) {
                return `${param.data.name}: ${param.data.value}`
            }
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
        legend: {
            show: false,
        },
        xAxis: [
            {
                type: 'category',
                axisLabel: {
                    formatter: getLinebreakFormat(7, 2, 7), //文字保留
                },
            },
        ],
        yAxis: [
            {
                type: 'value',
            }],
        series: [
            {
                type: 'bar',
                barMaxWidth: 15,
                barGap: '100%',
                itemStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: '#FF9A22'
                            }, {
                                offset: 1,
                                color: '#FFD56E'
                            }]
                        },
                        barBorderRadius: 5,
                    }
                },
            },
        ]
    };
    return option;
}

const SingleCompletionRate = data => {
    if (_.isEmpty(data)) {
        return {};
    };
    const colors = theme.color;
    let option = {
        dataset: {
            source: data,
        },
        title: {
            show: false,
        },
        tooltip: {
            trigger: 'item',
            formatter: params => {
                let str = '';
                if (params) {
                    str = params.name + ' ：' + params.data['value'] + '%';
                }
                return str;
            },
        },
        grid: {
            width: '75%',
            top: '10%',
            left: '5%',
            right: '15%',
            bottom: '3%',
        },
        dataZoom: [
            {
                type: 'slider',
                zoomLock: true,
                width: 25,
                showDetail: false,
                yAxisIndex: 0,
                // minValueSpan: 4,
                startValue: 0, //数值index
                endValue: 4,
            },
            {
                type: 'inside',
                yAxisIndex: 0,
            },
        ],
        yAxis: {
            type: 'category',
            inverse: true,
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                show: false,
                inside: false,
            },
        },
        xAxis: {
            type: 'value',
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
        },
        series: [
            {
                type: 'bar',
                barGap: '-100%',
                barMaxWidth: 5,
                itemStyle: {
                    normal: {
                        barBorderRadius: 2,
                        color: '#E0D1EB',
                    },
                },
                silent: true,
                legendHoverLink: false,
                label: {
                    normal: {
                        color: '#666',
                        show: true,
                        position: ['95%', '-16px'],
                        textStyle: {
                            fontSize: 12,
                        },
                        formatter: params => {
                            let str = '';
                            if (params) {
                                str = `${params.data['value']}%`;
                            }
                            return str;
                        },
                    },
                },
            },
            {
                type: 'bar',
                zlevel: 10,
                barMaxWidth: 5,
                itemStyle: {
                    barBorderRadius: 2,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        {
                            offset: 0,
                            color: '#9F91E6',
                        },
                        {
                            offset: 1,
                            color: '#634ECC',
                        },
                    ]),
                },
                label: {
                    normal: {
                        color: '#666',
                        show: true,
                        position: [0, '-16px'],
                        textStyle: {
                            fontSize: 14,
                        },
                        formatter: params => {
                            let str = '';
                            if (params) {
                                str = `${params.dataIndex + 1}.${params.name}`;
                            }
                            return str;
                        },
                    },
                },
            },
        ],
    };
    return option;
};

export {
    SingleRenderEachDiseaseBar,
    SingleCompletionRate,
}