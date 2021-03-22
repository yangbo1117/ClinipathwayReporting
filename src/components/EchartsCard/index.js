import React, { Fragment, useEffect, useState, useMemo } from 'react';
//按需引入
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入
import "echarts/lib/component/dataset";
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';

import "echarts/lib/chart/pie";
import "echarts/lib/chart/scatter";
import "echarts/lib/chart/radar";
import "echarts/lib/chart/map";
import "echarts/lib/chart/tree";
import "echarts/lib/chart/treemap";
import "echarts/lib/chart/graph";
import "echarts/lib/chart/gauge";
import "echarts/lib/chart/funnel";
import "echarts/lib/chart/parallel";
import "echarts/lib/chart/sankey";
import "echarts/lib/chart/boxplot";
import "echarts/lib/chart/candlestick";
import "echarts/lib/chart/effectScatter";
import "echarts/lib/chart/lines";
import "echarts/lib/chart/heatmap";
import "echarts/lib/chart/pictorialBar";
import "echarts/lib/chart/themeRiver";
import "echarts/lib/chart/sunburst";
import "echarts/lib/chart/custom";
import "echarts/lib/component/grid";
import "echarts/lib/component/polar";
import "echarts/lib/component/geo";
import "echarts/lib/component/singleAxis";
import "echarts/lib/component/parallel";
import "echarts/lib/component/calendar";
import "echarts/lib/component/graphic";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/axisPointer";
import "echarts/lib/component/brush";
import "echarts/lib/component/timeline";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "echarts/lib/component/markArea";
import "echarts/lib/component/legendScroll";
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/dataZoom';
import "echarts/lib/component/dataZoomInside";
import "echarts/lib/component/dataZoomSlider";
import "echarts/lib/component/visualMap";
import "echarts/lib/component/visualMapContinuous";
import "echarts/lib/component/visualMapPiecewise";
import "echarts-liquidfill/dist/echarts-liquidfill";
// import "echarts/render/lib/vml/vml";
// import "echarts/render/lib/svg/svg";
import { Card, Space, Empty, Tooltip } from "antd";
import { ArrowDownOutlined, FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import _ from "lodash";
import chameleonBluePurple from './theme/chameleonBluePurple';

echarts.registerTheme('chameleonBluePurple', chameleonBluePurple);

const EchartsCard = ({ 
    title,
    options = {},
    height= 340, 
    backgroundColor = "#fff", 
    ElemId, 
    mapName, 
    mapJson, 
    extra, 
    noStyle,
    ...resProps }
) => {

    const [preData, setPreData] = useState(null);
    const [isFull, setisFull] = useState(false);
    const [charItem, setChartItem] = useState(null);
    const [chartScreen, setchartScreen] = useState(null);

    useEffect(() => {
        if (JSON.stringify(options) !== JSON.stringify(preData)) {
            setPreData(options); //缓存之前的options
            let myChart = echarts.init(document.getElementById(ElemId), 'chameleonBluePurple');
            if (mapName && mapJson) {
                echarts.registerMap(mapName, mapJson);
            } else {
                echarts.registerMap("", {});
            }
            myChart.hideLoading();
            window.addEventListener('resize', function () { //自适应宽度
                myChart.resize();
            });
            myChart.setOption(options, true);
            myChart.resize();
            setChartItem(myChart);
            return () => {
                window.removeEventListener("resize", myChart.resize());
            }
        } else {
            if (!_.isEmpty(charItem)) {
                charItem.resize(); //多次调用resize();
            }
        }
    }, [options, isFull]);



    //保存为图片
    const Export = () => {
        var img = new Image();
        img.src = charItem.getDataURL({
            type: 'png',
            pixelRatio: 1, //放大2倍
            backgroundColor: '#fff',
        });
        img.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL('image/png');
            var a = document.createElement('a');
            // 创建一个单击事件
            var event = new MouseEvent('click');
            // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
            a.download = `${title}.png` || "tupian.png";
            // 将生成的URL设置为a.href属性
            a.href = dataURL;
            // 触发a的单击事件
            a.dispatchEvent(event);
        };
    };

    const cardStyle = useMemo(() => {
        if (isFull) {
            return {
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 998,
                width: '100%',
                height: "100%",
                backgroundColor: backgroundColor,
            }
        } else {
            return {
                width: '100%',
                height: height,
                backgroundColor: backgroundColor,
            }
        }
    }, [isFull])

    return (
        <Fragment>
            <div
                className={noStyle ? styles.base_card : styles.design_card}
                style={cardStyle}
            >
                <div className={styles.flex_between}>
                    <span className={styles.title}>{title || '标题'}</span>
                    <Space className={styles.space_8}>
                        <section>{extra}</section>
                        <Tooltip title="保存图片">
                            <ArrowDownOutlined
                                onClick={() => {
                                    Export();
                                }}
                                className={styles.cursor}
                            />
                        </Tooltip>
                        <Tooltip title="全屏">
                            {isFull ? (
                                <FullscreenExitOutlined
                                    onClick={() => {
                                        setisFull(!isFull);
                                    }}
                                    className={styles.cursor}
                                />
                            ) : (
                                    <FullscreenOutlined
                                        onClick={() => {
                                            setisFull(!isFull);
                                        }}
                                        className={styles.cursor}
                                    />
                                )}
                        </Tooltip>
                    </Space>
                </div>
                <div className={styles.flex_center}>
                    <div id={ElemId} className={styles.canvas}></div>
                    {_.isEmpty(options) && (
                        <div
                            className={styles.emptymask}
                            style={{ backgroundColor: backgroundColor }}
                        >
                            <Empty 
                                description={`暂无${title}数据`}
                                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    )
}

export { EchartsCard };