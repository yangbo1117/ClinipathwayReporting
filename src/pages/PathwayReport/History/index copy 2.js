import React, { Component, Fragment } from 'react';
import { Form, Select, Button, Radio, Timeline, Row, Col, Card, Tooltip, Typography, Anchor  } from "antd";
import { connect } from 'react-redux';
import _ from "lodash";
import { bindActionCreators } from 'redux';
import * as actions from "./index.action";
import { ClockCircleOutlined, FileTextTwoTone } from "@ant-design/icons";

const { Option } = Select;
const { Link } = Anchor;
const { Text } = Typography;
//查看历史版本
class HistoryPage extends Component {


    state = {
        url: "",
        pagination: {
            current: 1,
            pageSize: 10,
        },
        isSimple: false, //全简
        id: null,
    }

    componentDidMount() {
        const { roles } = this.props;
        if (_.includes(roles, "Government")) {
            const geturl = "/api/pathwayreport/history/";
            this.setState({
                url: geturl,
            });
        }
        if (_.includes(roles, "Association")) {
            const geturl = "/api/pathwaygovernreport/history/";
            this.setState({
                url: geturl,
            });
        }
        this.props.GetInstitutionChildren();
    }

    //查询
    onFinish = (values) => {
        const { isSimple, url } = this.state;
        this.setState({
            id: values.id,
        });
        this.props.GetPathwayReport(url, {
            "id": values.id,
            "simplifiedName": isSimple,
        });
    }

    //名称切换
    ChangeName = (e) => {
        const { url, id } = this.state;
        const value = e.target.value;
        this.setState({ isSimple: value });
        if (!_.isEmpty(id)) {
            this.props.GetPathwayReport(url, {
                "id": id,
                "simplifiedName": value,
            });
        }
    }

    render() {
        let { isSimple } = this.state;
        const { institutions, loading, data, total, roles } = this.props;
        console.log(data)
        const options = [
            { label: '机构全称', value: false },
            { label: "机构简称", value: true },
        ];
        const colors = [
            "#f50",
            "#2db7f5",
            "#87d068",
            "#108ee9",
            "#f50",
            "#2db7f5",
            "#87d068",
            "#108ee9",
            "#f50",
            "#2db7f5",
            "#87d068",
            "#108ee9",
        ]
        return (
            <div>
                <Row>
                    <Col sm={{ span: 24, offset: 0 }} xs={{ span: 24, offset: 0 }} xl={{ span: 18, offset: 3 }}>
                        <div className='content-card'>
                            <div className="card-table-title">
                                <Radio.Group
                                    defaultValue={isSimple}
                                    className="space-margin4"
                                    options={options}
                                    onChange={this.ChangeName}
                                    optionType="button"
                                    buttonStyle="solid"
                                />
                                <Form onFinish={this.onFinish} layout="inline" >
                                    {
                                        _.includes(roles, "Hospital") ? null : <Fragment>
                                            <Form.Item label="机构名称" name='id' rules={[{ required: true }]} className="space-margin4">
                                                <Select
                                                    placeholder={`请选择机构`}
                                                    style={{ width: 200 }}
                                                >
                                                    {
                                                        institutions.map(item => {
                                                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Fragment>
                                    }
                                    <Form.Item className="space-margin4">
                                        <Button type='primary' htmlType='submit'>查询</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            {
                                false ? <Row>
                                    <Col sm={{ span: 24, offset: 0 }} xs={{ span: 24, offset: 0 }} lg={{ span: 18, offset: 3 }}>
                                        <div style={{ paddingTop: "50px", minHeight: "30vh" }}>
                                            <Timeline mode="right">
                                                {
                                                    data.map((item, index) => (
                                                        <Timeline.Item color={colors[index]} key={index} >
                                                            <Row>
                                                                <Col span={18}>
                                                                    <Card style={{ textAlign: "left" }} title={item.hospName} extra={<Tooltip title="查看详细报表" color="blue"><FileTextTwoTone className="span-cursor" /></Tooltip>}>
                                                                        <p>{item.year}年{item.quarter}季度报表</p>
                                                                        <p>批注信息： {item.comment}</p>
                                                                    </Card>
                                                                </Col>
                                                                <Col span={6}>
                                                                    <Text code>{item.lastModificationTime.split("T")[0]}</Text>
                                                                </Col>
                                                            </Row>
                                                        </Timeline.Item>
                                                    ))
                                                }
                                            </Timeline>
                                        </div>
                                    </Col>
                                </Row> : null
                            }
                            <div>
                                Anchor 
                                
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(
    state => ({
        data: state.PathwayReportHistory.data,
        loading: state.PathwayReportHistory.loading,
        total: state.PathwayReportHistory.total,
        columnrules: state.PathwayReportHistory.columnrules,
        institutions: state.PathwayReportHistory.institutions,
        roles: state.Login.Auth.roles,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(HistoryPage);