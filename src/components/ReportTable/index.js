import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { Table, DatePicker, Typography, Form, Tooltip, Space, Card, Button, Row, Col } from 'antd';
// import { formList, formList0 } from 'assets/js/rendertable';
import { columnGoven, columnHosp, columnSubCnt, columnPathCnt, columnDiseases, columnSummary } from "assets/js/reportColumns";
import { InfoCircleTwoTone, ExportOutlined } from "@ant-design/icons";
import ExportExcell from "assets/js/better-xlsx";
import _ from 'lodash';
import moment from 'moment';
import Fixed from 'utils/tofixed';
import { FilterUndefineNull } from "wrappers/index";

const { Text } = Typography;
const { RangePicker } = DatePicker;
const Custom_TableOne = (props) => {
    const [form] = Form.useForm();
    const [footerdataSource, setfooterdataSource] = useState([]); //底部汇总表格数据来源

    useEffect(() => {
        if (!_.isEmpty(props.data)) {
            form.setFieldsValue({
                'yearquarter': moment(`${props.data.year}-${props.data.quarter}`, 'YYYY-Q'),
                'customdate': [moment(`${props.data.sDate.split('T')[0]}`), moment(`${props.data.eDate.split('T')[0]}`)]
            });
            setfooterdataSource([
                { 'key': 1, 'summary': '汇总', 'total': '三级医院总数', 'totalVal': Fixed(props.data.thirdClassCnt), 'openCnt': '开展临床路径管理的三级医院数量', 'openCntVal': Fixed(props.data.thirdClassOfPathwayCnt), 'scale': '开展比1', 'scaleVal': Fixed(props.data.thirdClassRatio) },
                { 'key': 2, 'summary': '汇总', 'total': '二级医院总数', 'totalVal': Fixed(props.data.secondClassCnt), 'openCnt': '开展临床路径管理的二级医院数量', 'openCntVal': Fixed(props.data.secondClassOfPathwayCnt), 'scale': '开展比2', 'scaleVal': Fixed(props.data.secondClassRatio) },
                { 'key': 3, 'summary': '合计', 'total': '医院总数', 'totalVal': Fixed(props.data.hospitalCnt), 'openCnt': '开展临床路径管理的医院数量', 'openCntVal': Fixed(props.data.hospitalOfPathwayCnt), 'scale': '开展比', 'scaleVal': Fixed(props.data.allClassRatio) },
            ]);
        }
    }, [props.data, form]);

    const dataSource = useMemo(() => {
        const data = props.data;
        if (_.isEmpty(data)) {
            return [];
        } else {
            let dataSource_infos = [];
            if (!_.isEmpty(data.infos)) {
                _.forEach(data.infos, function (o) {
                    if(o.children){
                        o.children.forEach(item => {
                            dataSource_infos.push({
                                ...item,
                                'superiorGovernmentName': o['hospName'],
                            });
                        })
                    }
                    dataSource_infos.push({
                        ...o,
                        "hospName": '合计',
                        'superiorGovernmentName': o['hospName'],
                    });
                });
            }
            let dataSource_summary = [];
            if (!_.isEmpty(data.summary)) {
                dataSource_summary = [
                    {
                        "id": "summary",
                        'superiorGovernmentName': "总计",
                        ...data.summary,
                    }
                ]
            };
            let dataSource_result = FilterUndefineNull(_.concat(dataSource_infos, dataSource_summary))
            return dataSource_result;
        }
    }, [props.data]);

    const finalCol = useMemo(() => {
        let columns_result = [];
        const infos =  props.data.infos || [];
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
                    if(index === dataSource.length - 1){
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
                    if(index === dataSource.length - 1){
                        obj.props.colSpan = 0;
                    }
                    return obj
                }
            })
        });
        _.concat(columnSubCnt, columnPathCnt, columnDiseases).forEach(l => {
            columns_result.push({
                ...l,
                // width:100,
                render: (text, record) => {
                    let commentTxt = "";
                    if (!_.isEmpty(record.comment)) {
                        let itemComment = _.find(record.comment, function (o) { return o.name === l.dataIndex });
                        if (!_.isEmpty(itemComment)) {
                            commentTxt = itemComment.value;
                        }
                    };
                    if (!text) {
                        return <Space>
                            <span>{0}</span>
                            {!_.isEmpty(commentTxt) ? <Tooltip title={commentTxt}><InfoCircleTwoTone style={{ cursor: 'pointer' }} /></Tooltip> : null}
                        </Space>
                    } else {
                        return (l.isRatio ? <span>{`${Fixed(text)}%`}</span> : <Fragment>
                            <Space>
                                <span>{Fixed(text)}</span>
                                {!_.isEmpty(commentTxt) ? <Tooltip title={commentTxt}><InfoCircleTwoTone twoToneColor="#f00" style={{ cursor: 'pointer' }} /></Tooltip> : null}
                            </Space>
                        </Fragment>)
                    }
                }
            })
        });
        return columns_result;
    }, [dataSource, props.data])

    // 表格底部汇总表格
    const footerColumns = [
        {
            title: false, dataIndex: 'summary', key: 'summary', render: (text, record, index) => {
                const obj = {
                    children: <Text>{text}</Text>,
                    props: {},
                };
                if (index === 0) {
                    obj.props.rowSpan = 2;
                }
                for (var k = 1; k < 2; k++) {
                    if (index === k) {
                        obj.props.rowSpan = 0;
                    }
                }
                return obj;
            }
        }, //汇总
        { title: false, dataIndex: 'total', key: 'total' }, //医院数量
        { title: false, dataIndex: 'totalVal', key: 'totalVal' }, //医院数量值
        { title: false, dataIndex: 'openCnt', key: 'openCnt' }, //开展医院数量
        { title: false, dataIndex: 'openCntVal', key: 'openCntVal' }, //开展医院数量值
        { title: false, dataIndex: 'scale', key: 'scale' }, //比例
        { title: false, dataIndex: 'scaleVal', key: 'scaleVal' }, //比例值
    ];

    const handleExport = () => {
       let filename = props.exportName || `${props.data.year}年第${props.data.quarter}季度报送表`;
       ExportExcell(
            [
                { column: finalCol, dataSource: dataSource, },
                { column: columnSummary, dataSource: footerdataSource, }
            ],
            filename,
        )
    };

    return (
        <div>
            <Card>
                <Form form={form} initialValues={{ 'yearquarter': moment('2020-1', 'YYYY-Q'), }}>
                    <Row gutter={[24]}>
                        <Col md={{ span: 6 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Form.Item label='年份-季度' name='yearquarter'>
                                <DatePicker picker='quarter' disabled ></DatePicker>
                            </Form.Item>
                        </Col>
                        <Col md={{ span: 10 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Form.Item label='统计日期' name='customdate'>
                                <RangePicker disabled></RangePicker>
                            </Form.Item>
                        </Col>
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Form.Item>
                                <Button disabled={_.isEmpty(dataSource)} icon={<ExportOutlined />} onClick={handleExport}>导出Excel</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <div>
                    <Table
                        bordered
                        loading={props.loading}
                        dataSource={dataSource}
                        columns={finalCol}
                        expandable={{
                            childrenColumnName: "not_children",
                        }}
                        pagination={false}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                        footer={() => (
                            props.showFooter ? (
                                <Table
                                    bordered
                                    showHeader={false}
                                    columns={footerColumns}
                                    dataSource={footerdataSource}
                                    pagination={false}
                                    scroll={{ x: "max-content" }}
                                    footer={() => {
                                        if (_.isEmpty(props.data)) {
                                            return null;
                                        } else {
                                            return (props.data.hasComment ? <Text strong>批注：<Text type="danger">{props.data.comment}</Text></Text> : false)
                                        }
                                    }}
                                ></Table>
                            ) : null
                        )}
                    />
                </div>
            </Card>
        </div>
    )
}

export default Custom_TableOne;