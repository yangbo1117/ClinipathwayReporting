import React, { Axios, useState, useEffect, Fragment } from 'react';
import { Table, Row, Col, DatePicker, Card, Typography, Form, message, Space, Tooltip, Modal, Input, Button } from 'antd';
import { columnGoven, columnHosp, columnClass, columnSubCnt, columnPathCnt, columnDiseases } from "assets/js/reportColumns";
import _ from 'lodash';
import moment from 'moment';
import { EditTwoTone, FormOutlined, InfoCircleTwoTone } from '@ant-design/icons';
import Fixed from 'utils/tofixed';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const Mark_Item = (props) => {
    const [form] = Form.useForm();
    const [inputform] = Form.useForm();

    const [resData, setResData] = useState({});
    //表格
    const [dataSource, setdataSource] = useState([]);
    const [columns, setcolumns] = useState([]);
    const [summary, setsummary] = useState([]);
    const [loading, setLoading] = useState(false);

    //moadl 
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState({});
    const [name, setname] = useState("");

    //commentData
    const [commentRes, setCommentRes] = useState([]); //评论

    const handleCancel = () => {
        setVisible(false);
    }

    const onFinish = (formValues) => {
        let newComment = [...commentRes];
        setCommentRes(
            _.uniq(_.concat(newComment, [{
                "infoId": record.id,
                "name": name,
                ...formValues
            }]))
        )
        setVisible(false);
        inputform.resetFields();
        if (_.valuesIn(formValues).length > 0) {
            props.onDetails({
                "infoId": record.id,
                "name": name,
                ...formValues
            });
        }
    }

    useEffect(() => {
        setLoading(true);
        Axios.get({
            url: `/api/pathwaygovernreport/0`,
            params: {
                "statusId": props.id,
            }
        }).then(res => {
            setResData(res);
            setLoading(true);
        }).catch(error => {
            message.warn('表格信息加载失败！');
            setLoading(false);
        });
    }, [props.id])

    useEffect(() => {
        if (!_.isEmpty(resData)) {
            createNode(resData, commentRes);
            form.setFieldsValue({
                'yearquarter': moment(`${resData.year}-${resData.quarter}`, 'YYYY-Q'),
                'customdate': [moment(`${resData.sDate.split('T')[0]}`), moment(`${resData.eDate.split('T')[0]}`)]
            })
        }
    }, [resData, form, commentRes]);

    const createNode = (data, commentRes) => {
        let dataSource_infos = [];
        if (!_.isEmpty(data.infos)) {
            _.forEach(data.infos, function (o) {
                if (o.children) {
                    o.children.forEach(item => {
                        dataSource_infos.push({
                            ...item,
                            "canTip": true,
                            'superiorGovernmentName': o['hospName'],
                        });
                    })
                }
                dataSource_infos.push({
                    ...o,
                    "canTip": false,
                    "hospName": "合计",
                    'superiorGovernmentName': o['hospName'],
                });
            });
        }
        let dataSource_summary = [];
        if (!_.isEmpty(data.summary)) {
            dataSource_summary = [
                {
                    "id": "summary",
                    "superiorGovernmentName": "总计",
                    "canTip": false,
                    ...data.summary,
                }
            ]
        };
        let dataSource_result = _.concat(dataSource_infos, dataSource_summary);

        let columns_result = [];
        const infos =  data.infos || [];
        const mergeCount = _.compact(infos.map(i => {
            if(i["children"]){
                const pathleng = i["children"].length + 1;
                return pathleng;
            }else {
                return 1;
            }
        }));
        let spanCount = [];
        mergeCount.forEach((t, index) => {
            let count = _.reduce(_.cloneDeep(mergeCount).slice(0,index + 1), function(sum, n) {
                return sum + n;
            }, 0);
            spanCount.push(count)
        });
        columnGoven.forEach(l => {
            columns_result.push({
                ...l,
                render: (text, record, index) => {
                    let obj = {
                        children: <div className="title-center">{text}</div>,
                        props: {},
                    };
                    spanCount.forEach((r, idx) => {
                        if (index === (spanCount[idx] - mergeCount[idx])) {
                            obj.props.rowSpan = mergeCount[idx];
                        }
                        for (var k =  (spanCount[idx] - mergeCount[idx] + 1); k < spanCount[idx]; k++) {
                            if (index === k) {
                                obj.props.rowSpan = 0;
                            }
                        }
                    });
                    if(index === dataSource_result.length - 1){
                        obj.props.colSpan = 2;
                    }
                    return obj;
                }
            })
        })
        columnHosp.forEach(j => {
            columns_result.push({
                ...j,
                render: (text, record, index) => {
                    let obj = {
                        children: text,
                        props: {}
                    };
                    if(index === dataSource_result.length - 1){
                        obj.props.colSpan = 0;
                    }
                    return obj
                }
            })
        });
        _.concat(columnSubCnt, columnPathCnt, columnDiseases).forEach(j => {
            columns_result.push({
                ...j,
                render: (text, record) => {
                    let commentTxt = "";
                    commentRes.forEach(i => {
                        if (i.name === j.dataIndex && i.infoId === record.id) {
                            commentTxt = i.value
                        }
                    });
                    return (j.isRatio ? <span>{`${Fixed(text)}%`}</span> : <Fragment>
                        <Space>
                            <span>{text}</span>
                            {record.canTip ? <Tooltip title='点击标记该项'><EditTwoTone onClick={() => { setVisible(true); setRecord(record); setname(j.dataIndex) }} style={{ cursor: 'pointer' }} /></Tooltip> : null}
                            {!_.isEmpty(commentTxt) ? <Tooltip title={commentTxt}><InfoCircleTwoTone twoToneColor="#F00" style={{ cursor: 'pointer' }} /></Tooltip> : <span></span>}
                        </Space>
                    </Fragment>)
                }
            })
        });
        setdataSource(dataSource_result);
        setcolumns(columns_result);
        setLoading(false);
    }
    return (
        <React.Fragment>
            <div style={{ padding: "1rem 0" }}>
                <Card title={<h3 className='title-b'>上级主管部门临床路径管理信息季度报送表</h3>} extra={null} style={{ width: '100%' }}>
                    <Form form={form} initialValues={{ 'yearquarter': moment('2020-1', 'YYYY-Q'), }}>
                        <Row gutter={[24]}>
                            <Col md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                                <Form.Item label='年份-季度' name='yearquarter'>
                                    <DatePicker picker='quarter' disabled ></DatePicker>
                                </Form.Item>
                            </Col>
                            <Col md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                                <Form.Item label='统计日期' name='customdate'>
                                    <RangePicker disabled></RangePicker>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div className='mark_table'>
                        <Table
                            bordered
                            loading={loading}
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                            rowKey="hospName"
                            expandable={{
                                childrenColumnName: "not_children"
                            }}
                            scroll={{ x: "max-content" }}
                        />
                    </div>
                </Card>
            </div>
            <Form onFinish={onFinish} form={inputform}>
                <Modal
                    title={<Space><FormOutlined /><span>标记该项</span></Space>}
                    width={300}
                    getContainer={false}
                    visible={visible}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" htmlType="submit" type="primary" >
                            确认
                        </Button>,
                    ]}
                >
                    <Form.Item name="value">
                        <Input />
                    </Form.Item>
                </Modal>
            </Form>
        </React.Fragment>
    )
}

export default Mark_Item;