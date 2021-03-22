import React, { Fragment, useMemo, useState } from 'react';
import { Steps, Row, Col, Button, Upload, message, Checkbox, Space, Form, DatePicker, Result, Popconfirm, Tooltip, Divider, Modal, Typography, InputNumber } from "antd";
import styles from "./index.module.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { CloudUploadOutlined, InboxOutlined, FileExcelTwoTone, FileExcelOutlined, ExclamationCircleOutlined, CloudDownloadOutlined  } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";

const { Step } = Steps;
const { Dragger } = Upload;
const { confirm } = Modal;
const { Title, Text } = Typography;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 10,
    },
};
const tailLayout = {
    wrapperCol: {
        xs: { offset: 0, span: 24, },
        sm: { offset: 8, span: 10, },
    },
};

const UploadingPage = (props) => {
    const [form] = Form.useForm();

    const [fileList, setfileList] = useState([]);
    const [loading, setloading] = useState(false);
    const [status, setstatus] = useState("");


    const uploadProps = {
        accept: ['.xlsx', '.xls'], //上传文件类型
        multiple: false,
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setfileList(newFileList)
        },
        beforeUpload: file => {
            let node = [...fileList, file].slice(-1);
            setfileList(node)
            return false;
        },
        fileList,
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
        showUploadList: true,
    };

    const onFinish = (values) => {
        setloading(true);
        let formdata = new FormData();
        let date = values['timelimit'].format('YYYY-Q').split('-');
        // formdata.append("year", date[0]);
        // formdata.append("quarter", date[1]);
        const params = {
            "year": date[0],
            "quarter": date[1],
            "updatePath": values.updatePath,
            'cnt': values?.cnt,
        }
        if (fileList) {
            _.forEach(fileList, function (o) {
                formdata.append("file", o);
            })
        };
        props.UplodaFile(formdata, params).then(res => {
            setloading(false);
            confirm({
                title: '上传成功',
                getContainer: false,
                icon: <ExclamationCircleOutlined />,
                content: '前往管理信息列表页面',
                okText: "前往",
                cancelText: "取消",
                onOk() {
                    Jump();
                },
                onCancel() {
                    Cancel();
                },
              });
        }).catch(error => {
            setloading(false);
            let text = "上传之前，请检查并修改表单信息。";
            if (error.data) {
                if (error.data.error) {
                    if (error.data.error) {
                        text = error.data.error.message;
                    }
                }
            };
            Modal.warning({
                title: '上传失败',
                okText: "确定",
                content: text,
            });
        });
    };

    const Jump = () => {
        props.history.push("/Layout/PathwayReport/ManageMent");
    };

    const Cancel = () => {
        form.resetFields();
        setfileList([]);
    }

    const GoBack = () => {
        props.history.go(-1);
    }

    const disabledQuarter = (current) => { //不可选年份-季度
        return current > moment().endOf('month');
    }

    const handleDownload = (value) => {
        confirm({
            title: '下载模板，是否选择所有临床路径专业及病种?',
            icon: <ExclamationCircleOutlined />,
            getContainer: false,
            content: '',
            okText: "是",
            cancelText: "否",
            onOk() {
                props.DownloadTemplate(true);
            },
            onCancel() {
                props.DownloadTemplate(false);
            },
          });
        // props.DownloadTemplate(value);
    }


    return (
        <Fragment>
            <div className={styles.card}>
                <div className="flex-space-between">
                    <Title level={5}>选择文件上传</Title>
                    <section className={styles.ptext}>
                        <Tooltip title="点击下载"><Button type="default" style={{borderColor: "#40A9FF", color: "#40A9FF"}} onClick={ props.DownLoadPaths } icon={<CloudDownloadOutlined />}><span>临床路径专业及病种列表</span></Button></Tooltip>
                    </section>
                </div>
                <Divider />
                <Row>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }} >
                        <Form {...layout} onFinish={onFinish} form={form} initialValues={{ "updatePath": true }} >
                            <Form.Item label="全院出院人数" name="cnt" rules={[{ required: true }]}>
                                <InputNumber onStep={false} min={0} precision={0} style={{width: "100%"}} />
                            </Form.Item>
                            <Form.Item label="时间" name="timelimit" rules={[{ required: true, message: "请选择时间" }]}>
                                <DatePicker style={{ width: '100%' }} picker="quarter" disabledDate={disabledQuarter} />
                            </Form.Item>
                            <Form.Item label="下载模板">
                                <Tooltip title="点击下载"><Button type="default"  onClick={handleDownload} icon={<FileExcelTwoTone />}>数据报表模板</Button></Tooltip>
                            </Form.Item>
                            <Form.Item label="选择文件" name="file" rules={[{ required: true, message: "请选择文件" }]}>
                                <Dragger {...uploadProps} style={{ height: 200 }} >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className={styles.uploadtxt}>单击或拖动文件到该区域待上传</p>
                                </Dragger>
                            </Form.Item>
                            <Form.Item {...tailLayout} name="updatePath" valuePropName="checked">
                                <Checkbox><Text strong>同步文件内临床路径专业及病种</Text></Checkbox>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit" block loading={loading} >开始上传</Button>
                            </Form.Item>
                        </Form>
                        <Divider />
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
}

export default connect(
    state => ({
        token: state.Login.Auth.accessToken,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(UploadingPage);