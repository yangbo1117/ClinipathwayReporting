import React, { Component, Fragment } from "react";
import { Table, Tag , Tooltip, Space, Divider, Tabs, Input, Radio, notification, Modal, message } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { OrderedListOutlined, ZoomInOutlined, SyncOutlined, CheckCircleOutlined, CheckSquareOutlined, CloseSquareOutlined, ExclamationCircleTwoTone, MinusCircleOutlined, FileSearchOutlined, SearchOutlined, StopOutlined } from "@ant-design/icons";
import _ from "lodash";

const { TabPane } = Tabs;
class DataReviewManage extends Component{
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:'机构名称',
                dataIndex: "organizationUnitName",
                key: "organizationUnitName",
                render: (text,record) => {
                    return <div className="flex-space-between">
                        <span>{text}</span>
                        <Tooltip title="查看详细任务"><ZoomInOutlined className="span-href" onClick={()=>{ this.ViewDetails(record) }} /></Tooltip>
                    </div>
                }
            },
            {
                title:'年份-季度',
                dataIndex: 'year',
                key:'year',
                render:(text,record)=>{
                return(<span>{record.year}-{record.quarter}</span>)
                }
            },
            {
                title: "拒绝机构数量",
                dataIndex: "rejectCnt",
                key: "rejectCnt",
            },
            {
                title:'任务进程',
                dataIndex: "progress",
                key: "progress",
                render: (text,record) => {
                    if (text === 'New') {
                        return <Tag color="processing" icon={<SyncOutlined spin />}>任务待提交</Tag>
                    } else if (text === 'Confirmed') {
                        return <Tag icon={<CheckCircleOutlined />} color="success">任务已确认</Tag>
                    } else if (text === 'Reject') {
                        return <Space><Tag color="error">任务已拒绝</Tag>{ 
                                        record.comment ?  <Tooltip title={record.comment}>
                                        <ExclamationCircleTwoTone twoToneColor="#f00" className="span-cursor"/>
                                    </Tooltip> : null }
                                </Space>
                    } else if (text === 'Locked') {
                        return <Space><Tag color="warning">任务已提交</Tag>{ 
                                        record.comment ? <Tooltip title={ record.comment }>
                                        <MinusCircleOutlined style={{color:'#fa8c16',cursor:'pointer'}} />
                                    </Tooltip> : null }
                                </Space>
                    } else {
                        return <Tag color="default">未知状态</Tag>
                    }
                },
            },
        ];
        //opcolumns
        this.opcolumn = [
            {
                title: "操作",
                dataIndex: "id",
                key: "id",
                render: (text,record) => {
                    const actionBar = [
                        { title: "提交任务", show: record.canLock, action: this.Lock, icon: <CheckSquareOutlined />  },
                        { title: "取消提交", show: record.canUnlock, action: this.UnLock, icon: <CloseSquareOutlined />  },
                        { title: "拒绝", show: record.canReject, action: this.Reject, icon: <StopOutlined />  },
                        { title: "查看", show: record.canGet, action: this.Review, icon: <FileSearchOutlined />  },
                    ].filter(i => i.show);
                    return (
                        <Space>
                            {
                                actionBar.map((item, index) => {
                                    if(index === actionBar.length - 1) return <Tooltip key={index} title={item.title}><span className="span-href" onClick={() => { item.action(text, record) }}>{item.icon}</span></Tooltip>
                                    return <Space key={index}><Tooltip title={item.title}><span className="span-href" onClick={() => { item.action(text, record) }}>{item.icon}</span></Tooltip><Divider type="vertical" /></Space>
                                })
                            }
                        </Space>
                    )
                }
            }
        ];
        //columns0
        this.columns0 = [
            {
                title: '医院名称',
                dataIndex: 'hospName',
                key: 'hospName',
            },
        ];
        //columns2
        this.columns2 = [
            {
                title: '主管部门',
                dataIndex: 'superiorGovernmentName',
                key: 'superiorGovernmentName',
            },
            {
                title:'年份-季度',
                dataIndex: 'year',
                key:'year',
                render:(text,record)=>{
                return(<span>{record.year}-{record.quarter}</span>)
                }
            },
            {
                title: '任务状态',
                dataIndex: 'progress',
                key: 'progress',
                render: (text,record) => {
                    if (text === 'New') {
                        return <Tag color="processing" icon={<SyncOutlined spin />}>新建任务</Tag>
                    } else if (text === 'Confirmed') {
                        return <Tag icon={<CheckCircleOutlined />} color="success">任务已确认</Tag>
                    } else if (text === 'Reject') {
                        return <Space><Tag color="error">任务已拒绝</Tag>{ 
                                    record.hasComment ?  <Tooltip title={record.comment}>
                                        <ExclamationCircleTwoTone twoToneColor="#f00" className="span-cursor" />
                                    </Tooltip> : null }
                                </Space>
                    } else if (text === 'Locked') {
                        return <Space><Tag color="warning">任务已提交</Tag>{ 
                                    record.hasComment ? <Tooltip title={ record.comment }>
                                        <MinusCircleOutlined style={{color:'#fa8c16',cursor:'pointer'}} />
                                    </Tooltip> : null }
                                </Space>
                    } else {
                        return <Tag color="default">未知状态</Tag>
                    }
                },
            },
            {
                title: '创建日期',
                dataIndex: 'creationTime',
                key: 'creationTime',
                render: (text) => (<span>{text.split('T')[0]}</span>),
            },
        ];
        //columns3
        this.columnsHosp = [
            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
                align:' center',
                render: (text, record) => {
                    return(
                        <Space>
                            <Link to={`/Layout/PathwayReport/View?Id=${text}`}><Tooltip title="查看"><FileSearchOutlined className="color-189" /></Tooltip></Link>
                        </Space>
                    )
                }
            }
        ];
    }

    state = {
        pagination: {
            current: 1,
            pageSize: 10,
        },
        sortedInfo: null,  //表格排序
        sorterVal: null, //api 排序
        searchVal: null, //搜索值
        isSimple: false, //全简切换
        visible: false, //modal显示和关闭
    }

    Lock = (text, record) => {
        const { pagination, isSimple, searchVal, sorterVal } = this.state;
        if(record.rejectCnt > 0){
            notification.warning({
                message: '该任务目前无法提交，存在被拒绝机构！',
                placement: "bottomRight",
            });
        }else{
            this.props.LockPathwayGovernReport(record.year,record.quarter).then(res => {
                message.success("提交成功！");
                this.props.GetPathwayGovernReport({
                    "SkipCount": (pagination.current - 1) * pagination.pageSize,
                    "MaxResultCount": pagination.pageSize,
                    "simplifiedName": isSimple,
                    "Keyword": searchVal,
                    "Sorting": sorterVal,
            });
            }).catch(err => {
                message.error("提交失败！");
            });
        }
    }

    UnLock = (text, record) => {
        const { pagination, isSimple, searchVal, sorterVal } = this.state;
        this.props.UnLockPathwayGovernReport(record.year,record.quarter).then(res => {
            message.success("取消成功！");
            this.props.GetPathwayGovernReport({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "simplifiedName": isSimple,
                "Keyword": searchVal,
                "Sorting": sorterVal,
            });
        }).catch(err => {
            message.error("操作失败！")
        });
    }

    Reject = (text, record) => {
        this.props.history.push(`/Layout/DataReview/Reject?Id=${text}`);
    }

    Review = (text, record) => {
        this.props.history.push(`/Layout/DataReview/Review?Id=${text}`)
    }

    //查看详情
    ViewDetails = (record) => {
        const ParentId = record.id;
        this.setState({ visible: true });
        this.props.GetPathwayReportFromParentId({
            "ParentId": ParentId,
        });
    }

    componentDidMount() {
        this.props.GetPathwayGovernReport();
    }

    //搜索
    handleSearch = (e) => {
        const value = e.target.value;
        const { isSimple } = this.state;
        if(value){
            this.setState({ 
                searchVal: value, 
                sortedInfo: null,
                sorterVal: null,
                pagination: { current: 1,  pageSize: 10 },
            });
            this.props.GetPathwayGovernReport({
                "Keyword": value,
                "simplifiedName": isSimple,
            });
        }
    }

    //清空搜搜框
    SearchChange = (e) => {
        const value = e.target.value;
        const { isSimple } = this.state;
        if(_.isEmpty(value)){
            this.setState({ 
                searchVal: null,
                sortedInfo: null,
                sorterVal: null,
                pagination: {
                    current: 1,
                    pageSize: 10,
                },
            });
            this.props.GetPathwayGovernReport({
                "simplifiedName": isSimple,
            })
        }
    }

    //表格Change
    handleTableChange = (pagination, filters, sorter) => {
        const { searchVal, isSimple } = this.state;
        let Sorting = null;
        if( sorter.order === "ascend") {
            Sorting = `${sorter.columnKey} asc`;
        }
        if( sorter.order === "descend" ) {
            Sorting = `${sorter.columnKey} desc`;
        }
        this.setState({ 
            pagination,
            "sorterVal": Sorting,
            "sortedInfo": sorter,
        });
        this.props.GetPathwayGovernReport({
            "SkipCount": (pagination.current - 1) * pagination.pageSize,
            "MaxResultCount": pagination.pageSize,
            "simplifiedName": isSimple,
            "Keyword": searchVal,
            "Sorting": Sorting,
        });
    }

    //全简切换
    ChangeName = (e) => {
        let value = e.target.value;
        const { pagination, searchVal, sorterVal } = this.state;
        this.setState({ isSimple: value });
        this.props.GetPathwayGovernReport({
            "SkipCount": (pagination.current - 1) * pagination.pageSize,
            "MaxResultCount": pagination.pageSize,
            "simplifiedName": value,
            "Keyword": searchVal,
            "Sorting": sorterVal,
        });
    }

    //增加columns排序
    AddColumnRules = (columns, rules, opcolumn, sortedInfo, filteredInfo) => {
        let result = columns.map(i => {
            let item = _.filter(rules, function(n) {
                return _.toLower(n.name) === _.toLower(i.key);
            });
            if(!_.isEmpty(item) && item[0].canSort){
                return {
                    ...i,
                    sorter: true,
                    sortOrder: sortedInfo.columnKey === i.key && sortedInfo.order
                }
            }else {
                return i;
            }
        });
        return _.concat(result, opcolumn);
    }

    render () {
        let { pagination, visible, sortedInfo, isSimple } = this.state;
        const { loading, data, total, columnrules, detailsLoading, detailsData } = this.props;
        sortedInfo = sortedInfo || {};
        let concatColumns = this.AddColumnRules(this.columns, columnrules, this.opcolumn, sortedInfo) //表格columns
        let detailsColumns = _.concat(this.columns0,this.columns2,this.columnsHosp); //Panel columns
        return (
            <Fragment>
                <div className="content-card">
                    <Tabs   tabPosition='top'>
                        <TabPane tab="提交任务">
                            <Table
                                title={() => <Fragment>
                                    <div className="flex-space-between">
                                        <span className="table-name-title">提交任务列表</span>  
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
                                    <Input placeholder="" onChange={ this.SearchChange } onPressEnter={ this.handleSearch } allowClear prefix={<SearchOutlined />} style={{ borderRadius: 6, maxWidth: 350, }}  />
                                </Fragment>
                                }
                                loading={loading}
                                bordered={true}
                                pagination={{
                                    ...pagination,
                                    total: total,
                                    responsive: true,
                                    showSizeChanger: true,
                                    showTotal: (total, range) => (`展示第 ${range[0]} 项至第 ${range[1]} 项结果   总共 ${total} 项`),
                                }}
                                columns={ concatColumns }
                                dataSource={ data }
                                scroll={{ x: "max-content" }}
                                onChange={this.handleTableChange}
                            ></Table>
                        </TabPane>
                    </Tabs>
                </div>
                <Modal
                    title={<Space><OrderedListOutlined /><span className="title-b">详细列表</span></Space>}
                    width= { 800 }
                    visible= {visible}
                    getContainer={ false }
                    onCancel= {()=> { this.setState({ visible: false }) }}
                    footer= {null}
                >
                    <Table
                        loading= { detailsLoading }
                        columns= { detailsColumns }
                        dataSource= { detailsData }
                        scroll={{ x: "max-content" }}
                        // pagination={}
                    />
                </Modal>
            </Fragment>
        )
    }
}

export default connect(
    state => ({
        data: state.DataReviewManage.data,
        loading: state.DataReviewManage.loading,
        total: state.DataReviewManage.total,
        columnrules: state.DataReviewManage.columnrules,
        detailsData: state.DataReviewManage.detailsData,
        detailsLoading: state.DataReviewManage.detailsLoading,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(DataReviewManage);