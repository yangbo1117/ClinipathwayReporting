import React, { Component, Fragment } from "react";
import { Tabs, Form, DatePicker, Button, Table, Row, Col, TreeSelect, Select, Space } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./index.action";
import _ from "lodash";
import moment from "moment";
import { EchartsCard } from "components/EchartsCard/index";
import {
    EachDiseasesBar,
    RatioPathwayBar,
    ContainerPeopleLine,
    AvgFeeDayLine,
    TrendCureImproveDethCntBarLine,
    ScatterBox,
    ShangHaiProviceMap,
    PercentageOfItems,
    AvgTotalFeeAvgMedicineFeeBar,
    LessRatioRabar,
} from "components/EchartsCard/echarts.options";
import Fixed from "utils/tofixed";
import { columnSubCnt, columnPathCnt, columnDiseases, columnDate, columnsChart } from "assets/js/reportColumns";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
import ExportExcell from "assets/js/better-xlsx";
import DataItemCard from "./component/ItemCard";
import shanghaiJson from "components/EchartsCard/map/shanghai.json";
import locationChart from "./locationChart";
// import responseTest from "./trend.json";

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

let columnTrend = _.map(_.concat(columnDate, columnSubCnt, columnPathCnt, columnDiseases), function (i, index) {
    return {
        ...i,
        // width: 140,
        render: (text) => {
            if (text === "-") {
                return <span>-</span>
            } else {
                return (i.isRatio ? <span>{Fixed(text)}%</span> : <span>{Fixed(text)}</span>)
            }
        },
    }
});

const radioprops = [
    { label: "按年度", value: "year" },
    { label: "按季度", value: "quarter" },
]
class TrendAnalysis extends Component {
    formref = React.createRef();
    state = {
        getType: "year",
        //each
        eachDiseasesTitle: "已开展临床路径的病种全院收治人数",
        eachDiseasesValue: "pathwayOfDiseasesCnt",

        //Ratio
        avgTitle: "全院入组率",
        avgvalue: "inPathwayRatio",

        // //percentage
        percentageTitle: "全院临床路径好转人数占比",
        percentageValue: "improveCnt",

        //地图灰调
        isgray: false,

        //雷达图机构
    }

    componentDidMount() {
        this.props.GetTimes();
        this.props.GetInstitution();
        // this.props.Test(responseTest);  //测试用
    }

    //不可选年份
    disableDate = current => {
        const { years } = this.props;
        let newyear = years.sort((a, b) => a - b);
        return current < moment(Number(_.head(newyear)), 'YYYY') || current > moment(Number(_.last(newyear)) + 1, 'YYYY')
    }

    //查询
    SubmitSearch = (values) => {
        const { getType } = this.state;
        let start = values.year[0].format('YYYY-Q').split("-");
        let end = values.year[1].format('YYYY-Q').split("-");
        let data = {};
        if (getType === "year") {
            data = {
                "start": {
                    "year": Number(start[0]),
                },
                "end": {
                    "year": Number(end[0]),
                },
                "organizations": values.organizations,
            }
        }
        if (getType === "quarter") {
            data = {
                "start": {
                    "year": Number(start[0]),
                    "quarter": Number(start[1]),
                },
                "end": {
                    "year": Number(end[0]),
                    "quarter": Number(end[1]),
                },
                "organizations": values.organizations,
            }
        }
        this.props.GetReportTrend(data);
    }

    //查询方式
    onChange = (value) => {
        this.setState({ getType: value });
    }

    shakeNull = (data) => {
        let obj = {};
        _.forIn(data, function (value, key) {
            if (_.isNull(value)) {
                _.set(obj, key, "-");
            } else {
                _.set(obj, key, value);
            }
        });
        return obj
    }

    //数据为null时候显示 "-"
    renderListData = (data) => {
        let resultData = data.map((item, index) => {
            let newdata = [];
            if (_.isEmpty(item.summary)) {
                newdata = _.concat(
                    item.details.map((i, idx) => ({
                        ...this.shakeNull(i),
                        "key": idx
                    })),
                )
            } else {
                newdata = _.concat(
                    item.details.map((i, idx) => ({ ...this.shakeNull(i), "key": idx })),
                    { ...this.shakeNull(item.summary), "formatDate": "统计", "key": "summary" },
                )
            }
            return {
                "data": newdata,
                "title": item.organizationName,
                "organizationId": item.organizationId,
            };
        });
        return resultData;
    }

    //选择机构
    onSelectChange = (val, label, extra) => {
        let newinstitutions = [...this.props.institutions]
        if (!_.isEmpty(val)) {
            let filterVal = extra.triggerNode.props.type;
            this.props.FilterInstitution(filterVal, newinstitutions, this.props);
        } else {
            this.props.FilterInstitution("", newinstitutions, this.props);
        }
    };

    // //重置
    // resetForm = () => {
    //     this.formref.current.resetFields();
    //     this.setState({ showMaxIcon: false, value: [] });
    //     this.props.GetInstitution();
    // }

    //各项柱状
    InitDiseasesOptionData = (data, keyword) => {
        let newdetails = _.flattenDeep(data.map(i => {
            return i.details;
        }));
        let years = _.keys(_.groupBy(newdetails, "formatDate"));
        let result = years.map(i => {
            let obj = {};
            data.forEach((t, index) => {
                let value = t.details.filter(c => c.formatDate.toString() === i.toString());
                if (!_.isEmpty(value)) {
                    _.set(obj, t.organizationName, value[0][keyword]);
                } else {
                    _.set(obj, t.organizationName, null);
                }
            })
            return {
                "name": i,
                ...obj
            }
        });
        return result;
    }

    //各项平均
    FilterAvgFeeDayData = (data, summary, keyword) => {
        let newdetails = _.flattenDeep(data.map(i => {
            return i.details;
        }));
        if (_.isEmpty(newdetails)) {
            return {}
        }
        let years = _.keys(_.groupBy(newdetails, "formatDate"));
        let result = years.map(i => {
            let obj = {};
            data.forEach((t, index) => {
                let value = t.details.filter(c => c.formatDate.toString() === i.toString());
                if (!_.isEmpty(value)) {
                    _.set(obj, t.organizationName, value[0][keyword]);
                } else {
                    _.set(obj, t.organizationName, null);
                }
            })
            return {
                "name": i,
                ...obj
            }
        });
        let maxVal = _.maxBy(newdetails, function (o) { return o[keyword] });
        let minVal = _.minBy(newdetails, function (o) { return o[keyword] });;
        let avgVal = summary.summary[keyword] || 0;
        return {
            result,
            avgVal,
            "maxVal": Math.ceil(maxVal[keyword] / 10) * 10,
            "minVal": Math.floor(minVal[keyword] / 10) * 10,
        };
    }

    //入组/完成/变异 率
    FillterRatioPathwaySummary = (data) => {
        const keywords = ["inPathwayRatio", "completionOfPathwayRatio", "negativeVariantRatio"];
        let result = data.map((i, index) => {
            let obj = { "name": i.organizationName };
            keywords.forEach(item => {
                obj[columnsChart[item]] = i.summary[item]
            })
            return obj;
        });
        return result;
    }

    //全院出院人数/ 已开展临床路径的病种全院收治人数/ 全院进入路径人数
    FilterPathSummary = (data) => {
        const keywords = ["inPathwayCnt", "pathwayOfDiseasesCnt", "patCnt"];
        let result = data.map((i, index) => {
            let obj = { "name": i.organizationName };
            keywords.forEach(item => {
                obj[columnsChart[item]] = i.summary[item]
            })
            return obj;
        });
        return result;
    };

    //治愈人数及治愈率
    FiltercureCntRatioBarLineData = (data) => {
        const keywords = ["cureCnt", "completionOfPathwayCnt", "cureRatio"];
        let result = data.map(item => {
            let obj = { "name": item.organizationName };
            keywords.forEach(i => {
                obj[columnsChart[i]] = item.summary[i]
            });
            return obj;
        });
        return result;
    }

    //生成散点图
    renderScatterData = (data) => {
        let newdata = data.map((i, index) => {
            let newItem = i.details.map((value, key) => {
                return [value["formatDate"], value["infectedRatio"], value["infectedCnt"], i.organizationName]
            });
            return newItem;
        });
        return newdata;
    };

    //区域分布
    FillterShanghaiMapData = (data) => {
        const keyword = "totalFee";
        let actualdata = data.filter(i => i.organizationLocation); //排除 机构集合
        let locationGroup = _.groupBy(actualdata, "organizationLocation");
        let result = _.keys(locationGroup).map(i => {
            let actualItem = actualdata.filter(t => t.organizationName === locationChart[i])[0];
            if (actualItem) {
                return {
                    "name": actualItem.organizationName,
                    "value": actualItem.summary[keyword],
                    "totalValue": locationGroup[i].map(c => ({ "name": c.organizationName, "value": c.summary[keyword] })),
                }
            } else {
                return {
                    "name": locationChart[i],
                    "value": 0,
                    "totalValue": locationGroup[i].map(c => ({ "name": c.organizationName, "value": c.summary[keyword] })),
                }
            }
        });
        return result;
    };

    //个项占比
    FillterPercentageOfItemsData = (data, key) => {
        let Percentage = columnDiseases.filter(i => i.dataIndex === key)[0].name;
        let Items = columnDiseases.filter(i => i.dataIndex === "completionOfPathwayCnt")[0].name;
        let lineNode = data.map(i => {
            return {
                name: i.organizationName,
                [Items]: i.summary["completionOfPathwayCnt"],
                [Percentage]: i.summary[key],
                value: Number(Fixed((i.summary[key] / i.summary["completionOfPathwayCnt"]) * 100))
            };
        });
        return { lineNode };
    };

    //平均费用及药费
    FilterAvgTotalMedicineFeeData = (data, summary) => {
        const keywords = ["totalFee", "avgMedicineFee"];
        let result = data.map(item => {
            let obj = { "name": item.organizationName };
            keywords.forEach(i => {
                obj[columnsChart[i]] = item.summary[i]
            });
            return obj;
        });
        let maxVal = _.max(keywords.map(i => {
            let maxItem = _.maxBy(result, function (o) { return o[columnsChart[i]] });
            return maxItem[columnsChart[i]];
        }));
        let avgArr = keywords.map(i => {
            return (summary.summary[i] || 0)
        });
        return {
            result,
            maxVal,
            avgArr,
        };
    };

    //雷达图
    FilterLessRatioRabarData = (data, summary, key) => {
        const keywords = ["deathRatio", "infectedRatio", "operationInfectedRatio", "backInRatio", "operationReturnRatio", "complicationRatio"];
        let dataItem = data.filter(i => i.organizationName === key);
        let result = _.concat(dataItem, summary).map(item => {
            let resultItem = keywords.map(i => {
                return item.summary[i]
            });
            return {
                "name": item.organizationName,
                "value": resultItem,
            }
        });
        let indicator = keywords.map(item => {
            let maxItem = _.maxBy(_.concat(dataItem, summary), function (o) {
                if (_.isNull(o.summary[item])) {
                    return 0
                } else {
                    return o.summary[item]
                }
            });
            return {
                "name": columnsChart[item],
                "max": maxItem.summary[item] * 1.5
            }
        });
        return {
            result,
            indicator,
        }
    };

    //导出Excell
    handleExport = (data, title) => {
        ExportExcell(
            [
                { column: columnTrend, dataSource: data, },
            ],
            `${title}临床路径统计数据一览`,
        );
    };

    //切换Tab时同时切换Card
    TabChangeCard = (key, responseData) => {
        let dataItem = _.filter(responseData, i => i.organizationName === key);
        if (!_.isEmpty(dataItem)) {
            this.props.ChangDataItem(dataItem[0]);
        }
    }

    render() {
        let { getType, avgTitle, avgvalue, eachDiseasesTitle, eachDiseasesValue, percentageTitle, percentageValue } = this.state;
        const { loading, data, dataItem, summarydata, institutions, activeKey, rabarInstitutionName } = this.props;

        let TabsData = [{ title: "初始机构", data: [], }]; //初始机构模板
        let eachDiseasesData = [],
            ratioPathwayData = [],
            avgFeeDayData = [],
            lineSummaryData = [],
            cureCntRatioBarLineData = [],
            ScatterData = [],
            ShanghaimapData = [],
            PercentageOfItemsData = [],
            LessRatioRabarData = [],
            InstitutionSelect = TabsData.map(i => i.title),
            AvgTotalMedicineFeeData = [];

        const responseData = _.concat(data, summarydata);
        if (!_.isEmpty(data) && !_.isEmpty(summarydata)) {
            TabsData = this.renderListData(responseData);
            eachDiseasesData = this.InitDiseasesOptionData(data, eachDiseasesValue);
            ratioPathwayData = this.FillterRatioPathwaySummary(responseData);
            avgFeeDayData = this.FilterAvgFeeDayData(data, summarydata, avgvalue);
            lineSummaryData = this.FilterPathSummary(data, summarydata);
            cureCntRatioBarLineData = this.FiltercureCntRatioBarLineData(data);
            ScatterData = this.renderScatterData(responseData);
            ShanghaimapData = this.FillterShanghaiMapData(responseData);
            PercentageOfItemsData = this.FillterPercentageOfItemsData(data, percentageValue);
            AvgTotalMedicineFeeData = this.FilterAvgTotalMedicineFeeData(data, summarydata);
            LessRatioRabarData = this.FilterLessRatioRabarData(data, summarydata, rabarInstitutionName);
            InstitutionSelect = data.map(i => i.organizationName);
        }
        return (
            <Fragment>
                <div className="card-form card-bottom">
                    <Form layout="inline" onFinish={this.SubmitSearch} ref={this.formref}>
                        <Form.Item label="机构名称" name="organizations" rules={[{ required: true, message: "请选择机构名称" }]} className="space-margin4 marginbottom-0" >
                            <TreeSelect
                                showSearch={false}
                                showArrow={true}
                                treeData={institutions}
                                style={{ width: 270 }}
                                multiple
                                maxTagTextLength={200}
                                allowClear
                                placeholder={`请选择同级别机构！`}
                                maxTagCount={1}
                                onChange={this.onSelectChange}
                            ></TreeSelect>
                        </Form.Item>
                        <Form.Item label="时间范围" className="space-margin4">
                            <div>
                                <Select style={{ width: 100, float: "left", marginRight: 10 }} defaultValue={getType} onChange={this.onChange}>
                                    {radioprops.map(i => <Select.Option value={i.value} key={i.value}>{i.label}</Select.Option>)}
                                </Select>
                                <Form.Item name="year" className="marginbottom-0" style={{ float: "right" }} rules={[{ required: true, message: "请选择时间范围" }]}>
                                    <RangePicker picker={getType} allowClear={false} disabledDate={this.disableDate} />
                                </Form.Item>
                            </div>
                        </Form.Item>
                        <Form.Item className="space-margin4">
                            <Space>
                                <Button type="primary" icon={<SearchOutlined />} htmlType="submit">查询</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
                <div className="content-card card-bottom">
                    <div>
                        <Tabs onChange={(key) => { this.TabChangeCard(key, responseData) }} activeKey={activeKey}>
                            {
                                TabsData.map((tabItem, index) => {
                                    return (
                                        <TabPane tab={tabItem.title} key={tabItem.title}>
                                            <Table
                                                key={index}
                                                loading={loading}
                                                title={() => (<div className="flex-space-between">
                                                    <span className="title-b">临床路径统计数据一览</span>
                                                    <Button disabled={_.isEmpty(tabItem.data)} icon={<ExportOutlined />} onClick={() => { this.handleExport(tabItem.data, tabItem.title) }}>导出Excel</Button>
                                                </div>)}
                                                // style={{ width: '100%' }}
                                                columns={columnTrend}
                                                dataSource={tabItem.data}
                                                pagination={false}
                                                scroll={{ x: "max-content" }}
                                            ></Table>
                                        </TabPane>
                                    )
                                })
                            }
                        </Tabs>
                    </div>
                </div>
                <div className="content-card card-bottom">
                    <div className="card-table-title">
                        <span className="title-b">{dataItem.organizationName}趋势对比</span>
                    </div>
                    <DataItemCard></DataItemCard>
                </div>
                <div className="content-card card-bottom">
                    <div className="card-table-title">
                        <span className="title-b">综合趋势对比图</span>
                    </div>
                    <Row gutter={[32, 32]}>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title={`${eachDiseasesTitle}对比`}
                                extra={
                                    <Select
                                        size="small"
                                        style={{ width: 250 }}
                                        defaultValue={eachDiseasesValue}
                                        onChange={(value, label) => { this.setState({ eachDiseasesTitle: label.children, eachDiseasesValue: value }) }}
                                    >
                                        {
                                            columnDiseases.filter(t => t.isRatio === false)
                                                .map(i => {
                                                    return <Option key={i.dataIndex} value={i.dataIndex}>{i.name}</Option>
                                                })
                                        }
                                    </Select>
                                }
                                ElemId="EachDiseasesBar"
                                options={EachDiseasesBar(eachDiseasesData)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title={`${avgTitle}对比`}
                                extra={
                                    <Select
                                        size="small"
                                        defaultValue={avgvalue}
                                        style={{ width: 250 }}
                                        onChange={(value, label) => { this.setState({ avgTitle: label.children, avgvalue: value }) }}
                                    >
                                        {
                                            columnDiseases.filter(t => t.isRatio)
                                                .map(i => {
                                                    return <Option key={i.key} value={i.key}>{i.name}</Option>
                                                })
                                        }
                                    </Select>
                                }
                                ElemId="AvgFeeDayLine"
                                options={AvgFeeDayLine(avgFeeDayData)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <div className="card-echarts">
                                <EchartsCard
                                    title="各机构治愈人数及治愈率情况"
                                    ElemId="TrendCureImproveDethCntBarLineTrend"
                                    options={TrendCureImproveDethCntBarLine(cureCntRatioBarLineData)}
                                ></EchartsCard>
                            </div>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title="各机构入组率、变异率、完成率对比情况"
                                ElemId="RatioPathwayBar"
                                options={RatioPathwayBar(ratioPathwayData)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24}>
                            <EchartsCard
                                title="全院出院人数/ 已开展临床路径的病种全院收治人数/ 全院进入路径人数"
                                ElemId="ContainerPeopleLineTrend"
                                options={ContainerPeopleLine(lineSummaryData)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title="各机构平均住院费用及均次药费"
                                ElemId="AvgTotalFeeAvgMedicineFeeBarTrend"
                                options={AvgTotalFeeAvgMedicineFeeBar(AvgTotalMedicineFeeData)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title="临床路径各项比例分布"
                                extra={
                                    <Select
                                        size="small"
                                        style={{ width: 200 }}
                                        value={rabarInstitutionName}
                                        onChange={(value, label) => { this.props.ChangeInstitutionName(value) }}
                                    >
                                        {
                                            InstitutionSelect.map(i => {
                                                return <Option key={i} value={i}>{i}</Option>
                                            })
                                        }
                                    </Select>
                                }
                                ElemId="LessRatioRabarTrend"
                                options={LessRatioRabar(LessRatioRabarData)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24}>
                            <EchartsCard
                                title="各机构全院临床路径好转人数及占比情况"
                                ElemId="PercentageOfItems"
                                options={PercentageOfItems(PercentageOfItemsData, percentageTitle)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title="各机构临床路径院内感染发生情况"
                                ElemId="ScatterBox"
                                options={ScatterBox(ScatterData)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title="上海市全院临床路径平均住院费用"
                                ElemId="ShangHaiProviceMap"
                                options={ShangHaiProviceMap(ShanghaimapData, shanghaiJson)}
                                height={500}
                                mapName="shanghai"
                                mapJson={shanghaiJson}
                            ></EchartsCard>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }
}
export default connect(
    state => ({
        loading: state.StatisticsTrend.loading,
        years: state.StatisticsTrend.years,
        institutions: state.StatisticsTrend.institutions,
        data: state.StatisticsTrend.data,
        summarydata: state.StatisticsTrend.summarydata,
        dataItem: state.StatisticsTrend.dataItem,
        activeKey: state.StatisticsTrend.activeKey,
        rabarInstitutionName: state.StatisticsTrend.rabarInstitutionName,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(TrendAnalysis);
