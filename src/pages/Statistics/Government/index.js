import React, { Component, Fragment } from 'react';
import { Select, Button, Form, Row, Col, Radio, DatePicker, Space, Table, message } from 'antd';
import _ from 'lodash';
import ReportTable from 'components/StaticReport/index';
import { columnDiseases, columnDate, columnSubCnt, columnPathCnt } from "assets/js/reportColumns";
import { connect } from "react-redux";
import  { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { SearchOutlined, createFromIconfontCN, OrderedListOutlined } from "@ant-design/icons";
import { EchartsCard } from "components/EchartsCard/index";
import { SingleRenderEachDiseaseBar, SingleCompletionRate } from "./echarts.options";
import { SingleRenderAvgFeeDayLine, SingleRenderNumberOfPeopleFunnel } from "../Hosp/echarts.options";
import { columnsChart } from "assets/js/reportColumns";
import moment from "moment";
import Modal from 'antd/lib/modal/Modal';

const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2377783_udr1e6zq4z.js', // 在 iconfont.cn 上生成
})
const { Option } = Select;
const { RangePicker } = DatePicker;
class Statistics_Government extends Component {
    formRef = React.createRef();
    state = {
        id: null,
        data: {},
        isSimple: false,
        barTitle: "已开展临床路径的病种全院收治人数",
        barvalue: "pathwayOfDiseasesCnt",
        visible: false,
    }

    componentDidMount() {
        const { roles } = this.props; 
        if(_.includes(roles, "Government")) {
            this.props.GetReportTimes();
        }else{
            this.props.GetInstitution();
        }
    }

    onChange = (key) => {
        this.props.GetReportTimes(key);
    }

    //不可选年份
    disableDate = current => {
        const { years } = this.props;
        let newyear = years.sort((a, b) => a - b);
        return current < moment(Number(_.head(newyear)), 'YYYY') || current > moment(Number(_.last(newyear)) + 1, 'YYYY')
    }

    onFinish = (values) => {
        const { isSimple } = this.state;
        let start = values.time[0].format('YYYY-Q').split("-");
        let end = values.time[1].format('YYYY-Q').split("-");
        let data = {
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

    //Funnel Data
    renderFunnelData = (data) => {
        const keywords = ["patCnt", "pathwayOfDiseasesCnt", "inPathwayCnt", "completionOfPathwayCnt" ];
        let result = keywords.map(i => {
            return { value: data[i], name: columnsChart[i] };
        })
        return result;
    }
    
    //Bar Data
    renderBarData = (data, keyword) => {
        
        let result = _.orderBy(data, 'keyword', ['desc']).map(i=>{
            return {
                name: i.hospName,
                value: i[keyword]
            }
        })
        return result;
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

    ChangeName = (e) => {
        const value = e.target.value;
        const { id, data } = this.state;
        this.setState({ isSimple: value })
        if (!_.isEmpty(data)) {
            this.props.GetPathwayReport(id, data, {"simplifiedName": value});
        }
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
        let { barvalue, barTitle, isSimple, visible } = this.state;
        const { roles, institutions, loading, data, selfTrendLoading, selfTrendData } = this.props;

        const detailsCol = _.concat(columnDate, columnSubCnt, columnPathCnt, columnDiseases);
        let funnelData = [];
        let barData = [];
        let LineData = [];
        let CompleteData = [];
        if(!_.isEmpty(data.summary)) {
            funnelData = this.renderFunnelData(data.summary);
        }
        if(!_.isEmpty(data)) {
            const source = _.flattenDeep(data.infos.map(i => {
                return (i.children || [])
            }));
            barData = this.renderBarData(source, barvalue);
            LineData = this.renderLineData(source);
            CompleteData = this.renderCompleteData(source);
        };

        return (
            <Fragment>
                <div className="card-form card-bottom">
                    <Form ref={ this.formRef} onFinish={ this.onFinish} layout="inline">
                        {
                            _.includes(roles,"Government") ? null : <Form.Item name='id' label='机构名称' rules={[{ required: true, message: '请选择机构名称' }]} className="space-margin4 marginbottom-0">
                                <Select
                                    style={{width:200}}
                                    onChange={ this.onChange }
                                >
                                    {
                                        institutions.map((item,index)=>{
                                            return <Option value={item.id} key={index}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                        <Form.Item name="time" label="时间范围" rules={[{ required: true, message: "请选择时间范围" }]} className="space-margin4 marginbottom-0">
                            <RangePicker picker="quarter" disabledDate={this.disableDate}></RangePicker>
                        </Form.Item>
                        <Form.Item className="space-margin">
                            <Button htmlType='submit'icon={<SearchOutlined />} type='primary'>查询</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="content-card">
                    <div className="paddingbottom-1rem">
                        <ReportTable 
                            title="上级主管部门临床路径管理信息季度报送表"
                            tip={<Button type="text" icon={<MyIcon type='icon-qushi' />} onClick={this.onSelfTrend}>趋势分析</Button>}
                            exportName="上级主管部门临床路径管理信息季度报送表"
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
                            data={ data } 
                            loading={loading } 
                            showFooter={ true }
                        />
                    </div>
                    <Row gutter={[32, 32]}>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "临床路径人数分布"
                                ElemId = "RenderFunnelGovern"
                                options = { SingleRenderNumberOfPeopleFunnel(funnelData) }
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "入组后全院完成率排名"
                                ElemId = "SingleCompletionRateGovern"
                                options = { SingleCompletionRate(CompleteData) }
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = {`机构${ barTitle }对比`}
                                extra={
                                    <Select
                                        size="small"
                                        defaultValue = { barvalue }
                                        style={{ width: 160 }}
                                        onChange={ (value,label) => { this.setState({ barTitle: label.children, barvalue: value }) } }
                                    >
                                        {
                                            _.concat(columnDiseases).filter(t => !t.isRatio)
                                            .map((i, index)=> {
                                                return <Option value={ i.dataIndex } key={index}>{ i.name }</Option>
                                            })
                                        }
                                    </Select>
                                }
                                ElemId = "SingleRenderEachDiseaseBarGovern"
                                options = { SingleRenderEachDiseaseBar(barData) }
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "临床路径管理信息季度报送表综合分析"
                                ElemId = "SingleRenderAvgFeeDayLineGovern"
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
        data: state.StatisticsGovern.data,
        years: state.StatisticsGovern.years,
        loading: state.StatisticsGovern.loading,
        institutions: state.StatisticsGovern.institutions,
        selfTrendData: state.StatisticsGovern.selfTrendData,
        selfTrendLoading: state.StatisticsGovern.selfTrendLoading,
        reqdata: state.StatisticsGovern.reqdata,
        roles: state.Login.Auth.roles,
    }),
    dispatch => bindActionCreators({...actions}, dispatch)
)(Statistics_Government);

