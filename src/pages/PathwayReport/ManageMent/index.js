import React, { Component } from 'react'; 
import { connect } from 'react-redux';
import * as actions from './index.action';
import { bindActionCreators } from 'redux';
import _ from "lodash";
import { message, Tooltip, Tag, Space, Popconfirm, Divider } from 'antd';
import { Link } from "react-router-dom";
import { FileSearchOutlined, FormOutlined, MinusCircleOutlined, DeleteTwoTone, StopOutlined, ZoomInOutlined, SyncOutlined, CheckCircleOutlined, ExclamationCircleTwoTone, FileDoneOutlined  } from "@ant-design/icons";
import ReportPage from "./page";

class ManageMentPage extends Component {
    constructor(props) {
        super(props);
        //columns0
        this.columns0 = [
            {
                title: '医院名称',
                dataIndex: 'hospName',
                key: 'hospName',
                onFilter: (value, record) => record.name.indexOf(value) === 0,
            },
        ]
        //columns1
        this.columns1 = [
            {
                title: '医院级别',
                dataIndex: 'hospClass',
                key: 'hospClass',
            },
        ]
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
                                    record.comment ?  <Tooltip title={record.comment}>
                                        <ExclamationCircleTwoTone twoToneColor="#f00" className="span-cursor" />
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
            {
                title: '创建日期',
                dataIndex: 'creationTime',
                key: 'creationTime',
                render: (text) => (<span>{text.split('T')[0]}</span>),
            },
            {
                title: '上次更新',
                dataIndex: 'lastModificationTime',
                key: 'lastModificationTime',
                render: (text) => (<span>{text.split('T')[0]}</span>),
            },
        ]

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
                            {record.canEdit ? <><Divider type="vertical" /><Link to={`/Layout/PathwayReport/Edit?Id=${text}`}><Tooltip title="编辑"><FormOutlined className="color-189"/></Tooltip></Link></> : null}
                            {record.canConfirm ? <><Divider type="vertical" /><Popconfirm title='确认任务？'onConfirm ={()=>{ this.confirmHospGovern(text)}}><Tooltip title="确认"><FileDoneOutlined className="color-189" /></Tooltip></Popconfirm></> : null}
                            {record.canDelete ? <><Divider type="vertical" /><Popconfirm title='确认删除？' onConfirm={()=>{ this.deleteHospGovern(text) }}><Tooltip title="删除"><DeleteTwoTone /></Tooltip></Popconfirm></> : null}
                            {record.canReject ? <><Divider type="vertical" /><span className="span-cursor"><Link to={`/Layout/PathwayReport/Reject?Id=${text}`}><Tooltip title="拒绝"><StopOutlined className="span-189"/></Tooltip></Link></span></> : null}
                            {record.canComment ? <><Divider type="vertical" /><span className="span-cursor"><Link to={`/Layout/PathwayReport/Annotation?Id=${text}`}><Tooltip title="审核"><ZoomInOutlined className="span-189"/></Tooltip></Link></span></> : null}
                            {record.canUnComment ? <><Divider type="vertical" /><Popconfirm title='确认审核完毕？'onConfirm ={()=>{ this.commentGovern(text)}}><Tooltip title="确认审核"><CheckCircleOutlined className="span-189"/></Tooltip></Popconfirm></> : null}
                        </Space>
                    )
                }
            }
        ]

        //columns4
        this.columnsGovern = [
            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
                align:' center',
                render: (text, record) => {
                    const spanstyle = { cursor:'pointer'}
                    return(
                        <Space>
                            <Link to={`/Layout/PathwayReport/Review?Id=${text}`}><Tooltip title="查看"><FileSearchOutlined className="color-189" /></Tooltip></Link>
                            {record.canEdit ? <><Divider type="vertical" /><Link to={`/Layout/PathwayReport/Edit?Id=${text}`}><Tooltip title="编辑"><FormOutlined className="color-189"/></Tooltip></Link></> : null}
                            {record.canConfirm ? <><Divider type="vertical" /><Popconfirm title='确认任务？'onConfirm ={()=>{ this.confirmHospGovern(text)}}><Tooltip title="确认"><FileDoneOutlined className="color-189" /></Tooltip></Popconfirm></> : null}
                            {record.canDelete ? <><Divider type="vertical" /><Popconfirm title='确认删除？' onConfirm={()=>{ this.deleteHospGovern(text) }}><Tooltip title="删除"><DeleteTwoTone /></Tooltip></Popconfirm></> : null}
                            {record.canReject ? <><Divider type="vertical" /><span style={spanstyle}><Link to={`/Layout/PathwayReport/Reject?Id=${text}`}><Tooltip title="拒绝"><StopOutlined className="span-189"/></Tooltip></Link></span></> : null}
                            {record.canComment ? <><Divider type="vertical" /><span style={spanstyle}><Link to={`/Layout/PathwayReport/Annotation?Id=${text}`}><Tooltip title="审核"><ZoomInOutlined className="span-189"/></Tooltip></Link></span></> : null}
                            {record.canUnComment ? <><Divider type="vertical" /><Popconfirm title='确认审核完毕？'onConfirm ={()=>{ this.commentGovern(text)}}><Tooltip title="确认审核"><CheckCircleOutlined className="span-189"/></Tooltip></Popconfirm></> : null}
                        </Space>
                    )
                }
            }
        ]
    }
    state= {
        status: "", //状态
        params: null, //get params

        showCreate: false, //是否展示新建
        showFillter: false, //是否展示map医院
        tabsdata: [
            { name: '新建任务', status: 'New'} , 
            { name: '已确认任务', status: 'Confirmed' },
            { name: '已拒绝任务', status: 'Reject'} , 
            { name: '已提交任务', status: 'Locked'} , 
        ],
        columns: [],
        opcolumn: [],
    }
  

    //医院主管删除
    deleteHospGovern = (id) => {
        const { status, params } = this.state; 
        this.props.DeletePathwayReport(id).then(res=> {
            message.success("删除成功！");
            this.props.GetPathwayReport({
                ...params,
                "Status": status,
            });
        }).catch(error => {
            message.warn("删除失败！");
        })
    }

    //确认任务
    confirmHospGovern = (id) => {
        const { status, params } = this.state;
        this.props.ConfirmPathwayReport(id).then(res => {
            this.props.GetPathwayReport({
                ...params,
                "Status": status,
            });
            message.success("确认成功！");
        }).catch(err => {
            message.error("确认失败！");
        })
    }
    componentDidMount() {
        const { roles } = this.props;
        if(_.includes(roles,"Hospital")){
            let tabs = [
                { name: '新建任务', status: 'New'} , 
                { name: '已确认任务', status: 'Confirmed' },
                { name: '已拒绝任务', status: 'Reject'} , 
                { name: '已提交任务', status: 'Locked'} , 
            ]
            let defaultStatus = _.head(tabs)["status"];
            this.setState({ 
                status: defaultStatus, 
                tabsdata: tabs, 
                columns: _.concat(this.columns1, this.columns2), 
                // columns: _.concat(this.columns0, this.columns1, this.columns2), 
                opcolumn: this.columnsHosp,
                showCreate: true,
                showFillter: false,
             });
            this.props.GetPathwayReport({
                "Status": defaultStatus,
            });
        }
        if(_.includes(roles,"Government")){
            let tabs = [
                { name: '已确认任务', status: 'Confirmed' },
                { name: '已拒绝任务', status: 'Reject'} , 
                { name: '已提交任务', status: 'Locked'} , 
            ]
            let defaultStatus = _.head(tabs)["status"];
            this.setState({ 
                status: defaultStatus, 
                tabsdata: tabs, 
                columns: _.concat(this.columns2), 
                // columns: _.concat(this.columns0, this.columns2), 
                opcolumn: this.columnsHosp,
                showCreate: false,
                showFillter: true,
            });
            this.props.GetPathwayReport({
                "Status": defaultStatus,
            });
            this.props.GetPathwayManangeInstitution();
        }
    }
    
    //new Tab改变
    onTabsChange = (status) => {
        this.setState({ status });
        this.props.GetPathwayReport({
            "Status": status,
        })
    }

    //tableChange获取data
    handleTableChange = (params) => {
        const { status } = this.state;
        this.setState({ params })
        this.props.GetPathwayReport({
            ...params,
            "Status": status,
        });
    }

    render() {
        const { loading, pathwayreports, total, institutions, columnrules } = this.props;
        const { tabsdata, columns, opcolumn, showCreate, showFillter } = this.state;
        return (
            <div className="content-card">
                <ReportPage  
                    showCreate = { showCreate }
                    loading= {loading}
                    pathwayReports= {pathwayreports}
                    showFillter = {showFillter}
                    tabsdata= { tabsdata }
                    columns= { columns }
                    opcolumn = { opcolumn }
                    columnrules = { columnrules } 
                    institutions = { institutions }
                    total = { total }
                    onTabsChange = { this.onTabsChange }
                    handleTableChange = { this.handleTableChange }
                />
            </div>
        )
    }
}
export default connect(
    state=>({
        pathwayreports: state.PathwayReportManage.pathwayreports,
        total: state.PathwayReportManage.total,
        loading: state.PathwayReportManage.loading,
        institutions: state.PathwayReportManage.institutions,
        columnrules: state.PathwayReportManage.columnrules,
        roles: state.Login.Auth.roles,
    }),
    dispatch => bindActionCreators({...actions},dispatch)
)(ManageMentPage)