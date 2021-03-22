import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import  { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { Table, Tooltip, Space, Divider, Input, Modal, Form, Button, message, Popconfirm } from "antd";
import { FormOutlined, DeleteTwoTone, PlusOutlined, CloudDownloadOutlined, SearchOutlined } from "@ant-design/icons";
// import SelectCpt from "components/SelectCpt";
import _ from "lodash";
import CliniPathCreate from "./Create";
import CliniPathEdit from "./Edit";
import FileSaver from "file-saver";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};
class CliniPath extends Component{
    editForm = React.createRef();
    createForm = React.createRef();
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "临床路径病种名称",
                dataIndex: "diseaseName",
                key: "diseaseName",
            },
            {
                title: "临床路径专业",
                key: "subjects",
                dataIndex: "subjects",
                render: (text) => {
                    let subText= "";
                    if(!_.isEmpty(text)) {
                        subText = _.map(text, function(t) {
                            return t.name
                        }).join("/");
                    }
                    return <span>{subText}</span>
                }
            },
            {
                title: "创建时间",
                dataIndex: "creationTime",
                key: "creationTime",
                render: (text) => {
                    let txt;
                    text ? txt= text.split("T")[0] : txt= "";
                    return <span>{txt}</span>
                }
            },
            {
                title: "上次更新",
                dataIndex: "lastModificationTime",
                key: "lastModificationTime",
                render: (text)=> {
                    let txt;
                    text ? txt= text.split("T")[0] :  txt= "";
                    return <span>{txt}</span>
                }
            },
        ];
        this.opcolumn = [
            {
                title: "操作",
                dataIndex: "id",
                key: "id",
                render: (text, record) => (
                    <Space>
                        <Tooltip title="编辑" onClick={() => { this.showEdit(record) }}><FormOutlined className="color-189"/></Tooltip>
                        <Divider type="vertical"></Divider>
                        <Popconfirm title="确认删除？" onConfirm={() => { this.DeleteClinipath(text) }}>
                            <Tooltip title="删除"><DeleteTwoTone/></Tooltip>
                        </Popconfirm>
                    </Space>
                )
            }
        ]
    }

    state = {
        pagination: {
            current: 1,
            pageSize: 10,
        },
        sortedInfo: null,
        searchVal: null, //keywords
        sorterVal: null, //排序
        btnloading: false,
        createVisable: false, //创建
        editVisable: false, //编辑
        id: "",
        
    }
    
    //删除
    DeleteClinipath = id => {
        const { pagination, searchVal, sorterVal } = this.state;
        this.props.DeleteClinipath(id).then(res => {
            message.success("删除成功！");
            this.props.GetCliniPath({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "Keyword": searchVal,
                "Sorting": sorterVal,
            });
        }).catch( err => {
            message.error("删除失败！");
        })
    }
    
    //新建
    showCreate = () => {
        this.setState({
            createVisable: true,
        })
    }
    cancelCreate = () => {
        this.setState({ createVisable: false })
    }
    
    CreateClinipath = (values) => {
        this.setState({ btnloading: true });
        this.props.CreateCliniPath( values ).then(res => {
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
            this.props.GetCliniPath();
            this.createForm.current.resetFields();
            this.setState({ btnloading: false, createVisable: false });
        }).catch(error => {
            let text = "新建失败！";
            if (error.data) {
                if (error.data.error) {
                    if (error.data.error) {
                        text = error.data.error.message;
                    }
                }
            };
            message.error(text);
            this.setState({ btnloading: false, createVisable: false });
        })
    }
    
    //编辑
    showEdit = record => {
        this.setState({ editVisable: true, id: record.id }, () => {
            this.editForm.current.setFieldsValue({
                "subjectId": _.last(record.subjects).id,
                "diseaseName": record.diseaseName,
            })
        })
    }

    cancelEdit = () => { this.setState({ editVisable: false }) }

    EditClinipath = (values) => {
        const { id, pagination, searchVal, sorterVal } = this.state;
        this.setState({ btnloading: true });
        this.props.EditClinipath({...values, "id": id }, this.props).then(res => {
            message.success("编辑成功！");
            this.setState({ editVisable: false, btnloading: false });
            this.props.GetCliniPath({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "Keyword": searchVal,
                "Sorting": sorterVal,
            });
        }).catch(error => {
            let text = "编辑失败！";
            if (error.data) {
                if (error.data.error) {
                    if (error.data.error) {
                        text = error.data.error.message;
                    }
                }
            };
            this.setState({ editVisable: false, btnloading: false });
            message.error(text);
        })
    }

    // ------
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
        this.props.GetCliniPath({
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
            this.props.GetCliniPath({
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
            this.props.GetCliniPath()
        }
    }

    componentDidMount() {
        this.props.GetCliniPath()
        this.props.GetSubjects();
    }

    //增加columns排序
    AddColumnRules = (columns, rules, sortedInfo, filteredInfo) => {
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
        return _.concat(result, this.opcolumn);
    }

    //下载临床路径
    DownloadPaths = () => {
        this.props.DownLoadPaths().then(res => {
            var file = new File([res], "临床路径列表.xlsx", {type: "application/octet-stream;charset=utf-8"});
            FileSaver.saveAs(file);
        }).catch(error => {
            message.error("下载失败！");
        })
    }

    render() {
        const { clinipaths, total, subjects, loading, columnrules } = this.props;
        let { createVisable, editVisable, btnloading, pagination, sortedInfo } = this.state;
        sortedInfo = sortedInfo || {};
        let concatColumns = this.AddColumnRules(this.columns, columnrules, sortedInfo);
        return (
            <Fragment>
                <div className="content-card">
                    <div className="flex-title ">
                        <span className="table-name-title">临床路径病种列表</span>
                        <div className="create-btn" onClick={ this.showCreate }>
                            <Space>
                                <PlusOutlined />
                                <span>新建临床路径病种</span>
                            </Space>
                        </div>
                    </div>
                    <Table
                        title= {() => (
                            <div className="flex-space-between">
                                <Input placeholder="" onChange={ this.SearchChange } onPressEnter={ this.handleSearch } allowClear prefix={<SearchOutlined />} style={{ borderRadius: 6, maxWidth: 350, }}  />
                                <Button type="primary" style={{borderRadius: 8}} className="space-margin4" icon={<CloudDownloadOutlined />} onClick={ this.DownloadPaths }>下载所有临床路径</Button>
                            </div>
                        )}
                        bordered
                        loading={ loading }
                        columns= { concatColumns }
                        dataSource= { clinipaths }
                        pagination={{
                            ...pagination,
                            total: total,
                            responsive: true,
                            showSizeChanger: true,
                            showTotal: (total, range) => (`展示第 ${range[0]} 项至第 ${range[1]} 项结果   总共 ${total} 项`),
                        }}
                        onChange={this.handleTableChange}
                        scroll = {{ x: "max-content" }}
                    ></Table>
                </div>
                <Form name="carete" {...layout} ref={ this.createForm } onFinish={ this.CreateClinipath }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">新建临床路径病种</span></Space>}
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
                        <CliniPathCreate
                            subjects = { subjects }
                        />
                    </Modal>
                </Form>
                <Form name="edit" {...layout} ref={this.editForm} onFinish={ this.EditClinipath }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">编辑临床路径病种</span></Space>}
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
                        <CliniPathEdit
                            subjects = { subjects }
                        />
                    </Modal>
                </Form>
            </Fragment>
        )
    }
}

export default connect(
    state => ({
        clinipaths: state.ClinicaPathwayCliniPath.clinipaths,
        total: state.ClinicaPathwayCliniPath.total,
        subjects: state.ClinicaPathwayCliniPath.subjects,
        loading: state.ClinicaPathwayCliniPath.loading,
        columnrules: state.ClinicaPathwayCliniPath.columnrules,
    }),
    dispatch => bindActionCreators({...actions}, dispatch)
)(CliniPath);