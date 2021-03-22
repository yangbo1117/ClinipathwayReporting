import React, { Component, Fragment } from "react";
import {  Row, Col ,Table, Space, Divider, Tooltip, Form, Button, Modal, Typography, message, Input } from "antd";
import { FormOutlined, DeleteTwoTone, PlusCircleTwoTone, PlusOutlined, CloudDownloadOutlined, SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import { connect } from "react-redux";
import  { bindActionCreators } from "redux";
import * as actions from "./index.action";
import SubjectCreate from "./Create";
import SubjectEdit from "./Edit";
import FileSaver from "file-saver";

const { Text } = Typography;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};

function FillterKeyWords(value, arr){
    let newarr = [];
    if(value){
        arr.forEach(element => {
            let str = "";
            _.forIn(element, function(value, key){
                if(_.isString){
                    str += value
                }
            })
            if (str.indexOf(value) > -1) {
                newarr.push(element);
            } else {
            if (element.children && element.children.length > 0) {
                const ab = FillterKeyWords(value, element.children);
                const obj = {
                    ...element,
                    children: ab
                };
                if (ab && ab.length>0) {
                    newarr.push(obj);
                }
            }
          }
        });
    }else {
        newarr = arr;
    }
    return newarr;
};

class Subject extends Component{
    editForm = React.createRef();
    createForm = React.createRef();

    state= {
        opTitle: "",
        parentId: null,
        createVisable: false,
        editVisable: false,
        btnloading: false,
        itemdata: {},

        searchVal: null, //搜索
    }

    constructor(props) {
        super(props);
        this.columns =[
            {
                title: "专业名称",
                key: "name",
                dataIndex: "name",
                sorter: (a,b) => a.name.length - b.name.length,
            },
            {
                title: "专业类型",
                key: "type",
                dataIndex: "type",
                render: (text) => {
                    return (text === "Chinese" ? <span>中医</span> : <span>西医</span>)
                },
                sorter: (a,b) => a.type.length - b.type.length
            },
        ];
        this.opcolumn = [
            {
                title:"操作",
                dataIndex: "id",
                key: "id",
                render: (text,record)=>{
                    return (
                        <Space>
                            <Tooltip title="编辑" onClick={() => { this.showEdit(text, record) }}><FormOutlined className="color-189"/></Tooltip>
                            <Divider type="vertical"></Divider>
                            <Tooltip title="删除"><DeleteTwoTone onClick={() => { this.DeleteSub(text) }} /></Tooltip>
                            {
                                record.hasChild ? <Fragment>
                                    <Divider type="vertical"></Divider>
                                    <Tooltip title="新建下级专业"><span className="color-189"><PlusCircleTwoTone onClick={() => { this.showCreate(text, record) }} /></span></Tooltip>
                                </Fragment> : null
                            }
                        </Space>
                    )
                }
            }
        ]
    }

    componentDidMount() {
        this.props.GetSubject();
    }

    DeleteSub = (id) => {
        this.props.DeleteSubject(id, this.props);
    } 

    //新建
    showCreate = (text, record) => {
        if(_.isEmpty(record)) {
            this.setState({ createVisable: true, opTitle: "", parentId: null });
        }else {
            this.setState({ createVisable: true, opTitle: record.name, parentId: record.id });
        }
    }
    
    cancelCreate = () => {
        this.setState({ createVisable: false });
    }

    CreateSubject = (values) => {
        const { parentId } = this.state;
        this.setState({ btnloading: true });
        this.props.CreateSubject( {...values, "parentId": parentId } ).then(res => {
            message.success("新建成功！");
            this.props.GetSubject();
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
    showEdit = (id, record) => {
        this.setState({ editVisable: true, itemdata: record }, () => {
            this.editForm.current.setFieldsValue({
                "name": record.name,
            })
        })
    }

    cancelEdit = () => { this.setState({ editVisable: false }) }

    EditSubject = (values) => {
        const { itemdata } = this.state;
        this.setState({ btnloading: true });
        this.props.EditSubject({...itemdata, ...values }).then(res => {
            this.setState({ editVisable: false, btnloading: false });
            this.props.GetSubject();
            message.success("编辑成功！");
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

    //搜索
    handleSearch = (e) => {
        const value = e.target.value;
        if(value){
            this.setState({ searchVal: value });
        }
    }

    //重置
    SearchChange = (e) => {
        const value = e.target.value;
        if(_.isEmpty(value)){
            this.setState({ searchVal: null });
        }
    }

    DownLoadSubject = () => {
        this.props.DownLoadSubject().then((res) => {
            var file = new File([res], "临床路径专业.xlsx", {type: "application/octet-stream;charset=utf-8"});
            FileSaver.saveAs(file);
        }).catch(err => {
            message.error("下载失败！")
        })
    }

    render() {
        const { opTitle, createVisable, editVisable, btnloading, searchVal } = this.state;
        const { columnrules, subjects, loading } = this.props;
        let concatColumns = this.AddColumnRules(this.columns, columnrules);
        let fillterData = FillterKeyWords(searchVal, subjects);
        return(
            <Fragment>
                <Row gutter={[24, 24]}>
                    <Col  xs={{span:24}} sm={{span:24}} xl={{span:16}} xxl={{span:14}}>
                        <div className='content-card'>
                            <div className="flex-title">
                                <span className="table-name-title ">临床路径专业列表</span>
                                <div className="create-btn-s" onClick={() => { this.showCreate(null, null)}}>
                                    <Space>
                                        <PlusOutlined />
                                        <span>新建临床路径专业</span>
                                    </Space>
                                </div>
                            </div>
                            <Table
                                title={() => (
                                    <div className="flex-space-between">
                                        <Input placeholder="" onChange={ this.SearchChange } onPressEnter={ this.handleSearch } allowClear prefix={<SearchOutlined />} style={{ borderRadius: 6, maxWidth: 350, }}  />
                                        <Button type="primary" style={{borderRadius: 8}} className="space-margin4" icon={<CloudDownloadOutlined />} onClick={ this.DownLoadSubject }>下载临床路径专业</Button>
                                    </div>
                                )}
                                bordered
                                pagination={{
                                    responsive: true,
                                }}
                                loading = { loading }
                                dataSource = { fillterData }
                                columns = { concatColumns }
                                scroll= {{ x: "max-content" }}
                            ></Table>
                        </div>
                    </Col>
                </Row>
                <Form name="carete" ref={ this.createForm } {...layout} onFinish={ this.CreateSubject }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">新建临床路径专业</span>: <Text strong underline type="danger" >{opTitle}</Text></Space>}
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
                        <SubjectCreate />
                    </Modal>
                </Form>
                <Form name="edit" {...layout} ref={this.editForm} onFinish={ this.EditSubject }>
                    <Modal
                        title= {<Space><FormOutlined /><span className="title-b">编辑临床路径专业</span></Space>}
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
                        <SubjectEdit />
                    </Modal>
                </Form>
            </Fragment>
        )
   }
}
export default connect(
    state => ({
        subjects: state.ClinicaPathwaySubject.subjects,
        loading: state.ClinicaPathwaySubject.loading,
        columnrules: state.ClinicaPathwaySubject.columnrules,
    }),
    dispatch => bindActionCreators({...actions}, dispatch)
)(Subject);
