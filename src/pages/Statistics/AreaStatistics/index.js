import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { Table, Form, DatePicker, Button } from "antd";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import ExportExcell from "assets/js/better-xlsx";

const { RangePicker } = DatePicker;
const AreaStatisticsPage = (props) => {
    const [time, setTime] = useState('');
    const { loading, data } = props;
    const { columns, dataSource } = data;

    const onFinish = (values) => {
        let start = values.time[0].format('YYYY-Q').split("-");
        let end = values.time[1].format('YYYY-Q').split("-");
        const reqdata = {
            "start": {
                "year": start[0],
                "quarter": start[1]
            },
            "end": {
                "year": end[0],
                "quarter": end[1]
            },
        };
        setTime(`${start[0]}年${start[1]}季度-${end[0]}年${end[1]}季度`)
        props.GetAreaStatisticsData(reqdata)
    };

    const title = "累计开展专业、病种数量汇总";

    const handleExport = () => {
        if(!_.isEmpty(columns)) {
            ExportExcell(
                [
                   { column: columns, dataSource: dataSource }
                ],
                `${time}${title}`,
            )
        }
    };

    return (
        <Fragment>
            <div className="card-form card-bottom">
                <Form onFinish={onFinish} layout="inline">
                    <Form.Item name="time" label="时间范围" rules={[{ required: true, message: "请选择时间范围" }]} className="space-margin4 marginbottom-0">
                        <RangePicker picker="quarter"></RangePicker>
                    </Form.Item>
                    <Form.Item className="space-margin">
                        <Button htmlType='submit' icon={<SearchOutlined />} type='primary'>查询</Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="content-card">
                <Table
                    title={() => (
                        <Fragment>
                            <div className="flex-space-between">
                                <span className="title-b">{title}</span>
                                <Button disabled={_.isEmpty(dataSource)} icon={ <ExportOutlined /> } onClick={ handleExport }>导出Excel</Button>
                            </div>
                        </Fragment>
                    )}
                    loading={loading}
                    columns={columns}
                    rowKey="diseaseName"
                    scroll={{ x: "max-content" }}
                    expandable={{
                        childrenColumnName: "not_children"
                    }}
                    dataSource={dataSource}
                ></Table>
            </div>
        </Fragment>
    )
}

export default connect(
    state => ({
        data: state.StatisticsArea.data,
        loading: state.StatisticsArea.loading,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(AreaStatisticsPage);