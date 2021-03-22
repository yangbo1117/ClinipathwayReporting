import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import  { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { Row, Col, Input, Space, Table, Tooltip, Divider, Form, Modal, message } from "antd";
import { PlusOutlined, FormOutlined, DeleteTwoTone, SearchOutlined, CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import CreateContact from "./Create";
import EditContact from "./Edit";
import _ from "lodash";

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
class ContactPage extends Component{
    createForm = React.createRef();
    editForm = React.createRef();
    searchForm = React.createRef();
    constructor(props) {
        super(props)
        this.columns = [
            {
                title: "姓名",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "职位",
                dataIndex: "position",
                key: "position",
            },
            {
                title: "部门",
                dataIndex: "department",
                key: "department",
            },
            {
                title: "联系方式",
                dataIndex: "phone",
                key: "phone"
            },
        ];
        this.opcolumn = [
            {
                title: "操作",
                dataIndex: 'id',
                key: "id",
                render: (text,record) => {
                    return (
                        <Space>
                            <Tooltip title="编辑" onClick={() => { this.showEdit(record) }}><FormOutlined className="color-189"/></Tooltip>
                            <Divider type="vertical"></Divider>
                            <Tooltip title="删除"><DeleteTwoTone onClick={() => { this.DeleteContact(text) }} /></Tooltip>
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
        searchVal: null,
        sortedInfo: null,
        sorterVal: null,
        createVisable: false,
        editVisable: false,
        btnloading: false,
        id: '',
    }

    componentDidMount() {
        this.props.GetContact();
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

    CreateContact = (values) => {
        this.setState({ btnloading: true });
        this.props.CreateContact(values).then(res => {
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
            this.props.GetContact();
            this.createForm.current.resetFields();    
            this.setState({ btnloading: false, createVisable: false });
        }).catch(err => {
            message.error("新建失败！");
            this.setState({ btnloading: false, createVisable: false });
        })
    }
    
    //编辑
    showEdit = record => {
        this.setState({ editVisable: true, id: record.id }, () => {
            this.editForm.current.setFieldsValue( record );
        })
    }

    cancelEdit = () => { this.setState({ editVisable: false }) }

    EditContact = (values) => {
        const { id, pagination, searchVal, sorterVal } = this.state;
        this.setState({ btnloading: true });
        this.props.EditContact({...values, "id": id }).then(res => {
            message.success("编辑成功！");
            this.setState({ editVisable: false, btnloading: false });
            this.props.GetContact({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "Keyword": searchVal,
                "Sorting": sorterVal,
            });
        }).catch(error => {
            this.setState({ editVisable: false, btnloading: false });
            message.error("编辑失败！");
        })
    }

    //删除
    DeleteContact = (id) => {
        const { pagination, searchVal, sorterVal } = this.state;
        this.props.DeleteContact(id).then(res => {
            message.success('删除联系人成功！');
            this.props.GetContact({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "Keyword": searchVal,
                "Sorting": sorterVal,
            });
        }).catch(err => {
            message.error("删除联系人失败！");
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
        this.props.GetContact({
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
            this.props.GetContact({
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
            this.props.GetContact()
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

    render() {
        let { pagination, btnloading, createVisable, editVisable, sortedInfo } = this.state;
        sortedInfo = sortedInfo || {};
        const { contacts, loading, total, columnrules } = this.props;
        let concatColumns = this.AddColumnRules(this.columns, columnrules, this.opcolumn, sortedInfo);
        return (
            <Fragment>
                <Row>
                    <Col span={24} lg={24} xl={14}>
                    <div className="content-card">
                        <div className="flex-title">
                            <span className="table-name-title">联系人列表</span>
                            <div className="create-btn-s" onClick={ this.showCreate }>
                                <Space>
                                    <PlusOutlined />
                                    <span>新建联系人</span>
                                </Space>
                            </div>
                        </div>
                        <Table
                            title= {() => (
                                <Input placeholder="" onChange={ this.SearchChange } onPressEnter={ this.handleSearch } allowClear prefix={<SearchOutlined />} style={{ borderRadius: 6, maxWidth: 350, }}  />
                            )}
                            columns= { concatColumns }
                            loading = { loading }
                            dataSource= { contacts }
                            bordered
                            pagination={{
                                ...pagination,
                                total: total,
                                showSizeChanger: true,
                                responsive: true,
                                showTotal: (total, range) => (`展示第 ${range[0]} 项至第 ${range[1]} 项结果   总共 ${total} 项`),
                            }}
                            onChange = { this.handleTableChange }
                            scroll = {{ x: "max-content" }}
                        ></Table>
                    </div>
                    </Col>
                </Row>
                <Form name="carete" ref={this.createForm} {...layout} onFinish={ this.CreateContact }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">新建联系人</span></Space>}
                        visible={createVisable}
                        onCancel={this.cancelCreate}
                        getContainer={ false }
                        cancelText="取消"
                        okText="新建"
                        cancelButtonProps={{ icon: <CloseCircleOutlined />, onClick: this.cancelCreate,  }}
                        okButtonProps={{ icon: <CheckCircleOutlined />, type: "primary", htmlType: "submit", loading: btnloading }}
                    >
                        <CreateContact />
                    </Modal>
                </Form>
                <Form name="edit" {...layout} ref={this.editForm} onFinish={ this.EditContact }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">编辑联系人</span></Space>}
                        visible={ editVisable }
                        onCancel={this.cancelEdit}
                        getContainer={ false }
                        cancelText="取消"
                        okText="确定"
                        cancelButtonProps={{ icon: <CloseCircleOutlined />, onClick: this.cancelEdit,  }}
                        okButtonProps={{ icon: <CheckCircleOutlined />, type: "primary", htmlType: "submit", loading: btnloading }}
                    >
                        <EditContact />
                    </Modal>
                </Form>
            </Fragment>
        )
    }
}
export default connect(
    state => ({
        contacts: state.AccountContact.contacts,
        loading: state.AccountContact.loading,
        total: state.AccountContact.total,
        columnrules: state.AccountContact.columnrules,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(ContactPage);