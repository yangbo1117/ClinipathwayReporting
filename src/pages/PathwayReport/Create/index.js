import React, { Fragment } from 'react';
import { Button, Card, Modal, message, DatePicker, Space, Upload, Form, Row, Col, Table, InputNumber, Typography, ConfigProvider, notification, Result } from 'antd';
import { CloudUploadOutlined, CheckSquareOutlined, RetweetOutlined, ReloadOutlined, ApartmentOutlined, ContactsOutlined, BankOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./index.action";
import _ from "lodash";
import { withRouter } from 'react-router-dom';
import { columnGoven, columnHosp, columnClass, columnSubName, columnPathCnt, columnDiseases, columnPathName } from "assets/js/reportColumns";
import moment from 'moment';
import zh_CN from 'antd/es/locale/zh_CN'; //汉化
import 'moment/locale/zh-cn';
import FileSaver from "file-saver";

const { RangePicker } = DatePicker;
const { confirm } = Modal;
const { Text } = Typography;
class ReportUpload extends React.Component {
    formRef = React.createRef();

    state = {
        exceldata: [],//表格数据
        confirm: false, //是否确认
        btnloading: false,
    }
    componentDidMount() {
        this.props.GetReportInfo();
    }

    //
    returnData = (userInfo) => {  //生成表格
        let inputCol = {};
        columnDiseases.filter(i => i.canInput).forEach(t => {
            inputCol[t.dataIndex] = t.dataIndex
        });
        if (!_.isEmpty(userInfo)) {
            let originData = userInfo.subjects.map(i => {
                // return i["pathWays"];
                if (!_.isEmpty(i["pathWays"])) {
                    let item = i["pathWays"].map(t => {
                        return {
                            "clinicalPathwayId": t.id,  //病种Id
                            "clinicalPathwayName": t.name, //病种名称
                            "specializedSubjectName": i.name, //专业名称
                            "specificDiseasesId": i.id, //专业Id
                            "specificDiseasesCnt": i.pathWayCount, //专业
                            'superiorGovernmentName': userInfo.superiorGovernmentName,
                            "hospName": userInfo.hospName,
                            "hospClass": userInfo.hospClass,
                            ...inputCol,
                        }
                    })
                    return item;
                } else {
                    return [];
                }
            });
            return _.compact(_.flatMapDeep(originData));
        } else {
            return [];
        }
    }

    returnColumns = (userInfo, leng) => {  //生成表格头
        let column = [];
        if (_.isEmpty(userInfo)) {
            return column;
        } else {
            _.concat(columnGoven, columnHosp, columnClass).forEach(k => {
                column.push({
                    ...k,
                    // width: 140,
                    render: (text, record, index) => {
                        let obj = {
                            children: <Text>{text}</Text>,
                            props: {},
                        };
                        if (index === 0) {
                            obj.props.rowSpan = leng;
                        }
                        for (var k = 1; k <= leng; k++) {
                            if (index === k) {
                                obj.props.rowSpan = 0;
                            }
                        }
                        return obj;
                    }
                })
            });

            const mergeCount = _.concat([], userInfo.subjects.map(i => {
                return i["pathWayCount"];
            }));
            let spanCount = [];
            mergeCount.forEach((t, index) => {
                let count = _.reduce(_.cloneDeep(mergeCount).slice(0, index + 1), function (sum, n) {
                    return sum + n;
                }, 0);
                spanCount.push(count)
            });
            columnSubName.forEach(t => {
                column.push({
                    ...t,
                    render: (text, record, index) => {
                        let obj = {
                            children: text,
                            props: {},
                        };
                        spanCount.forEach((r, idx) => {
                            if (index === (spanCount[idx] - mergeCount[idx])) {
                                obj.props.rowSpan = mergeCount[idx];
                            }
                            for (var k = (spanCount[idx] - mergeCount[idx] + 1); k < spanCount[idx]; k++) {
                                if (index === k) {
                                    obj.props.rowSpan = 0;
                                }
                            }
                        })
                        return obj;
                    }
                });
            })

            columnPathName.forEach(j => {
                column.push({
                    ...j,
                    // width: 140,
                })
            });

            const limitDecimals = (value) => { //限制输入为整数或两位小数
                const reg = /^(-)*(\d+)\.(\d\d).*$/;
                if (typeof value === 'string') {
                    return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
                } else if (typeof value === 'number') {
                    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
                } else {
                    return ''
                }
            };

            columnDiseases.filter(i => i.canInput).forEach(k => {
                column.push({
                    ...k,
                    width: 140,
                    render: (text, record) => (
                        <Form.Item name={`${text}+${record["clinicalPathwayId"]}`} rules={[{ required: true, message: '输入不为空!' }]}>
                            <InputNumber
                                formatter={limitDecimals}
                                parser={limitDecimals}
                                min={0}>
                            </InputNumber>
                        </Form.Item>
                    )
                })
            });
            return column;
        };
    }
    quarterChange = (date, dateString) => { //季度变化
        if (date) { //当选择日期时
            let start = moment(dateString, "YYYY-QQ").startOf("quarter");
            let end = moment(dateString, "YYYY-QQ").endOf("quarter");
            this.formRef.current.setFieldsValue({ "customDate": [start, end] });
        }
    }
    disabledQuarter = (current) => { //不可选年份-季度
        return current > moment().endOf('month');
    }

    openNotification = (msg) => {
        let txt = "重新提交之前，请检查并修改表单信息。";
        if (msg) {
            txt = msg
        }
        const args = {
            message: '提交 失败',
            description: txt,
        };
        notification.error(args);
    };
    showConfirm = () => {
        const _this = this;
        confirm({
            title: '提交 成功',
            icon: <CheckCircleOutlined />,
            content: '点击“ 跳转 ”按钮，查看管理信息列表。',
            okText: '跳转',
            cancelText: '取消',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(() =>{
                        _this.props.history.push('/Layout/PathwayReport/ManageMent');
                        resolve();
                    }, 1000);
                }).catch(() => {resolve(); console.log('Oops errors!');});
            },
            onCancel() {
            },
        });
    }

    //提交
    onFinish = values => {
        const { userInfo } = this.props;
        let pathNode = [];
        if (!_.isEmpty(userInfo) && !_.isEmpty(userInfo.subjects)) {
            pathNode = _.compact(_.flatMapDeep(userInfo.subjects.map(i => {
                if (!_.isEmpty(i["pathWays"])) {
                    return i["pathWays"].map(t => ({
                        ...t,
                        "specializedSubjectId": i.id,
                        "specializedSubjectName": i["name"],
                        "pathwayOfDiseasesCnt": i["pathWayCount"],
                    }));
                } else {
                    return [];
                }
            })));
        };
        let date = values['customQuarter'].format('YYYY-Q').split('-');
        const sDateVal = values['customDate'][0].format('YYYY-MM-DD').split('T')[0];
        const eDateVal = values['customDate'][1].format('YYYY-MM-DD').split('T')[0];
        _.unset(values, 'customQuarter'); //删除自年季度
        _.unset(values, 'customDate'); //删除自定义时间
        let result = []
        if (!_.isEmpty(pathNode)) {
            pathNode.forEach(i => {
                let obj = {}
                _.forIn(values, function (val, key) {
                    let name = key.split('+');
                    if (Number(name[1]) === i["id"]) {
                        obj[`${name[0]}`] = val
                    }
                })
                result.push({
                    "clinicalPathwayId": i.id,
                    "specializedSubjectId": i["specializedSubjectId"],
                    "specializedSubjectName": i["specializedSubjectName"],
                    'specificDiseasesCnt': i["specificDiseasesCnt"],
                    ...obj,
                })
            })
        }
        const data = {
            'year': Number(date[0]),
            "quarter": Number(date[1]),
            'cnt': values.cnt,
            "infos": result,
        }
        this.setState({ btnloading: true })
        this.props.SubmitReport(data).then(res => {
            this.setState({ btnloading: false });
            this.showConfirm();
        }).catch(error => {
            this.setState({ btnloading: false });
            if (error.data) {
                if (error.data.error) {
                    if (error.data.error) {
                        const text = error.data.error.message;
                        this.openNotification(text)
                    }
                }
            } else {
                this.openNotification()
            }
        })
    }

    onRest = () => { //重置
        this.formRef.current.resetFields();
    }

    render() {
        let { visible, btnloading, resultStatus } = this.state;
        const { userInfo, loading, noStyle } = this.props;
        const tableloading = loading || btnloading;

        //生成上传表格
        let dataTable = this.returnData(userInfo); //创建数据
        let columnTable = this.returnColumns(userInfo, dataTable.length); //创建表头
        return (
            <React.Fragment>
                <div className={noStyle ? "" : "content-card"}>
                    <Card
                        title={<b className='table-name-title'>医疗机构临床路径管理整体信息季度报送表</b>}
                        style={{ width: '100%' }}
                    >
                        <ConfigProvider locale={zh_CN}>
                            <Form ref={this.formRef} onFinish={this.onFinish}>
                                {/* <div className="space-8">
                                    <Row gutter={[16,8]}>
                                        <Col span={8}><Space><ContactsOutlined className="color7050b5" /><label>机构名称：{userInfo && userInfo.hospName }</label></Space></Col>
                                        <Col span={8}><Space><ApartmentOutlined className="color7050b5" /><label>级别：{userInfo && userInfo.hospClass }</label></Space></Col>
                                        <Col span={8}><Space><BankOutlined className="color7050b5" /><label>上级机构：{userInfo && userInfo.superiorGovernmentName }</label></Space></Col>
                                    </Row>
                                </div> */}
                                <Row gutter={[24]}>
                                    <Col xl={{ span: 8 }} md={{span: 12}} sm={{ span: 24 }} xs={{ span: 24 }}>
                                        <Form.Item label="全院出院人数" name='cnt' rules={[{ required: true }]}>
                                            <InputNumber min={0} placeholder="请输入全院出院人数" precision={0} style={{minWidth: 120}} />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={{ span: 8 }} md={{span: 12}} sm={{ span: 24 }} xs={{ span: 24 }}>
                                        <Form.Item label='年份-季度' name='customQuarter' rules={[{ required: true }]} >
                                            <DatePicker onChange={this.quarterChange} picker="quarter" disabledDate={this.disabledQuarter} allowClear={false} />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={{ span: 8 }} md={{span: 12}} sm={{ span: 24 }} xs={{ span: 24 }}>
                                        <Form.Item label='统计日期' name='customDate' >
                                            <RangePicker disabled={true} ></RangePicker>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Table
                                    // title={() => <Fragment>
                                    // </Fragment>}
                                    bordered
                                    rowKey="clinicalPathwayId"
                                    loading={tableloading}
                                    dataSource={dataTable}
                                    columns={columnTable}
                                    pagination={false}
                                    scroll={{ x: 'max-content' }}
                                />
                                <div className="flex-end-box steps-action">
                                    <Space>
                                        <Button type='primary' icon={<CheckSquareOutlined />} shape="round" htmlType="submit">提交报表</Button>
                                        < Button onClick={this.onRest} icon={<RetweetOutlined />} shape="round">重置</Button>
                                    </Space>
                                </div>
                            </Form>
                        </ConfigProvider>
                    </Card>
                </div>
            </React.Fragment>
        )
    }
}
export default withRouter(connect(
    state => ({
        userInfo: state.PathwayReportCreate.userInfo,
        loading: state.PathwayReportCreate.loading,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(ReportUpload));
