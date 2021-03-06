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
    scriptUrl: '//at.alicdn.com/t/font_2377783_udr1e6zq4z.js', // ε¨ iconfont.cn δΈηζ
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

    //ε¨η?εζ’
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

    //ε₯η»η
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

    //εΉ³εε€©ζ°εθ΄Ήη¨η³»ε
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

    //θΆεΏεζ
    onSelfTrend = () => {
        const { reqdata } = this.props;
        if(_.isEmpty(reqdata)) {
            message.warning("ζΆι΄θε΄δΈθ½δΈΊη©Ί")
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
                            _.includes(roles, "Hospital") ? null : <Form.Item name='id' label='ζΊζεη§°' rules={[{ required: true, message: 'θ―·ιζ©ζΊζεη§°' }]} className="space-margin4 marginbottom-0">
                                <TreeSelect treeData={institutions} style={{ width: 250 }} onSelect={this.onSelect}></TreeSelect>
                            </Form.Item>
                        }
                        <Form.Item name="time" label="ζΆι΄θε΄" rules={[{ required: true, message: "θ―·ιζ©ζΆι΄θε΄" }]} className="space-margin4 marginbottom-0">
                            <RangePicker picker="quarter" disabledDate={this.disableDate}></RangePicker>
                        </Form.Item>
                        <Form.Item className="space-margin4">
                            <Button htmlType='submit' icon={<SearchOutlined />} type='primary'>ζ₯θ―’</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="content-card">
                    <section className="paddingbottom-1rem">
                        <PathwayReportTable 
                            title="ε»ηζΊζδΈ΄εΊθ·―εΎη?‘ηζ΄δ½δΏ‘ζ―ε­£εΊ¦ζ₯ιθ‘¨"
                            tip={<Button type="text" icon={<MyIcon type='icon-qushi' />} onClick={this.onSelfTrend}>θΆεΏεζ</Button>}
                            exportName="ε»ηζΊζδΈ΄εΊθ·―εΎη?‘ηζ΄δ½δΏ‘ζ―ε­£εΊ¦ζ₯ιθ‘¨"
                            extra={
                                <Radio.Group
                                    className="space-margin4"
                                    value = { isSimple }
                                    onChange={ this.ChangeName }
                                    buttonStyle="solid"
                                >
                                    <Radio.Button style={{ borderRadius: "15px 0 0 15px" }} value={false}>ζΊζε¨η§°</Radio.Button>
                                    <Radio.Button style={{ borderRadius: "0 15px 15px 0" }} value={true}>ζΊζη?η§°</Radio.Button>
                                </Radio.Group>
                            }
                            loading={loading} 
                            data={data} 
                        />
                    </section>
                    <Row gutter={[32,32]}>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "ε¨ι’δΈ΄εΊθ·―εΎδΊΊζ°εεΈ"
                                ElemId = "SingleRenderNumberOfPeopleFunnelHosp"
                                options = { SingleRenderNumberOfPeopleFunnel(FunnelData) }
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "ε¨ι’δΈ΄εΊθ·―εΎδΈδΈε₯η»ηζε"
                                ElemId = "SingleRenderValueRatioLineBarHosp"
                                options = { SingleRenderValueRatioLineBar(RatioData) }
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "ε¨ι’δΈ΄εΊθ·―εΎδΈδΈεΊι’δΊΊζ°ζε"
                                ElemId = "SingleRenderPatCntLineHosp"
                                options = { SingleRenderPatCntLine(PatCntLineData) }
                            ></EchartsCard>
                        </Col>
                        <Col span={24} xl={12}>
                            <EchartsCard
                                title = "δΈ΄εΊθ·―εΎη?‘ηζ΄δ½δΏ‘ζ―ε­£εΊ¦ζ₯ιθ‘¨η»Όεεζ"
                                ElemId = "AvgFeeDayLineDataHosp"
                                options = { SingleRenderAvgFeeDayLine(AvgFeeDayLineData) }
                            ></EchartsCard>
                        </Col>
                    </Row>
                </div>
                <Modal
                    title={<Space><OrderedListOutlined /><span className="title-b">θΆεΏεζ</span></Space>}
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
