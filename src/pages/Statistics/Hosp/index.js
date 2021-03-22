import React, { Fragment, Component } from 'react';
import { Button, Form, Card, TreeSelect, Radio, Row, Col, DatePicker, Modal, Space, Table, message } from 'antd';
import _ from 'lodash';
import PathwayReportTable from 'components/StaticPathwayReport/index';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { SearchOutlined, OrderedListOutlined, createFromIconfontCN } from "@ant-design/icons";
import { EchartsCard } from "components/EchartsCard/index";
import { SingleRenderAvgFeeDayLine, SingleRenderNumberOfPeopleFunnel, SingleRenderPatCntLine, SingleRenderValueRatioLineBar } from "./echarts.options";
import { columnsChart, columnDate, columnSubCnt, columnPathCnt, columnDiseases } from "assets/js/reportColumns";
import moment from "moment";
const { RangePicker } = DatePicker;

const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2377783_udr1e6zq4z.js', // 在 iconfont.cn 上生成
})
class Statistics_Hosp extends Component {
    formRef = React.createRef();
    state = {
        data: {},
        id: null,
        isSimple: false,
        visible: false,
    }
    componentDidMount() {
        const { roles } = this.props;
        if (_.includes(roles, "Hospital")) {
            this.props.GetReportTimes();
        } else {
            this.props.GetInstitution();
        };
    }

    onSelect = (value, node, extra) => {
        this.props.GetReportTimes(value);
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
        if(values.id){
            data['organizations'] = [
                values.id,
            ]
        };

        this.props.GetPathwayReport(
            values.id,
            data,
            { "simplifiedName": isSimple },
        )
        this.setState({ id: values.id, data });
    }

    //全简切换
    ChangeName = (e) => {
        const value = e.target.value;
        const { id, data } = this.state;
        this.setState({ isSimple: value })
        if (!_.isEmpty(data)) {
            this.props.GetPathwayReport(id, data, {"simplifiedName": value});
        }
    }

    //Funnel Data
    FilterFunnelData = (data) => {
        const keywords = ["patCnt", "pathwayOfDiseasesCnt", "inPathwayCnt", "completionOfPathwayCnt"];
        let result = keywords.map(i => {
            return { value: data[i], name: columnsChart[i] };
        })
        return result;
    }

    //入组率
    FilterPeopleRatioBarLineData = (data) => {
        const keywords = ["inPathwayCnt", "inPathwayRatio"];
        let result = _.orderBy(data, 'inPathwayCnt', ['desc']).map(item => {
            let obj = { "name": item.specializedSubjectName };
            keywords.forEach(i => {
                obj[columnsChart[i]] = item[i];
            });
            return obj;
        });
        return result;
    }

    //平均天数及费用系列
    FilterAvgFeeDayLineData = (data) => {
        const keywords = ["totalFee", "inPeriod"];
        let result = _.orderBy(data, 'totalFee', ['desc']).map((item, index) => {
            let obj = { "name": item.specializedSubjectName };
            keywords.forEach(i => {
                obj[columnsChart[i]] = item[i];
            });
            return obj;
        });
        return result;
    }

    FilterPatCntLineData = (data) => {
        const keywords = ['patCnt'];
        let result = _.orderBy(data, 'patCnt', ['desc']).map((item, index) => {
            let obj = { "name": item.specializedSubjectName };
            keywords.forEach(i => {
                obj[columnsChart[i]] = item[i];
            });
            return obj;
        });
        return result;
    }

    disableDate = current => {
        const { years } = this.props;
        let newyear = years.sort((a, b) => a - b);
        return current < moment(Number(_.head(newyear)), 'YYYY') || current > moment(Number(_.last(newyear)) + 1, 'YYYY')
    };

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
        const { isSimple, visible } = this.state;
        const { roles, institutions, loading, data, selfTrendLoading, selfTrendData } = this.props;

        const detailsCol = _.concat(columnDate, columnSubCnt, columnPathCnt, columnDiseases);
        let FunnelData = [];
        let RatioData = [];
        let AvgFeeDayLineData = [];
        let PatCntLineData = [];
        if (!_.isEmpty(data.infos)) {
            RatioData = this.FilterPeopleRatioBarLineData(data.infos);
            AvgFeeDayLineData = this.FilterAvgFeeDayLineData(data.infos);
            PatCntLineData = this.FilterPatCntLineData(data.infos);
        };
        if(!_.isEmpty(data.summary)){
            FunnelData = this.FilterFunnelData(data.summary);
        }
        return (
            <Fragment>
                <div className="card-form card-bottom">
                    <Form ref={this.formRef} onFinish={this.onFinish} layout="inline" >
                        {
                            _.includes(roles, "Hospital") ? null : <Form.Item name='id' label='机构名称' rules={[{ required: true, message: '请选择机构名称' }]} className="space-margin4 marginbottom-0">
                                <TreeSelect treeData={institutions} style={{ width: 250 }} onSelect={this.onSelect}></TreeSelect>
                            </Form.Item>
                        }
                        <Form.Item name="time" label="时间范围" rules={[{ required: true, message: "请选择时间范围" }]} className="space-margin4 marginbottom-0">
                            <RangePicker picker="quarter" disabledDate={this.disableDate}></RangePicker>
                        </Form.Item>
                        <Form.Item className="space-margin4">
                            <Button htmlType='submit' icon={<SearchOutlined />} type='primary'>查询</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="content-card">
                    <section className="paddingbottom-1rem">
                        <PathwayReportTable 
                            title="医疗机构临床路径管理整体信息季度报送表"
                            tip={<Button type="text" icon={<MyIcon type='icon-qushi' />} onClick={this.onSelfTrend}>趋势分析</Button>}
                            exportName="医疗机构临床路径管理整体信息季度报送表"
                            extra={
                                <Radio.Group
                                    className="space-margin4"
                                    value = { isSimple }
                                    onChange={ this.ChangeName }
                                    buttonStyle="solid"
                                >
                                    <Radio.Button style={{ borderRadius: "15px 0 0 15px" }} value={false}>机构全称</Radio.Button>
                                    <Radio.Button style={{ borderRadius: "0 15px 15px 0" }} value={true}>机构简称</Radio.Button>
                                </Radio.Group>
                            }
                            loading={loading} 
                            data={data} 
                        />
                    </section>
                    <Row gutter={[32,32]}>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "全院临床路径人数分布"
                                ElemId = "SingleRenderNumberOfPeopleFunnelHosp"
                                options = { SingleRenderNumberOfPeopleFunnel(FunnelData) }
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "全院临床路径专业入组率排名"
                                ElemId = "SingleRenderValueRatioLineBarHosp"
                                options = { SingleRenderValueRatioLineBar(RatioData) }
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "全院临床路径专业出院人数排名"
                                ElemId = "SingleRenderPatCntLineHosp"
                                options = { SingleRenderPatCntLine(PatCntLineData) }
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "临床路径管理整体信息季度报送表综合分析"
                                ElemId = "AvgFeeDayLineDataHosp"
                                options = { SingleRenderAvgFeeDayLine(AvgFeeDayLineData) }
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
        institutions: state.StatisticsHosp.institutions,
        years: state.StatisticsHosp.years,
        data: state.StatisticsHosp.data,
        loading: state.StatisticsHosp.loading,
        selfTrendData: state.StatisticsHosp.selfTrendData,
        selfTrendLoading: state.StatisticsHosp.selfTrendLoading,
        reqdata: state.StatisticsHosp.reqdata,
        roles: state.Login.Auth.roles,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(Statistics_Hosp);
