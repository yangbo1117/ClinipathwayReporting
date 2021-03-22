import React, { Component, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { Table, Switch, Input, Radio, Tooltip, Space, Modal, Button, Row, Col } from "antd";
import { FileSearchOutlined, OrderedListOutlined, SearchOutlined } from "@ant-design/icons";

const { Search } = Input;
function FillterKeyWords(value, arr) {
    let newarr = [];
    if (value) {
        arr.forEach(element => {
            if (element.name.indexOf(value) > -1) {
                newarr.push(element);
            } else {
                if (element.children && element.children.length > 0) {
                    const ab = FillterKeyWords(value, element.children);
                    const obj = {
                        ...element,
                        children: ab
                    };
                    if (ab && ab.length > 0) {
                        newarr.push(obj);
                    }
                }
            }
        });
    } else {
        newarr = arr;
    }
    return newarr;
};

function FillterKeyWordsPaths(value, arr) {
    let newarr = [];
    if (value) {
        arr.forEach(element => {
            if (element.diseaseName.indexOf(value) > -1) {
                newarr.push(element);
            } else {
                if (element.children && element.children.length > 0) {
                    const ab = FillterKeyWordsPaths(value, element.children);
                    const obj = {
                        ...element,
                        children: ab
                    };
                    if (ab && ab.length > 0) {
                        newarr.push(obj);
                    }
                }
            }
        });
    } else {
        newarr = arr;
    }
    return newarr;
};

var time1 = null;
var time2 = null;
const ChangePaths = (props) => {
    const searchRef = useRef();
    const columns = [
        {
            title: '专业名称',
            dataIndex: 'name',
            key: 'name',
        },
        // {
        //     title: '是否开展专业',
        //     dataIndex: 'id',
        //     key: 'id',
        //     render: (text, record) => {
        //         return(
        //         record.hasChild ? null : <Switch checkedChildren="已开展" unCheckedChildren="未开展" onChange={(checked) => { this.ChangeSubject(checked, record) }} checked={record.enable}></Switch>
        //     )}
        // },
        {
            title: "操作",
            dataIndex: "id",
            key: "id",
            render: (text, record) => {
                return (
                    record.hasChild ? null : <Tooltip title="查看临床路径病种"><FileSearchOutlined className="span-href" onClick={() => { GetClinipath(text, record) }} /></Tooltip>
                )
            }
        }
    ];


    const [subjectTitle, setsubjectTitle] = useState("");
    const [searchSub, setsearchSub] = useState(null);
    const [searchPath, setsearchPath] = useState(null);

    const { loading1, loading2, subjects, paths, noStyle } = props;


    //开展临床路径专业
    const ChangeSubject = (checked, record) => {
        let node = [...props.subjects];
        props.ChangeSubject(checked, record.id, node);
        if (!record.hasChild) {
        } else {
            props.GetUserSubject();
        }
    }

    //获取临床路径病种
    const GetClinipath = (text, record) => {
        props.GetUserPaths(text);
        setsubjectTitle(record.name);
        setsearchPath(null);
        searchRef.current.state.value = "";
    }

    //开展病种
    const onRadioChange = (e, record) => {
        let value = e.target.value;
        props.ChangePath(value, record.id, paths);
    }

    useEffect(() => {
        props.GetUserSubject();
    }, []);

    //搜索SUBJECT
    const handleSearch = (value) => {
        if (value) {
            clearTimeout(time1);
            time1 = setTimeout(() => {
                setsearchSub(value);
            },200)
        } else {
            setsearchSub(null);
        }
    }

    //搜索病种
    const handleSearchPath = (value) => {
        if (value) {
            clearTimeout(time2);
            time2 = setTimeout(() => {
                setsearchPath(value);
            },200)
        } else {
            setsearchPath(null);
        }
    }

    useEffect(() => {
        if(subjects.length > 0){
            const subItem = subjects[0];
            props.GetUserPaths(subItem.id);
            setsubjectTitle(subItem.name)
        }
    },[subjects])

    const fillterSubjects = useMemo(() => {
        return FillterKeyWords(searchSub, subjects);
    }, [searchSub, subjects]);

    const fillterPaths = useMemo(() => {
        return FillterKeyWordsPaths(searchPath, paths)
    }, [searchPath, paths]);

    const pathcolumn = [
        {
            title: "临床路径病种名称",
            dataIndex: "diseaseName",
            key: "diseaseName",
        },
        {
            title: "是否开展临床路径病种",
            dataIndex: "enable",
            key: "enable",
            render: (text, record) => {
                return (
                    <Radio.Group name="radiogroup" value={text} onChange={(e) => { onRadioChange(e, record) }}>
                        <Radio value={true}>开展</Radio>
                        <Radio value={false}>未开展</Radio>
                    </Radio.Group>
                )
            }
        }
    ]

    return (
        <Fragment>
            <Row gutter={[36,36]}>
                <Col xs={24} sm={24} xl={12}>
                    <div className={noStyle ? "" : "content-card" }>
                        <Table
                            title={() => (
                                <Row>
                                    <Col  xs={24} sm={24} md={12} xl={12}>
                                        <span className="table-name-title">临床路径专业列表</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} xl={12}>
                                        <Search placeholder="搜索..." style={{ width: "100%" }} onSearch={handleSearch} allowClear prefix={<SearchOutlined />} />
                                    </Col>
                                </Row>
                            )}
                            bordered
                            rowKey="id"
                            loading={loading1}
                            pagination={{
                                responsive: true,
                                showSizeChanger: false,
                                pageSize: 10,
                            }}
                            dataSource={fillterSubjects}
                            columns={columns}
                            scroll={{ x: 453 }}
                        ></Table>
                    </div>
                </Col>
                <Col xs={24} sm={24} xl={12}>
                    <div className={noStyle ? "" : "content-card" }>
                        <Table
                            title={() => (
                                <Row>
                                    <Col xs={24} sm={24} md={12} xl={12}>
                                        <span className="title-b">{subjectTitle}</span>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} xl={12}>
                                        <Search placeholder="搜索..." style={{ width: "100%" }} ref={searchRef} onSearch={handleSearchPath} allowClear />
                                    </Col>
                                </Row>
                            )}
                            bordered
                            loading={loading2}
                            columns={pathcolumn}
                            pagination={{
                                showSizeChanger: false,
                                responsive: true,
                                pageSize: 10,
                            }}
                            dataSource={fillterPaths}
                            scroll={{ x: "max-content" }}
                        ></Table>
                    </div>
                </Col>
            </Row>

        </Fragment>
    )
}

export default connect(
    state => ({
        subjects: state.ClinicaPathwayChangePaths.subjects,
        loading1: state.ClinicaPathwayChangePaths.loading1,
        total: state.ClinicaPathwayChangePaths.total,
        loading2: state.ClinicaPathwayChangePaths.loading2,
        paths: state.ClinicaPathwayChangePaths.paths,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(ChangePaths);