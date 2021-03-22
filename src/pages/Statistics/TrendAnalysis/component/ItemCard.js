import React, { Fragment, Component } from "react";
import { Row, Col, Select } from "antd";
import { columnDiseases, columnsChart } from "assets/js/reportColumns";
import {
    EachDiseasesBar,
    RatioPathwayBar,
    ContainerPeopleLine,
    AvgFeeDayLine,
    SankeyLine,
    SingleRenderPeopleRatioBarLine,
    TrendCureImproveDethCntBarLine,
    AvgTotalFeeAvgMedicineFeeBar,
    LessRatioRabar,
} from "components/EchartsCard/echarts.options";
import { EchartsCard } from "components/EchartsCard/index";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../index.action";

const { Option } = Select;
function shakeTree(json) {
    var result = [];
    function fillterTree(data, arr) {
        data.forEach(i => {
            arr.push({ "name": i.name });
            if (i.children) {
                fillterTree(i.children, arr);
            }
        })
    }
    fillterTree(json, result);
    return result;

}

function shakeTreeLink(json, node) {
    var result = [];
    function concatRes(parent, children, node, arr) {
        children.forEach(i => {
            // {"source":"Andriod1","target":"Andriod2","value":"65"},
            arr.push({
                'source': parent.name,
                "target": i.name,
                "value": node[i.key]
            })
        })
    }
    function fillterTreeLine(data, node, arr) {
        data.forEach(i => {
            if (i.children) {
                concatRes(i, i.children, node, arr);
                fillterTreeLine(i.children, node, arr);
            }
        })
    }
    fillterTreeLine(json, node, result);
    return result;
}



class ItemCardPage extends Component {
    state = {
        //each
        eachDiseasesTitle: "已开展临床路径的病种全院收治人数",
        eachDiseasesValue: "pathwayOfDiseasesCnt",

        //Ratio
        avgTitle: "全院入组率",
        avgvalue: "inPathwayRatio",
    }

    //按年份汇总
    InitDiseasesOptionData = (data, value, key) => {
        if (_.isEmpty(data.details)) {
            return []
        }
        return data.details.map(i => {
            return {
                "name": i.formatDate,
                [key]: i[value],
            }
        });
    }

    //按年份划分的比例
    FilterDiseaseRatioData = (data, value, key) => {
        if (_.isEmpty(data.details)) {
            return {}
        } else {
            let result = data.details.map(i => {
                return {
                    "name": i.formatDate,
                    [key]: i[value],
                }
            });
            let avgVal = data.summary[value] || 0;
            let maxVal = _.maxBy(data.details, function (o) { return o[value] });
            let minVal = _.minBy(data.details, function (o) { return o[value] });
            return {
                result,
                avgVal,
                "maxVal": Math.ceil(maxVal[value] / 10) * 10,
                "minVal": Math.floor(minVal[value] / 10) * 10,
            }
        }
    }

    //入组/完成/变异 率
    FillterRatioPathwaySummary = (data) => {
        const keywords = ["inPathwayRatio", "completionOfPathwayRatio", "negativeVariantRatio"];
        let result = data.details.map(i => {
            let obj = { "name": i.formatDate };
            keywords.forEach(item => {
                obj[columnsChart[item]] = i[item]
            })
            return obj;
        });
        return result;
    }

    //全院出院人数/ 已开展临床路径的病种全院收治人数/ 全院进入路径人数
    FilterPathSummary = (data) => {
        const keywords = ["inPathwayCnt", "pathwayOfDiseasesCnt", "patCnt"]
        let result = data.details.map((i, index) => {
            let obj = { "name": i.formatDate };
            keywords.forEach(item => {
                obj[columnsChart[item]] = i[item]
            })
            return obj;
        });
        return result;
    };
    //桑基图
    FillterSankeyLineSumay = (data) => {
        let treenode = [
            {
                name: "全院出院人数",
                key: "patCnt",
                children: [
                    {
                        name: "未开展临床路径的病种全院收治人数",
                        key: "un_pathwayOfDiseasesCnt"
                    },
                    {
                        name: "已开展临床路径的病种全院收治人数",
                        key: "pathwayOfDiseasesCnt",
                        children: [
                            {
                                name: "全院进入路径人数",
                                key: 'inPathwayCnt',
                                children: [
                                    {
                                        name: "全院临床路径变异人数",
                                        key: 'negativeVariantCnt',
                                    },
                                    {
                                        name: "全院完成路径人数",
                                        key: "completionOfPathwayCnt",
                                        children: [
                                            {
                                                name: "全院临床路径治愈人数",
                                                key: "cureCnt",
                                            },
                                            {
                                                name: "全院临床路径好转人数",
                                                key: "improveCnt",
                                            },
                                            {
                                                name: "全院临床路径死亡人数",
                                                key: "deathCnt",
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                ]
            }
        ]
        let nodes = shakeTree(treenode)
        let unVal = data.summary["patCnt"] - data.summary["pathwayOfDiseasesCnt"];
        let links = shakeTreeLink(treenode, { ...data.summary, "un_pathwayOfDiseasesCnt": unVal });
        return { nodes, links }
    }

    //临床路径手术部位感染和非计划重返手术室人数比例变化
    FilterPeopleRatioBarLineData = (data) => {
        const keywords = ["operationInfectedCnt", "operationInfectedRatio", "operationReturnCnt", "operationReturnRatio"];
        let result = data.details.map(item => {
            let obj = { "name": item.formatDate };
            keywords.forEach(i => {
                obj[columnsChart[i]] = item[i];
            });
            return obj;
        });
        return result;
    }

    //治愈率
    FiltercureCntRatioBarLineData = (data) => {
        const keywords = ["cureCnt", "completionOfPathwayCnt", "cureRatio"];
        let result = data.details.map(item => {
            let obj = { "name": item.formatDate };
            keywords.forEach(i => {
                obj[columnsChart[i]] = item[i]
            });
            return obj;
        });
        return result;
    }

    //平均费用及药费
    FilterAvgTotalMedicineFeeData = (data) => {
        if (_.isEmpty(data.details)) {
            return {}
        }
        const keywords = ["totalFee", "avgMedicineFee"];
        let result = data.details.map(item => {
            let obj = { "name": item.formatDate };
            keywords.forEach(i => {
                obj[columnsChart[i]] = item[i]
            });
            return obj;
        });
        let maxVal = _.max(keywords.map(i => {
            let maxItem = _.maxBy(result, function (o) { return o[columnsChart[i]] });
            return maxItem[columnsChart[i]];
        }));
        let avgArr = keywords.map(i => {
            return (data.summary[i] || 0)
        });
        return {
            result,
            maxVal,
            avgArr,
        };
    };

    //雷达图
    FilterLessRatioRabarData = (data, key = "2019年") => {
        const keywords = ["deathRatio", "infectedRatio", "operationInfectedRatio", "backInRatio", "operationReturnRatio", "complicationRatio"];
        let dataItem = data.details.filter(i => i.formatDate === key);
        let result = _.concat(
            dataItem.map(item => {
                let resultItem = keywords.map(i => {
                    return item[i]
                });
                return {
                    "name": item.formatDate,
                    "value": resultItem,
                }
            }),
            {
                "name": "统计",
                "value": keywords.map(i => {
                    return data.summary[i]
                }),
            },
        );
        let indicator = keywords.map(item => {
            let maxItem = _.maxBy(_.concat(dataItem, data.summary), function (o) {
                if (_.isNull(o[item])) {
                    return 0;
                } else {
                    return o[item]
                }
            });
            return {
                "name": columnsChart[item],
                "max": maxItem[item] * 1.5
            }
        });
        return {
            result,
            indicator,
        }
    };

    render() {
        const { eachDiseasesTitle, eachDiseasesValue, avgTitle, avgvalue } = this.state;
        const { data, rabarInstitutionNameItem } = this.props;
        let
            dataA = [],
            dataC = [],
            dataD = [],
            dataE = [],
            dataG = [],
            formatDateSelect = [],
            PeopleRatioBarLineData = [],
            cureCntRatioBarLineData = [],
            AvgTotalMedicineFeeData = [],
            LessRatioRabarData = [];
        if (!_.isEmpty(data)) {
            formatDateSelect = data.details.map(i => i.formatDate);
            dataA = this.InitDiseasesOptionData(data, eachDiseasesValue, eachDiseasesTitle);
            dataC = this.FilterDiseaseRatioData(data, avgvalue, avgTitle);
            dataD = this.FillterRatioPathwaySummary(data);
            dataE = this.FilterPathSummary(data);
            dataG = this.FillterSankeyLineSumay(data);
            PeopleRatioBarLineData = this.FilterPeopleRatioBarLineData(data);
            cureCntRatioBarLineData = this.FiltercureCntRatioBarLineData(data);
            AvgTotalMedicineFeeData = this.FilterAvgTotalMedicineFeeData(data);
            LessRatioRabarData = this.FilterLessRatioRabarData(data, rabarInstitutionNameItem);
        };
        console.log(cureCntRatioBarLineData)
        return (
            <Fragment>
                <div>
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
                                            columnDiseases.filter(t => !t.isRatio)
                                                .map(i => {
                                                    return <Option key={i.dataIndex} value={i.dataIndex}>{i.name}</Option>
                                                })
                                        }
                                    </Select>
                                }
                                ElemId="EachDiseasesBarItem"
                                options={EachDiseasesBar(dataA)}
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
                                ElemId="AvgFeeDayLineItem"
                                options={AvgFeeDayLine(dataC)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title="全院临床路径治愈人数及治愈率情况"
                                ElemId="TrendCureImproveDethCntItem"
                                options={TrendCureImproveDethCntBarLine(cureCntRatioBarLineData)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title="各个时间范围内入组率、变异率、完成率对比情况"
                                ElemId="RatioPathwayBarItem"
                                options={RatioPathwayBar(dataD)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title="各时间阶段平均住院费用及均次药费"
                                ElemId="AvgTotalFeeAvgMedicineFeeBarItem"
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
                                        value={rabarInstitutionNameItem}
                                        onChange={(value, label) => { this.props.ChangeInstitutionNameItem(value) }}
                                    >
                                        {
                                            formatDateSelect.map(i => {
                                                return <Option key={i} value={i}>{i}</Option>
                                            })
                                        }
                                    </Select>
                                }
                                ElemId="LessRatioRabarItem"
                                options={LessRatioRabar(LessRatioRabarData)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24}>
                            <EchartsCard
                                title="全院出院人数/ 已开展临床路径的病种全院收治人数/ 全院进入路径人数"
                                ElemId="ContainerPeopleLineItem"
                                options={ContainerPeopleLine(dataE)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24}>
                            <EchartsCard
                                title="临床路径人次分布"
                                ElemId="SankeyLineItem"
                                options={SankeyLine(dataG)}
                            ></EchartsCard>
                        </Col>
                        <Col span={24}>
                            <EchartsCard
                                title="临床路径手术部位感染和非计划重返手术室人数比例变化"
                                ElemId="SingleRenderPeopleRatioBarLineItem"
                                options={SingleRenderPeopleRatioBarLine(PeopleRatioBarLineData)}
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
        data: state.StatisticsTrend.dataItem,
        rabarInstitutionNameItem: state.StatisticsTrend.rabarInstitutionNameItem,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(ItemCardPage);