import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import  { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { Table, Tooltip, Space, Divider, Input, Typography, message, Form, Modal, Menu, Dropdown, Switch, Popconfirm } from "antd";
import { FormOutlined, DeleteTwoTone, PlusOutlined, DownOutlined, ClusterOutlined, ReloadOutlined, LockOutlined, CheckOutlined, SearchOutlined, CloseOutlined, CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import UserCreate from "./Create";
import UserEdit from "./Edit";
import UserManage from "./Manage";
import CheckPassword from "./CheckPassword";
import _ from "lodash";
const { Text } = Typography;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
class UsersPage extends Component{
    editForm = React.createRef();
    createForm = React.createRef();
    manaForm = React.createRef();
    checkForm = React.createRef();
    childRef = React.createRef();

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "用户名",
                dataIndex: "userName",
                key: "userName",
                render: (text) => (<Text strong mark>{text}</Text>)
            },
            {
                title: "昵称",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "所属机构",
                dataIndex: "organizationUnitName",
                key: "organizationUnitName",
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
            {
                title: "邮箱",
                dataIndex: "email",
                key: "email",
            },
            {
                title: "设定为管理员",
                dataIndex:  "isAdmin",
                key: 'isAdnin',
                render: (text,record) => (
                    <Switch
                        checked= {text}
                        size= "small"
                        onChange= { (checked)=> { this.setAdmin(checked,record.id) } }
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                    />
                )
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
                        {
                            true ? (
                                <Popconfirm title="确定删除？" onConfirm={() => { this.DeleteUser(text) }}>
                                    <DeleteTwoTone />
                                </Popconfirm>
                            ) : (
                                <Tooltip title="该用户不可删除"><DeleteTwoTone className="span-href"/></Tooltip>
                            )
                        }
                        <Divider type="vertical"></Divider>
                        <Dropdown placement="bottomCenter" trigger={['click']} overlay={() => (
                            <Menu>
                                <Menu.Item key="3" icon={<LockOutlined />} onClick={() => { this.showCheck(record) }}>修改密码</Menu.Item>
                                <Menu.Item key="1" icon={<ClusterOutlined />} onClick={() => { this.showManage(text) }}>分配机构</Menu.Item>
                                <Menu.Item key="2" icon={<ReloadOutlined />} onClick={() => { this.clearnManage(text) }}>清空所属机构</Menu.Item>
                            </Menu>
                        )}>
                            <span className="span-href">更多<DownOutlined /></span>
                        </Dropdown>
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
        sorterVal: null,
        searchVal: null,

        btnloading: false,
        createVisable: false, //创建
        editVisable: false, //编辑
        manageVisable: false, //分配
        checkVisable: false, //修改密码
        id: "",
        userInfo: {},
    }

    //设置管理员
    setAdmin = (checked,id) => {
        const { userId } = this.props;
        const { pagination, searchVal, sorterVal } = this.state;
        let sendparams = {
            "SkipCount": (pagination.current - 1) * pagination.pageSize,
            "MaxResultCount": pagination.pageSize,
            "Filter": searchVal,
            "Sorting": sorterVal,
        };
        if(checked){
            this.props.setAdmin(id, { "roleNames": ["Admin"] }).then(res => {
                message.success("设置成功！");
                this.props.GetUsers(sendparams);
            }).catch(err => {
                message.error("设置失败！");
            })
        }else{
            this.props.setAdmin(id, { "roleNames": [] }).then(res => {
                message.success("设置成功！");
                if(id === userId) {
                    this.props.LoginOut();
                    setTimeout(()=>{
                        message.warn("身份信息过期，请重新登录！");
                        this.props.history.push('/Login');
                        localStorage.removeItem("persist:root");
                    },500)
                }else{
                    this.props.GetUsers(sendparams);
                }
            }).catch(err => {
                message.error("设置失败！");
            })
        }
    }
    
    //删除
    DeleteUser = id => {
        const { pagination, searchVal, sorterVal } = this.state;
        this.props.DeleteUser(id).then(res => {
            message.success("删除用户成功！");
            this.props.GetUsers({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "Filter": searchVal,
                "Sorting": sorterVal,
            });
        }).catch(err => {
            let msg = "删除失败！";
            if(err.data) {
                msg = err.data.error.message;
            }
            message.error(msg);
        })
    }
    //新建
    showCreate = () => {
        this.setState({
            createVisable: true,
        });
        this.childRef.current.clearnCheckPassword();
    }
    cancelCreate = () => {
        this.setState({ createVisable: false })
    }
    
    CreateUser = (values) => {
        this.setState({ btnloading: true });
        this.props.CreateUser( values ).then(res => {
            message.success("新建成功！");
            this.setState({
                searchVal: null,
                sortedInfo: null,
                sorterVal: null,
                pagination: {
                    current: 1,
                    pageSize: 10,
                },
            })
            this.props.GetUsers();
            this.createForm.current.resetFields();    
            this.setState({ btnloading: false, createVisable: false });
        }).catch(err => {
            const msg = err.data.error.message;
            message.error(msg);
            this.setState({ btnloading: false, createVisable: false });
        })
    }
    
    //编辑
    showEdit = record => {
        this.setState({ editVisable: true, id: record.id, userInfo: record }, () => {
            this.editForm.current.setFieldsValue( record );
        })
    };

    cancelEdit = () => { this.setState({ editVisable: false }) };

    //编辑
    EditUser = (values) => {
        const { id, pagination, searchVal, sorterVal, userInfo } = this.state;
        this.setState({ btnloading: true });
        this.props.EditUser({...values, "id": id, "concurrencyStamp": userInfo.concurrencyStamp }).then(res => {
            message.success("编辑成功！");
            this.setState({ editVisable: false, btnloading: false });
            this.props.GetUsers({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "Filter": searchVal,
                "Sorting": sorterVal,
            });
        }).catch(error => {
            this.setState({ editVisable: false, btnloading: false });
            message.error("编辑失败！");
        })
    };

    //分配管理
    showManage = id => {
        this.props.GetInstitutionUser(id).then(res => {
            this.setState({ manageVisable: true, id: id },()=>{
                this.manaForm.current.setFieldsValue({"parentId": res.id});
            });
        }).catch(err => {
            this.setState({ manageVisable: true, id: id }, ()=>{
                this.manaForm.current.setFieldsValue({"parentId": ""});
            });
        })
    }

    cancelManage = () => { this.setState({ manageVisable: false }) }

    //分配
    ManageUser = (values) => {
        const { id, pagination, sorterVal, searchVal } = this.state;
        this.setState({ btnloading: true });
        this.props.ManageUser({...values, "id": id }).then(res => {
            message.success("分配成功！");
            this.setState({ manageVisable: false, btnloading: false });
            this.props.GetUsers({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "Filter": searchVal,
                "Sorting": sorterVal,
            });
        }).catch(error => {
            this.setState({ manageVisable: false, btnloading: false });
            message.error("分配失败！");
        })
    }

    //修改密码
    showCheck = (record) => {
        this.setState({ checkVisable: true }, ()=>{
            this.checkForm.current.setFieldsValue({ "userName": record.userName })
        });
    }

    cancelCheck = () => { this.setState({ checkVisable: false }) };

    checkUserPassword = (values) => {
        this.setState({ btnloading: true });
        this.props.checkUserPassword(values).then(res => {
            this.setState({ checkVisable: false, btnloading: false });
            message.success("修改成功！");
        }).catch(err => {
            this.setState({ checkVisable: false, btnloading: false });
            message.error("修改失败！");
        })
    }

     //清空分配
    clearnManage = id => {
        const { pagination, sorterVal, searchVal } = this.state;
        this.props.ClearnManageUser(id).then(res => {
            message.success("解除分配成功！");
            this.props.GetUsers({
                "SkipCount": (pagination.current - 1) * pagination.pageSize,
                "MaxResultCount": pagination.pageSize,
                "Filter": searchVal,
                "Sorting": sorterVal,
            });
        }).catch(err => {
            message.error("解除分配失败！");
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
        this.props.GetUsers({
            "SkipCount": (pagination.current - 1) * pagination.pageSize,
            "MaxResultCount": pagination.pageSize,
            "Filter": searchVal,
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
                pagination: {
                    current: 1,
                    pageSize: 10,
                },
            });
            this.props.GetUsers({
                "Filter": value,
            });
        }
    }

    //重置
    SearchChange = (e) => {
        const value = e.target.value;
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
            this.props.GetUsers()
        }
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

    componentDidMount() {
        this.props.GetUsers();
        this.props.GetInstitution();
    }

    render() {
        const { users, total, institutions, loading, columnrules } = this.props;
        let { createVisable, editVisable, manageVisable, checkVisable, btnloading, pagination, sortedInfo } = this.state;
        sortedInfo = sortedInfo || {};
        let concatColumns = this.AddColumnRules(this.columns, columnrules, sortedInfo);
        return (
            <Fragment>
                <div className="content-card">
                    <div className="flex-title">
                        <span className="table-name-title">用户列表</span>
                        <div className="create-btn" onClick={ this.showCreate }>
                            <Space>
                                <PlusOutlined />
                                <span>新建用户</span>
                            </Space>
                        </div>
                    </div>
                    <Table
                        title= {() => (
                            <Input placeholder="" onChange={ this.SearchChange } onPressEnter={ this.handleSearch } allowClear prefix={<SearchOutlined />} style={{ borderRadius: 6, maxWidth: 350, }}  />
                        )}
                        loading= { loading }
                        columns= { concatColumns }
                        dataSource= { users }
                        bordered
                        pagination={{
                            ...pagination,
                            total: total,
                            responsive: true,
                            showSizeChanger: true,
                            showTotal: (total, range) => (`展示第 ${range[0]} 项至第 ${range[1]} 项结果   总共 ${total} 项`),
                        }}
                        scroll = {{ x: "max-content" }}
                        onChange={this.handleTableChange}
                    ></Table>
                </div>
                <Form name="carete" ref={this.createForm} {...layout} onFinish={ this.CreateUser }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">新建用户</span></Space>}
                        visible={createVisable}
                        onCancel={this.cancelCreate}
                        getContainer={ false }
                        cancelText="取消"
                        okText="新建"
                        cancelButtonProps={{ icon: <CloseCircleOutlined />, onClick: this.cancelCreate,  }}
                        okButtonProps={{ icon: <CheckCircleOutlined />, type: "primary", htmlType: "submit", loading: btnloading }}
                    >
                        <UserCreate childRef={this.childRef} />
                    </Modal>
                </Form>
                <Form name="edit" {...layout} ref={this.editForm} onFinish={ this.EditUser }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">编辑用户</span></Space>}
                        visible={ editVisable }
                        onCancel={this.cancelEdit}
                        getContainer={ false }
                        cancelText="取消"
                        okText="修改"
                        cancelButtonProps={{ icon: <CloseCircleOutlined />, onClick: this.cancelEdit,  }}
                        okButtonProps={{ icon: <CheckCircleOutlined />, type: "primary", htmlType: "submit", loading: btnloading }}
                    >
                        <UserEdit />
                    </Modal>
                </Form>
                <Form name="manage" {...layout} ref={this.manaForm} onFinish={ this.ManageUser }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">分配机构</span></Space>}
                        visible={ manageVisable }
                        onCancel={this.cancelManage }
                        getContainer={ false }
                        cancelText="取消"
                        okText="确定"
                        cancelButtonProps={{ icon: <CloseCircleOutlined />, onClick: this.cancelManage,  }}
                        okButtonProps={{ icon: <CheckCircleOutlined />, type: "primary", htmlType: "submit", loading: btnloading }}
                    >
                        <UserManage data={ institutions } />
                    </Modal>
                </Form>
                <Form name="check" {...layout} ref={this.checkForm} onFinish={ this.checkUserPassword }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">修改密码</span></Space>}
                        visible={ checkVisable }
                        onCancel={this.cancelCheck }
                        getContainer={ false }
                        cancelText="取消"
                        okText="确定"
                        cancelButtonProps={{ icon: <CloseCircleOutlined />, onClick: this.cancelCheck,  }}
                        okButtonProps={{ icon: <CheckCircleOutlined />, type: "primary", htmlType: "submit", loading: btnloading }}
                    >
                        <CheckPassword />
                    </Modal>
                </Form>
            </Fragment>
        )
    }
}

export default connect(
    state => ({
        users: state.AccountUser.users,
        loading: state.AccountUser.loading,
        total: state.AccountUser.total,
        institutions: state.AccountUser.institutions,
        columnrules: state.AccountUser.columnrules,
        userId: state.Login.Auth.userId,
    }),
    dispatch => bindActionCreators ({ ...actions }, dispatch)
)(UsersPage);