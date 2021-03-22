import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import  { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { Row, Col, Input, Space, Table, Tooltip, Divider, Form, Button, Modal, message, Tag, Card, Typography, Popconfirm } from "antd";
import { PlusOutlined, FormOutlined, DeleteTwoTone, FileTextOutlined, DoubleRightOutlined, SearchOutlined } from "@ant-design/icons";
import CreateAnnouncement from "./Create";
import EditAnnouncement from "./Edit";
import _ from "lodash";
import { baseurl } from "src/urls";

const { Paragraph } = Typography;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

class AnnouncementPage extends Component{
    createForm = React.createRef();
    editForm = React.createRef();

    createchild = React.createRef();
    editchild = React.createRef();
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "公告标题",
                dataIndex: "header",
                key:"header",
                ellipsis: true,
            },
            {
                title: "公告内容",
                dataIndex: "content",
                key: "content",
                ellipsis: true,
            },
            {
                title: "附件列表",
                dataIndex: "files",
                key: "files",
                ellipsis: true,
                render: (text) => {
                    let txt = null;
                    if(text){   
                        txt = text.map((i, index) => {
                            return <span key={index}>{i.fileName}/</span>
                        })
                    }
                    return <span>{txt}</span>
                },
            },
            {
                title: "创建时间",
                dataIndex: "creationTime",
                key: "creationTime",
                render: (text) => {
                    if(text) {
                        return <span>{ text.split("T")[0]}</span>
                    }
                }
            },
            {
                title: "上次更新",
                dataIndex: "lastModificationTime",
                key: "lastModificationTime",
                render: (text) => {
                    if(text){
                        return <span>{text.split("T")[0]}</span>
                    }
                }
            },
        ];
        this.opcolumn = [
            {
                title: "操作",
                dataIndex: "id",
                key: "id",
                render: (text, record) => {
                    return <Space>
                        <Tooltip title="编辑" onClick={() => { this.showEdit(record) }}><FormOutlined className="color-189"/></Tooltip>
                        <Divider type="vertical"></Divider>
                        <Popconfirm title="确认删除么？" onConfirm={() => { this.DeleteAnnouncement(text) }}><DeleteTwoTone /></Popconfirm>
                    </Space>
                }
            }
        ]
    }

    state = {
        pagination: {
            current: 1,
            pageSize: 10,
        },
        searchVal: null,
        sortedInfo: null,
        sorterVal: null,
        createVisable: false,
        editVisable: false,
        btnloading: false,
        id: '',
        //文件选择 用于删除
        filesList: []
    }

    componentDidMount() {
        this.props.GetAnnouncement();
    }

    //新建
    showCreate = () => {
        this.setState({
            createVisable: true,
        });  
    }

    cancelCreate = () => {
        this.createchild.clearnFiles();
        this.setState({ createVisable: false });
    }

    CreateAnnouncement = (values) => {
        let formdata = new FormData();
        formdata.append("header", values.header);
        formdata.append("content", values.content);
        if(this.createchild.state.fileList){
            _.forEach(this.createchild.state.fileList, function(o) {
                formdata.append("files", o);
            })
        }
        this.setState({ btnloading: true });
        this.props.CreateAnnouncement(formdata).then(res => {
            message.success("新建成功！");
            this.setState({
                sortedInfo: null,
                sorterVal: null,
                searchVal: null,
                pagination: {
                    current: 1,
                    pageSize: 10,
                }
            })
            this.props.GetAnnouncement();
            this.createForm.current.resetFields();  
            this.createchild.clearnFiles();  
            this.setState({ btnloading: false, createVisable: false });
        }).catch(err => {
            message.error("新建失败！");
            this.createchild.clearnFiles();
            this.setState({ btnloading: false, createVisable: false });
        });

    }
    
    //编辑
    showEdit = record => {
        this.setState({ editVisable: true, id: record.id, filesList: record.files }, () => {
            this.editForm.current.setFieldsValue( record );
        })
    }

    cancelEdit = () => { 
        this.editchild.clearnFiles();
        this.setState({ editVisable: false, filesList: [] }) 
    }

    EditAnnouncement = (values) => {
        const { id, pagination, searchVal, sorterVal } = this.state;
        let formdata = new FormData();
        formdata.append("header", values.header);
        formdata.append("content", values.content);
        if(!_.isEmpty(this.editchild.state.deletes)){
            _.forEach(this.editchild.state.deletes, function(o) {
                formdata.append("deletes", o);
            })
        }
        if(this.editchild.state.fileList){
            _.forEach(this.editchild.state.fileList, function(o) {
                formdata.append("files", o);
            })
        }
        this.setState({ btnloading: true });
        this.props.EditAnnouncement(id, formdata).then(res => {
            message.success("编辑成功！");
            this.setState({ editVisable: false, btnloading: false, filesList: [] });
            this.props.GetAnnouncement({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "Keyword": searchVal,
                "Sorting": sorterVal,
            });
            this.editchild.clearnFiles();
        }).catch(error => {
            this.editchild.clearnFiles();
            this.setState({ editVisable: false, btnloading: false, filesList: [] });
            message.error("编辑失败！");
        });
    }

    //删除
    DeleteAnnouncement = (id) => {
        const { pagination, searchVal, sorterVal } = this.state;
        this.props.DeleteAnnouncement(id).then(res => {
            message.success('删除公告成功！');
            this.props.GetAnnouncement({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "Keyword": searchVal,
                "Sorting": sorterVal,
            });
        }).catch(err => {
            message.error("删除公告失败！");
        })
    }

    handleTableChange = (pagination, filters, sorter) => {
        const { searchVal } = this.state;
        let Sorting = null;
        if( sorter.order === "ascend") {
            Sorting = `${sorter.columnKey} asc`;
        }
        if( sorter.order === "descend" ) {
            Sorting = `${sorter.columnKey} desc`;
        }
        this.setState({ 
            pagination: pagination, 
            sortedInfo: sorter,
            sorterVal: Sorting,
        });
        this.props.GetAnnouncement({
            "SkipCount": (pagination.current - 1) * pagination.pageSize,
            "MaxResultCount": pagination.pageSize,
            "Keyword": searchVal,
            "Sorting": Sorting,
        });
    }

    //搜索
    handleSearch = (e) => {
        const value = e.target.value;
        if(value){
            this.setState({ 
                searchVal: value,
                sortedInfo: null,
                sorterVal: null,
                pagination: { current: 1,  pageSize: 10 },
            });
            this.props.GetAnnouncement({
                "Keyword": value,
            });
        }
    }

    //重置
    SearchChange = (e) => {
        const value = e.target.value;
        if(_.isEmpty(value)){
            this.setState({
                sortedInfo: null,
                sorterVal: null,
                searchVal: null,
                pagination: {
                    current: 1,
                    pageSize: 10,
                }
            });
            this.props.GetAnnouncement()
        }
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

    //下载附件
    DownLoadFile = (fileName,id) => {
        // var a = document.createElement('a');
        // a.href = `${baseurl}/api/download/${id}`;
        // //a.download = fileName;
        // a.click();
  
        window.location.href= `${baseurl}/api/download/${id}`; 
        window.open(`${baseurl}/api/download/${id}`)
    }

    //展开
    expandedRowRender = (record) => {
        return (
            <Card title={record.header} extra={<DoubleRightOutlined />} style={{ width: '100%' }}>
                <Paragraph ellipsis={{ rows: 2, expandable: true, }}>
                    { record.content }
                    {
                        record.files.map((i, index) => {
                            return <Tag className="span-cursor" onClick={()=>{ this.DownLoadFile(i.fileName,i.id) }} key={index} icon={<FileTextOutlined />} color="orange">{i.fileName}</Tag>
                        })
                    }
                </Paragraph>
            </Card>
        )
    }

    render() {
        let { pagination, btnloading, createVisable, editVisable, sortedInfo, filesList } = this.state;
        sortedInfo = sortedInfo || {};
        const { announcements, loading, total, columnrules } = this.props;
        let concatColumns = this.AddColumnRules(this.columns, columnrules, this.opcolumn, sortedInfo);
        return (
            <Fragment>
                <Row>
                    <Col span={24}>
                    <div className="content-card">
                        <div className="card-table-title ">
                            <span className="table-name-title">公告信息列表</span>
                            <div className="create-btn" onClick={ this.showCreate }>
                                <Space>
                                    <PlusOutlined />
                                    <span>新建公告信息</span>
                                </Space>
                            </div>
                        </div>
                        <Table
                            title= {() => (
                                <Input placeholder="" onChange={ this.SearchChange } onPressEnter={ this.handleSearch } allowClear prefix={<SearchOutlined />} style={{ borderRadius: 6, maxWidth: 350, }}  />
                            )}
                            columns= { concatColumns }
                            loading = { loading }
                            dataSource= { announcements }
                            bordered
                            expandable={{
                                expandedRowRender: this.expandedRowRender,
                            }}
                            pagination={{
                                ...pagination,
                                responsive: true,
                                total: total,
                                showSizeChanger: true,
                                showTotal: (total, range) => (`展示第 ${range[0]} 项至第 ${range[1]} 项结果   总共 ${total} 项`),
                            }}
                            onChange = { this.handleTableChange }
                            scroll = {{ x: "max-content" }}
                        ></Table>
                    </div>
                    </Col>
                </Row>
                <Form name="carete" ref={this.createForm} {...layout} onFinish={ this.CreateAnnouncement }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">新建公告信息</span></Space>}
                        visible={createVisable}
                        onCancel={this.cancelCreate}
                        getContainer={ false }
                        footer={
                            [
                                <Button key="cancel" onClick={this.cancelCreate} >取消</Button>,
                                <Button key="submit" type="primary" htmlType="submit" loading={ btnloading }>新建</Button>
                            ]
                        }
                    >
                        <CreateAnnouncement onRef={(ref) => { this.createchild = ref }} />
                    </Modal>
                </Form>
                <Form name="edit" {...layout} ref={this.editForm} onFinish={ this.EditAnnouncement }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">编辑公告信息</span></Space>}
                        visible={ editVisable }
                        onCancel={this.cancelEdit}
                        getContainer={ false }
                        footer={
                            [
                                <Button key="cancel" onClick={this.cancelEdit} >取消</Button>,
                                <Button key="submit" type="primary" htmlType="submit" loading={ btnloading }>确定</Button>
                            ]
                        }
                    >
                        <EditAnnouncement filesNode={ filesList } onRef={(ref) => { this.editchild = ref }} />
                    </Modal>
                </Form>
            </Fragment>
        )
    }
}
export default connect(
    state => ({
        announcements: state.Announcement.announcements,
        loading: state.Announcement.loading,
        total: state.Announcement.total,
        columnrules: state.Announcement.columnrules,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(AnnouncementPage);