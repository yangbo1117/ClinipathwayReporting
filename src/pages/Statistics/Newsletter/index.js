import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import FileSaver from "file-saver";
import { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { SearchOutlined, FileSearchOutlined } from "@ant-design/icons";
import { Form, DatePicker, Row, Col, Divider, Space, message, Button } from "antd";

class NewsletterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            loading: false,
        },
            this.onClose = this.onClose.bind(this);
        this.showDrawer = this.showDrawer.bind(this);
        this.disableDate = this.disableDate.bind(this);
        this.onFinish = this.onFinish.bind(this);
    }

    onClose() {
        this.setState({ visible: false, });
    }

    showDrawer() {
        this.setState({ visible: true });
    }

    disableDate(current) {
        return current && current > moment().endOf("day");
    }

    onFinish(values) {
        if (time) {
            const time = values['time'].format('YYYY-Q').split('-');
            let params = {
                year: time[0],
                quarter: time[1]
            };
            this.setState({ loading: true });
            this.props.getReportWord(params).then(res => {
                var file = new File([res], `${time[0]}年${time[1]}季度简讯.docx`, { type: "application/octet-stream;charset=utf-8" });
                FileSaver.saveAs(file);
                this.setState({ loading: false });
            }).catch(err => {
                this.setState({ loading: false });
                message.error("下载失败！")
            })
        }
    }
    render() {
        const { visible, loading } = this.state;
        return (
            <Fragment>
                <div className="content-card">
                    <Divider orientation="left"><span className="title-b"><Space><FileSearchOutlined /><span>简讯下载</span></Space></span></Divider>
                    <Row>
                        <Col sm={{ span: 24 }} xs={{ span: 24 }} lg={{span: 12, offset: 6}} xl={{ span: 8, offset: 8 }}>
                            <Form layout="vertical" onFinish={this.onFinish}>
                                <Form.Item name="time" rules={[{ required: true, message: "请选择年份-季度" }]}>
                                    <DatePicker placeholder="请选择年份-季度" picker="quarter" style={{ width: '100%' }} disabledDate={this.disableDate} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block loading={loading}>查询</Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => bindActionCreators({ ...actions }, dispatch),
)(NewsletterPage);