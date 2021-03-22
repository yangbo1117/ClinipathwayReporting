import React, { Component, Fragment } from 'react';
import { Form, Button, DatePicker, Radio, Col, Row, Select, Tabs, Space, Modal, Table, message } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./index.action";
import _ from "lodash";
import { SearchOutlined } from "@ant-design/icons";
import { EchartsCard } from "components/EchartsCard/index";
import { columnDate, columnSubCnt, columnPathCnt, columnDiseases, columnsChart } from "assets/js/reportColumns";
import moment from "moment";
import styles from "./index.module.scss";
import { BarChartOutlined, TableOutlined, createFromIconfontCN, OrderedListOutlined } from "@ant-design/icons";
import ReportTable from 'components/StaticReport/index';
import { SingleRenderAvgFeeDayLine } from "../Hosp/echarts.options";
import { SingleCompletionRate } from "../Government/echarts.options";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2377783_udr1e6zq4z.js', // 在 iconfont.cn 上生成
})

class Statistics_Assoc extends Component {
    state = {
        id: null,
        data: {},
        isSimple: false,
        barTitle: "已开展临床路径的病种全院收治人数",
        barvalue: "pathwayOfDiseasesCnt",
        visible: false,

    }
    componentDidMount() {
        this.props.GetTimes();
    }

    onFinish = (values) => {
        const { isSimple } = this.state;
        let start = values.time[0].format('YYYY-Q').split("-");
        let end = values.time[1].format('YYYY-Q').split("-");
        const data = {
            "start": {
                "year": start[0],
                "quarter": start[1]
            },
            "end": {
                "year": end[0],
                "quarter": end[1]
            },
        };
        this.props.GetPathwayReport(
            values.id,
            data,
            { "simplifiedName": isSimple },
        )
        this.setState({ id: values.id, data, });
    }

    ChangeName = (e) => {
        const value = e.target.value;
        const { id, data } = this.state;
        this.setState({ isSimple: value })
        if (!_.isEmpty(data)) {
            this.props.GetPathwayReport(id, data, { "simplifiedName": value });
        }
    }

    //不可选年份
    disableDate = current => {
        const { years } = this.props;
        let newyear = years.sort((a, b) => a - b);
        return current < moment(Number(_.head(newyear)), 'YYYY') || current > moment(Number(_.last(newyear)) + 1, 'YYYY')
    }

    // Line Data
    renderLineData = (data) => {
        const keywords = ["totalFee","inPeriod"];
        let result = _.orderBy(data, 'totalFee', ['desc']).map((item,index) => {
            let obj = { "name": item.hospName };
            keywords.forEach(i => {
                obj[columnsChart[i]] = item[i];
            });
            return obj;
        });
        return result;
    };

    //completeratio
    renderCompleteData = (data) => {
        let result = _.orderBy(data, 'completionOfPathwayRatio', ['desc']).map(i => {
            return {
                name: i.hospName,
                max: 100,
                value: (i['completionOfPathwayRatio'] * 1).toFixed(2),
            };
        });
        return result;
    }
    
    //tab CHANGE
    onTabsChange = (key) => {
        const { total, center, others } = this.props;
        const obj = {
            "center": center,
            "others": others,
            "total": total,
        }
        this.props.changeSource(obj[key])
    }

    //趋势分析
    onSelfTrend = () => {
        const { reqdata } = this.props;
        if(_.isEmpty(reqdata)) {
            message.warning("时间范围不能为空")
        }else {
            this.setState({visible: true})
            this.props.GetSelfTrendData(reqdata);
        }
    }

    render() {
        let { barvalue, barTitle, isSimple, visible } = this.state;
        const { loading, total, center, others, source, selfTrendData, selfTrendLoading } = this.props;

        const detailsCol = _.concat(columnDate, columnSubCnt, columnPathCnt, columnDiseases);
        const node = [
            {
                title: "精神卫生中心",
                icon: <TableOutlined />,
                data: center,
                key: 'center',
            },
            {
                title: "其他机构",
                icon: <TableOutlined />,
                data: others,
                key: "others"
            },
            {
                title: '机构合计（精神卫生中心+其他机构）',
                icon: <BarChartOutlined />,
                data: total,
                key: 'total',
            },
        ];
        let LineData = [];
        let CompleteData = [];
        if(!_.isEmpty(source.infos)) {
            const node = _.flattenDeep(source.infos.map(i => {
                return (i.children || [])
            }));
            LineData = this.renderLineData(node);
            CompleteData = this.renderCompleteData(node);
        }

        return (
            <Fragment>
                <div className="card-form card-bottom">
                    <Form onFinish={this.onFinish} layout="inline">
                        <Form.Item name="time" label="时间范围" rules={[{ required: true, message: "请选择时间范围" }]} className="space-margin4 marginbottom-0">
                            <RangePicker picker="quarter" disabledDate={this.disableDate}></RangePicker>
                        </Form.Item>
                        <Form.Item className="space-margin">
                            <Button htmlType='submit' icon={<SearchOutlined />} type='primary'>查询</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="content-card">
                    <Tabs
                        defaultActiveKey="0"
                        size="default"
                        onChange={this.onTabsChange}
                        tabBarExtraContent={{
                            "right": <Fragment>
                                <Space>
                                    <Button type="text" icon={<MyIcon type='icon-qushi' />} onClick={this.onSelfTrend}>趋势分析</Button>
                                    <Radio.Group
                                        className="space-margin4"
                                        value={isSimple}
                                        onChange={this.ChangeName}
                                        buttonStyle="solid"
                                    >
                                        <Radio.Button style={{ borderRadius: "15px 0 0 15px" }} value={false}>机构全称</Radio.Button>
                                        <Radio.Button style={{ borderRadius: "0 15px 15px 0" }} value={true}>机构简称</Radio.Button>
                                    </Radio.Group>
                                </Space>
                            </Fragment>
                        }}
                    >
                        {
                            node.map((i, index) => (
                                <TabPane
                                    tab={
                                        <span >
                                            {i.icon}
                                            {i.title}
                                        </span>
                                    }
                                    key={i.key}
                                >
                                    <ReportTable 
                                        title="上级主管部门临床路径管理信息季度报送表"
                                        exportName="上级主管部门临床路径管理信息季度报送表"
                                        data={i.data} 
                                        loading={loading} 
                                        showFooter={ true }
                                    />
                                </TabPane>
                            ))
                        }
                    </Tabs>
                </div>
                <div className="content-card" style={{marginTop: "1rem"}}>
                    <Row gutter={[24,24]}>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "入组后全院完成率排名"
                                ElemId = "SingleCompletionRateGovern"
                                options = { SingleCompletionRate(CompleteData) }
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "临床路径管理信息季度报送表综合分析"
                                ElemId = "SingleRenderAvgFeeDayLineAssoc"
                                options = { SingleRenderAvgFeeDayLine(LineData) }
                            ></EchartsCard>
                        </Col>
                    </Row> 
                </div>
                <Modal
                    title={<Space><OrderedListOutlined /><span className="title-b">趋势分析</span></Space>}
                    width={800}
                    visible={visible}
                    getContainer={false}
                    onCancel={() => { this.setState({visible: false}) }}
                    footer={null}
                >
                    <Table
                        columns={detailsCol}
                        dataSource={selfTrendData}
                        loading={selfTrendLoading}
                        scroll={{ x: "max-content" }}
                        pagination={{ size: "small" }}
                    />
                </Modal>
            </Fragment>
        )
    }
}

export default connect(
    state => ({
        loading: state.StatisticsAssoc.loading,
        years: state.StatisticsAssoc.years,
        total: state.StatisticsAssoc.total,
        others: state.StatisticsAssoc.others,
        center: state.StatisticsAssoc.center,
        source: state.StatisticsAssoc.source,
        selfTrendLoading: state.StatisticsAssoc.selfTrendLoading,
        selfTrendData: state.StatisticsAssoc.selfTrendData,
        reqdata: state.StatisticsAssoc.reqdata,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(Statistics_Assoc);