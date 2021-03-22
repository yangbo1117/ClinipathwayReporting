import React, { Axios, useState, useEffect, useMemo } from 'react';
import { Table, Row, Col, DatePicker, Card, Typography, Form, message, Space, Tooltip, Modal, Input, Button } from 'antd';
import { columnGoven, columnHosp, columnClass, columnSubName, columnSubCnt, columnPathCnt, columnDiseases, columnPathName } from "assets/js/reportColumns";
import Fixed from 'utils/tofixed';
import _, { result } from 'lodash';
import moment from 'moment';
import { EditTwoTone, FormOutlined, InfoCircleTwoTone } from '@ant-design/icons';
import { Fragment } from 'react';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const Mark_Item = (props) => {
    const [form] = Form.useForm();
    const [inputform] = Form.useForm();

    const [resData, setResData] = useState({});
    //表格
    // const [dataSource, setdataSource] = useState([]);
    const [columns, setcolumns] = useState([]);
    const [summary, setsummary] = useState([]);
    const [loading, setLoading] = useState(false);

    //moadl 
    const [visible, setVisible] = useState(false);
    const [infoId, setinfoId] = useState(null);
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
                "infoId": infoId,
                "name": name,
                ...formValues
            }]))
        )
        setVisible(false);
        inputform.resetFields();
        if (_.valuesIn(formValues).length > 0) {
            props.onDetails({
                "infoId": infoId,
                "name": name,
                ...formValues
            });
        }
    }

    useEffect(() => {
        setLoading(true);
        Axios.get({ url: `/api/PathwayReport/${props.id}` }).then(res => {
            setResData(res);
            setLoading(false);
        }).catch(error => {
            setLoading(false);
            message.warn('表格信息加载失败！')
        });
    }, [props.id]);

    useEffect(() => {
        if (!_.isEmpty(resData)) {
            form.setFieldsValue({
                'yearquarter': moment(`${resData.year}-${resData.quarter}`, 'YYYY-Q'),
                'customdate': [moment(`${resData.sDate.split('T')[0]}`), moment(`${resData.eDate.split('T')[0]}`)]
            });
        }
    }, [resData]);

    const dataSource = useMemo(() => {
        if (!_.isEmpty(resData)) {
            const others = {
                "hospName": resData.hospName,
                "hospClass": resData.hospClass,
                "superiorGovernmentName": resData.superiorGovernmentName,
            }
            const summary = resData.summary;
            if (resData.infos) {
                let node = resData.infos.map(i => {
                    if (i["children"]) {
                        let childrenItem = i["children"].map(t => ({
                            ...t,
                            "specializedSubjectId": i["specializedSubjectId"],
                            "specializedSubjectName": i["specializedSubjectName"],
                            "specificDiseasesCnt": i["specificDiseasesCnt"],
                            ...others,

                        }));
                        return _.concat(childrenItem, [
                            {
                                ...i,
                                ...others,
                                "subsummary": true, //不可批注标记
                                "clinicalPathwayName": "合计",
                            }
                        ]);
                    } else {
                        return [
                            {
                                ...i,
                                ...others,
                                "subsummary": true, //不可批注标记
                                "clinicalPathwayName": "合计",
                            }
                        ];
                    }
                });
                let result = _.concat(_.compact(_.flatMapDeep(node)), [
                    {
                        ...others,
                        ...resData.summary,
                        "subsummary": true, //不可批注标记
                        "superiorGovernmentName": "合计",
                        "specializedSubjectName": resData.infos.length,
                        "clinicalPathwayName":  _.flatMapDeep(node).length - resData.infos.length,
                    }
                ]).map((i, index) => ({ ...i, "key": index }));
                return result;
            } else {
                return [{
                    ...others,
                    ...resData.summary,
                    "subsummary": true, //不可批注标记
                    "superiorGovernmentName": "合计",
                }].map((i, index) => ({ ...i, "key": index }));
            }
        } else {
            return []
        }
    }, [resData]);

    console.log(dataSource)

    const handleMark = (text, id, key) => {
        setVisible(true);
        setinfoId(id);
        setname(key);
    }

    const finalCol = useMemo(() => {
        if (_.isEmpty(resData)) {
            return _.concat(columnGoven, columnHosp, columnClass, columnSubName, columnPathName, columnDiseases);
        } else {
            let pathNode = []; //所有病种
            if (resData.infos) {
                pathNode = _.compact(_.flatMapDeep(resData.infos.map(i => i["children"])));
            };
            const leng = pathNode.length + resData.infos.length;
            let columns = [];
            columnGoven.forEach(k => {
                columns.push({
                    ...k,
                    render: (text, record, index) => {
                        const obj = {
                            children: <div className="title-center">{text}</div>,
                            props: {},
                        };
                        if (dataSource.length > 0) {
                            if (index === 0) {
                                obj.props.rowSpan = leng;
                            }
                            for (let k = 1; k < leng; k++) {
                                if (index === k) {
                                    obj.props.rowSpan = 0;
                                }
                            }
                        }
                        if (index === leng) {
                            obj.props.colSpan = 3;
                        }
                        return obj;
                    }
                })
            });
            _.concat(columnHosp, columnClass).forEach(k => {
                columns.push({
                    ...k,
                    render: (text, record, index) => {
                        const obj = {
                            children: <Text>{text}</Text>,
                            props: {},
                        };
                        if (dataSource.length > 0) {
                            if (index === 0) {
                                obj.props.rowSpan = leng;
                            }
                            for (let k = 1; k < leng; k++) {
                                if (index === k) {
                                    obj.props.rowSpan = 0;
                                }
                            };
                        }
                        if (index === leng) {
                            obj.props.colSpan = 0;
                        }
                        return obj;
                    }
                })
            });

            const mergeCount = _.compact(resData.infos.map(i => {
                if (i["children"]) {
                    const pathleng = i["children"].length + 1;
                    return pathleng;
                } else {
                    return 1;
                }
            }));
            let spanCount = [];
            mergeCount.forEach((t, index) => {
                let count = _.reduce(_.cloneDeep(mergeCount).slice(0, index + 1), function (sum, n) {
                    return sum + n;
                }, 0);
                spanCount.push(count)
            });
            columnSubName.forEach(t => {
                columns.push({
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
            });

            columnPathName.forEach(n => {
                columns.push(n);
            });

            columnDiseases.forEach(j => {
                columns.push({
                    ...j,
                    render: (text, record) => {
                        if (record["subsummary"]) {
                            if (j["isRatio"]) {
                                return (<span>{_.isNumber(text) ? `${Fixed(text)}%` : "-"}</span>)
                            } else {
                                return <span>{_.isNumber(text) ? `${Fixed(text)}` : "-"}</span>
                            }
                        } else {
                            //可标记项
                            if (j["isRatio"]) {
                                return (<span>{_.isNumber(text) ? `${Fixed(text)}%` : "-"}</span>)
                            } else {
                                let commentTxt = "";
                                commentRes.forEach(i => {
                                    if (i.name === j.dataIndex && i.infoId === record["id"]) {
                                        commentTxt = i.value;
                                    }
                                });
                                return <Fragment>
                                    <Space>
                                        <span>{_.isNumber(text) ? `${Fixed(text)}` : "-"}</span>
                                        <Tooltip title='点击标记该项'><EditTwoTone onClick={() => { handleMark(text, record["id"], j.dataIndex) }} style={{ cursor: 'pointer' }} /></Tooltip>
                                        {!_.isEmpty(commentTxt) ? <Tooltip title={commentTxt}><InfoCircleTwoTone twoToneColor="#f00" style={{ cursor: 'pointer' }} /></Tooltip> : <span></span>}
                                    </Space>
                                </Fragment>
                            }
                        }
                    }
                });
            });
            return columns;
        }
    }, [resData, commentRes])

    return (
        <React.Fragment>
            <div style={{ padding: "1rem 0" }} >
                <Card title={<h3 className='title-b'>医疗机构临床路径管理整体信息季度报送表</h3>} extra={null} style={{ width: '100%' }}>
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
                            columns={finalCol}
                            expandable={{
                                childrenColumnName: "custom_children", //指定树形展示字段
                            }}
                            pagination={false}
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