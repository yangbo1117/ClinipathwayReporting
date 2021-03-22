import React, { Fragment } from 'react';
import { Row, Col, Table, Space, Divider, Tag, Form, Button, message, Tooltip, Modal, Typography, Popconfirm } from 'antd';
import {  PlusOutlined, DeleteTwoTone, FormOutlined, PlusCircleTwoTone } from "@ant-design/icons";  
import * as actions from './index.action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import _ from "lodash";
import InstitutionCreate from "./Create";
import InstitutionEdit from "./Edit";

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const { Text } = Typography;

class InstitutionPage extends React.Component{
    editForm = React.createRef();

    constructor(props){
        super(props);
        this.columns = [
            {
                title: "机构名称",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "类型",
                dataIndex: "type",
                key: "type",
                render: (text) => {
                    switch(text)
                    {
                        case "Association":
                            return <Tag color="#108ee9">医院协会</Tag>;
                        case "Government":
                            return <Tag color="#2DB7F5">主管部门</Tag>;
                        case "Hospital":
                            return <Tag color="#87d068">医院机构</Tag>;
                        default:
                            return <Tag>{text}</Tag>
                    }
                }
            },
            {
                title: "机构简称",
                dataIndex: "simplifiedName",
                key: "simplifiedName",
            },
            {
                title: "市精神中心",
                dataIndex: "isCenter",
                key: "isCenter",
                render: (text, record) => {
                    if(record.type === "Hospital") return(text ? <Tag color="#f50">是</Tag> : <Tag color="#cecece">否</Tag>)
                },
            },
            {
                title:"医院等级",
                dataIndex: "class",
                key: "key",
                render: (text) => {
                    switch(text) {
                        case "FirstGeneral":
                            return <span>一级综合</span>
                        case "FirstSpecialist":
                            return <span>一级专科</span>
                        case "SecondGeneral":
                            return <span>二级综合</span>
                        case "SecondSpecialist":
                            return <span>二级专科</span>
                        case "ThirdGeneral":
                            return <span>三级综合</span>
                        case "ThirdSpecialist":
                            return <span>三级专科</span>
                        case "Others":
                            return <span>其他</span>
                        default:
                            return <span></span>
                    }
                }
            },
            {
                title: "创建时间",
                dataIndex: "creationTime",
                key: "creationTime",
                render:(text) => {
                    let  arr = text.split("T");
                    return <span>{arr[0]}</span>
                },
                sorter: (a,b) => {
                    let dateA = new Date(a.creationTime);
                    let dateB = new Date(b.creationTime);
                    return dateA.getTime() - dateB.getTime();
                }
            },
        ];
        this.opcolumn = [
            {
                title: "操作",
                dataIndex: "id",
                key: "id",
                render: (text, record) => {
                    let isTrue = false;
                    return <Space>
                        <Tooltip title="编辑" onClick={ () => { 
                                if(record.type === "Hospital"){
                                    isTrue = true;
                                }
                                this.showEdit(record, isTrue); 
                            }}><FormOutlined className="color-189"/>
                        </Tooltip>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确认删除该机构？"
                            onConfirm={() => { this.DeleteInstitution(text) }}
                        >
                            <Tooltip title="删除"><DeleteTwoTone /></Tooltip>
                        </Popconfirm>
                        {
                            record.type === "Hospital" ? null : (
                                <Fragment>
                                    <Divider type="vertical"></Divider>
                                    <Tooltip title="新建下级机构">
                                        <span className="color-189">
                                            <PlusCircleTwoTone 
                                            onClick={() => { 
                                                if(record.type === "Government"){
                                                    isTrue = true;
                                                }
                                                this.showCreate(record, isTrue);
                                            }} />
                                        </span>
                                    </Tooltip>
                                </Fragment>
                            ) 
                        }
                    </Space>
                }
            }
        ]
    }
    state = {
        opTitle: "",
        parentId: null,
        IsHosp: false,
        createVisable: false,
        editVisable: false,
        btnloading: false,
        itemdata: {},
        sortedInfo: null, //排序
    }    

    componentDidMount() {
        this.props.GetInstitution();
        this.props.GetClasses();
    }

    //删除
    DeleteInstitution = (id) => {
        this.props.DeleteInstitution(id).then(res => {
            this.props.GetInstitution();
            message.success("删除成功！");
        }).catch(err => {
            message.error("删除失败！");
        })
    }

    //新建
    showCreate = (record, bl) => {
        if(_.isEmpty(record)) {
            this.setState({ createVisable: true, opTitle: "", parentId: null, IsHosp: bl });
        }else {
            this.setState({ createVisable: true, opTitle: record.name, parentId: record.id, IsHosp: bl });
        }
    }
    
    cancelCreate = () => {
        this.setState({ createVisable: false });
    }

    CreateInstitution = (values) => {
        const { parentId } = this.state;
        this.setState({ btnloading: true });
        this.props.CreateInstitution( {...values, "parentId": parentId } ).then(res => {
            message.success("新建成功！");
            this.props.GetInstitution();
            this.setState({ btnloading: false, createVisable: false });
        }).catch(err => {
            message.error("新建失败！");
            this.setState({ btnloading: false, createVisable: false });
        })
    }
    
    //编辑
    showEdit = (record, bl) => {
        this.setState({ editVisable: true, itemdata: record, IsHosp: bl }, () => {
            this.editForm.current.setFieldsValue({
                "name": record.name,
                "class": record.class,
                "simplifiedName": record.simplifiedName,
                "isCenter": record.isCenter,
            })
        })
    }

    cancelEdit = () => { this.setState({ editVisable: false }) }

    EditInstitution = (values) => {
        const { itemdata } = this.state;
        // let newItem = {...itemdata, ...values };
        this.setState({ btnloading: true });
        this.props.EditInstitution({...itemdata, ...values }).then(res => {
            this.setState({ editVisable: false, btnloading: false });
            this.props.GetInstitution();
            message.success("编辑成功！");
        }).catch(error => {
            this.setState({ editVisable: false, btnloading: false });
            message.error("编辑失败！");
        })
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
                }
            }else {
                return {
                    ...i,
                    sorter: false,
                };
            }
        });
        return _.concat(result, this.opcolumn);
    }
    
    render() {
        let { opTitle, createVisable, editVisable, btnloading, IsHosp, sortedInfo } = this.state;
        const { institutions, classes, loading, columnrules } = this.props;
        let concatColumns = this.AddColumnRules(this.columns, columnrules, sortedInfo);
        return(
            <Fragment>
                <Row gutter={[16, 16]}>
                    <Col span={24} lg={24}>
                        <div className="content-card">
                            <Table
                                loading={ loading }
                                title={ () => (
                                    <div className="flex-space-between">
                                        <span className="table-name-title">机构列表</span>
                                        <div className="create-btn" onClick={() => { this.showCreate(null, false) }}>
                                            <Space>
                                                <PlusOutlined />
                                                <span>新建机构</span>
                                            </Space>
                                        </div>
                                    </div>
                                )}
                                columns = { concatColumns }
                                dataSource = { institutions }
                                pagination={{
                                    responsive: true,
                                }}
                                scroll={{x: "max-content"}}
                                bordered
                                expandable = {{
                                    // defaultExpandedRowKeys: [],
                                }}
                            />
                        </div>
                    </Col>
                </Row>
                <Form name="carete" {...layout} onFinish={ this.CreateInstitution }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">所属机构</span>: <Text strong type="danger" >{opTitle}</Text></Space>}
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
                        <InstitutionCreate classes={ classes } IsHosp={ IsHosp } />
                    </Modal>
                </Form>
                <Form name="edit" {...layout} ref={this.editForm} onFinish={ this.EditInstitution }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">编辑机构</span></Space>}
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
                        <InstitutionEdit classes={ classes } IsHosp={ IsHosp } />
                    </Modal>
                </Form>
            </Fragment>
        )
    }

}
export default connect(
    state=>({
        institutions: state.Institution.institutions,
        classes: state.Institution.classes,
        loading: state.Institution.loading,
        columnrules: state.Institution.columnrules,
    }),
    dispatch => bindActionCreators({...actions},dispatch)
)(InstitutionPage);