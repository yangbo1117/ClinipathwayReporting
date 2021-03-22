import React, { Component, Fragment } from 'react';
import { Form, Select, Button, Table, Radio, Tooltip, Popover } from "antd";
import { connect } from 'react-redux';
import _ from "lodash";
import { bindActionCreators } from 'redux';
import * as actions from "./index.action";
import { Link } from "react-router-dom";
import { ExclamationCircleTwoTone, FileSearchOutlined } from '@ant-design/icons';

const { Option } = Select;
//查看历史版本
class HistoryPage extends Component {
    constructor(props) {
        super(props);
        this.TitleReport = [
            {
                title: "上级主管部门",
                dataIndex: 'superiorGovernmentName',
                key: 'superiorGovernmentName',
            },
            {
                title: "医院名称",
                dataIndex: 'hospName',
                key: 'hospName',
                ellipsis: true,
            },
        ];
        this.TitleAssocReport = [
            {
                title: "机构名称",
                dataIndex: 'superiorGovernmentName',
                key: 'superiorGovernmentName',
                ellipsis: true,
            },
        ]
        this.columnsReport = [
            {
                title: "年份-季度",
                dataIndex: "year",
                key: "year",
                render: (text, record) => {
                    return <span>{`${record.year}-${record.quarter}`}</span>
                }
            },
            {
                title: "标注信息",
                dataIndex: 'comment',
                key: 'comment',
                render: (text) => {
                    if (text) {
                        return <Popover content={text} title={false}>
                            <ExclamationCircleTwoTone twoToneColor="#f00" className="span-cursor" />
                        </Popover>
                    } else {
                        return <span></span>
                    }
                }
            },
            {
                title: "创建日期",
                dataIndex: 'creationTime',
                key: 'creationTime',
                render: (text) => {
                    if (text) {
                        return <span>{text.split("T")[0]}</span>

                    }
                }
            },
            {
                title: "上次更新",
                dataIndex: 'lastModificationTime',
                key: 'lastModificationTime',
                render: (text) => {
                    if (text) {
                        return <span>{text.split("T")[0]}</span>
                    }
                }
            },
        ];
        this.OptReport = [
            {
                title: "查看",
                dataIndex: 'id',
                key: 'id',
                render: (text) => {
                    return <Link to={`/Layout/PathwayReport/View?Id=${text}`}><Tooltip title="查看"><FileSearchOutlined className="color-189" /></Tooltip></Link>
                }
            },
        ];
        this.OptAssocReport = [
            {
                title: "查看",
                dataIndex: 'id',
                key: 'id',
                render: (text) => {
                    return <Link to={`/Layout/DataReview/ReviewHistory?Id=${text}`}><Tooltip title="查看"><FileSearchOutlined className="color-189" /></Tooltip></Link>
                }
            },
        ];
    }

    state = {
        columns: [],
        opcolumns: [],
        url: "",
        pagination: {
            current: 1,
            pageSize: 10,
        },
        isSimple: false, //全简
        id: null,
        sortedInfo: null,
        sorterVal: null, //排序
        filteredInfo: null,
        filterVal: null, // 筛选
    }

    componentDidMount() {
        const { roles } = this.props;
        if (_.includes(roles, "Government")) {
            const geturl = "/api/pathwayreport/history/";
            this.setState({
                columns: _.concat(this.TitleReport, this.columnsReport),
                opcolumns: this.OptReport,
                url: geturl,
            });
        }
        if (_.includes(roles, "Association")) {
            const geturl = "/api/pathwaygovernreport/history/";
            this.setState({
                columns: _.concat(this.TitleAssocReport, this.columnsReport),
                opcolumns: this.OptAssocReport,
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
            pagination: {
                current: 1,
                pageSize: 10,
            },
        });
        this.props.GetPathwayReport(url, {
            "id": values.id,
            "simplifiedName": isSimple,
        });
    }

    //名称切换
    ChangeName = (e) => {
        const value = e.target.value;
        const { id, pagination, url } = this.state;
        this.setState({ isSimple: value });
        if (!_.isEmpty(id)) {
            this.props.GetPathwayReport(url, {
                "id": id,
                "simplifiedName": value,
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
            });
        }
    }

    //增加columns排序
    AddColumnRules = (columns, rules, opcolumn, sortedInfo, filteredInfo) => {
        let result = columns.map(i => {
            let item = _.filter(rules, function (n) {
                return _.toLower(n.name) === _.toLower(i.key);
            });
            if (!_.isEmpty(item) && item[0].canSort) {
                return {
                    ...i,
                    sorter: true,
                    sortOrder: sortedInfo.columnKey === i.key && sortedInfo.order
                }
            } else {
                return i;
            }
        });
        return _.concat(result, opcolumn);
    }

    //TableChange
    handleTableChange = (pagination, filters, sorter) => {
        const { id, isSimple, url } = this.state;
        let Sorting = null;
        if (sorter.order === "ascend") {
            Sorting = `${sorter.columnKey} asc`;
        }
        if (sorter.order === "descend") {
            Sorting = `${sorter.columnKey} desc`;
        }
        this.setState({
            pagination: pagination,
            sortedInfo: sorter,
            sorterVal: Sorting,
        });
        this.props.GetPathwayReport(url, {
            "id": id,
            "simplifiedName": isSimple,
            "SkipCount": (pagination.current - 1) * pagination.pageSize,
            "MaxResultCount": pagination.pageSize,
            "Sorting": Sorting,
        });
    }

    render() {
        let { columns, opcolumns, isSimple, pagination, sortedInfo } = this.state;
        const { institutions, loading, data, total, columnrules, roles } = this.props;
        sortedInfo = sortedInfo || {};
        let concatColumns = this.AddColumnRules(columns, columnrules, opcolumns, sortedInfo);
        return (
            <Fragment>
                <div className="card-form card-bottom">
                    <Form onFinish={this.onFinish} layout="inline" >
                        {
                            _.includes(roles, "Hospital") ? null : <Fragment>
                                <Form.Item label="机构名称" name='id' rules={[{ required: true }]} className="space-margin4 marginbottom-0">
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
                <div className='content-card'>
                    <div className="flex-space-between paddingbottom-1rem">
                        <span className="title-b">报表更新记录列表</span>
                        <Radio.Group
                            className="space-margin4"
                            value = { isSimple }
                            onChange={ this.ChangeName }
                            buttonStyle="solid"
                        >
                            <Radio.Button style={{ borderRadius: "15px 0 0 15px" }} value={false}>机构全称</Radio.Button>
                            <Radio.Button style={{ borderRadius: "0 15px 15px 0" }} value={true}>机构简称</Radio.Button>
                        </Radio.Group>
                    </div>
                    <Table
                        loading={loading}
                        columns={concatColumns}
                        dataSource={data}
                        pagination={{
                            ...pagination,
                            total: total,
                            showSizeChanger: true,
                            showTotal: (total, range) => (`展示第 ${range[0]} 项至第 ${range[1]} 项结果   总共 ${total} 项`),
                        }}
                        onChange={this.handleTableChange}
                        scroll={{ x: "max-content" }}
                    ></Table>
                </div>
            </Fragment>
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