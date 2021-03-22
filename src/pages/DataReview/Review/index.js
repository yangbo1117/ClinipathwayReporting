import React, { Component } from 'react';
import { Row, Col, Typography, Space, Button, Drawer, List, Avatar, Radio, Badge } from 'antd';
import { ForkOutlined, FileTextOutlined } from '@ant-design/icons';
import ReportTable from "components/ReportTable/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./index.action";
import _ from "lodash";

const { Text } = Typography;
class ReviewPage extends Component {
    state = {
        taskId: "",
        simpleName: false, //简称
        visible: false, //显示抽屉
    }
    componentDidMount() {
        const id = this.props.location.search.split('=')[1];
        const { simpleName } = this.state;
        this.setState({ taskId: id })
        this.props.GetGovernPathwayReport({
            "statusId": id,
            "simplifiedName": simpleName
        });
    }

    //获取对应版本源数据
    handleHistory = () => {
        const id = this.props.location.search.split('=')[1];
        this.props.GetHistoryData(id);
        this.setState({ visible: true });
    }

    //名称切换
    ChangeName = (e) => {
        const value = e.target.value;
        const { taskId } = this.state;
        this.setState({ simpleName: value });
        this.props.GetGovernPathwayReport({
            "statusId": taskId,
            "simplifiedName": value
        });
    }

    //切换历史记录
    ChangeHistory = (id) => {
        const { simpleName } = this.state;
        this.setState({ taskId: id });
        this.props.GetGovernPathwayReportNostatus({
            "simplifiedName": simpleName
        }, id);
        this.onClose();
    }

    onClose = () => {
        this.setState({ visible: false });
    }

    render() {
        const { simpleName, visible } = this.state;
        const { data, history, loading, loadList } = this.props;
        let currentId = null;
        if (!_.isEmpty(data)) {
            currentId = data.id;
        };
        return (
            <div className="content-card">
                <div className="paddingbottom-1rem">
                    <Row>
                        <Col md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}><h3 className='table-name-title'>上级主管部门临床路径管理信息季度报送表</h3></Col>
                        <Col md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                            <div className='flex-end-box'>
                                <Space>
                                    <Button icon={<ForkOutlined />} type="primary" onClick={this.handleHistory}>查看历史版本</Button>
                                    <Radio.Group
                                        className="space-margin4"
                                        style={{ marginLeft: "8px" }}
                                        defaultValue={simpleName}
                                        onChange={this.ChangeName}
                                        buttonStyle="solid"
                                    >
                                        <Radio.Button style={{ borderRadius: "15px 0 0 15px" }} value={false}>机构全称</Radio.Button>
                                        <Radio.Button style={{ borderRadius: "0 15px 15px 0" }} value={true}>机构简称</Radio.Button>
                                    </Radio.Group>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </div>
                <ReportTable data={data} loading={loading} showFooter={true} />
                <Drawer
                    title={<span className="title-drawer">历史版本列表</span>}
                    placement="right"
                    closable={false}
                    getContainer={'#root'}
                    onClose={this.onClose}
                    visible={visible}
                    width={300}
                >
                    <List
                        loading={loadList}
                        bordered={false}
                        dataSource={history}
                        style={{ padding: " 0 10px" }}
                        renderItem={item => {
                            let date = "";
                            let time = "";
                            if (!_.isEmpty(item.lastModificationTime)) {
                                date = item.lastModificationTime.split('T')[0];
                                time = item.lastModificationTime.split('T')[1].split(".")[0];
                            }
                            return <List.Item style={{ cursor: 'pointer' }} onClick={() => { this.ChangeHistory(item.id) }}>
                                <List.Item.Meta
                                    avatar={
                                        currentId === item.id ? <Badge.Ribbon text="最新版本" style={{ fontSize: "8px", height: "18px", lineHeight: "18px" }}>
                                            <Avatar icon={<FileTextOutlined />} />
                                        </Badge.Ribbon> : <Avatar icon={<FileTextOutlined />} />
                                    }
                                    title={<span>更新日期：<Text mark>{date}</Text></span>}
                                    description={<span>时间：{time ? <Text code>{time}</Text> : null}</span>}
                                />
                            </List.Item>
                        }}
                    />
                </Drawer>
            </div>
        )
    }
}

export default connect(
    state => ({
        data: state.DataReviewReview.data,
        loading: state.DataReviewReview.loading,
        loadList: state.DataReviewReview.loadList,
        history: state.DataReviewReview.history,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(ReviewPage);