import React, { Axios, useState, useEffect, useRef, useContext } from 'react';
import { Table, Row, Col, DatePicker, Card, Typography, Form, Button, Space, message, InputNumber, Tooltip, notification, Radio } from 'antd';
import { columnGoven, columnHosp, columnClass, columnSubName, columnSubCnt, columnPathCnt, columnDiseases, columnPathName } from "assets/js/reportColumns";
import { InfoCircleTwoTone } from "@ant-design/icons";
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from './index.action';
import { bindActionCreators } from 'redux';
import Fixed from 'utils/tofixed';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const style={
    border:'1px solid #d9d9d9',
    width:"88px",
    height:'32px',
    fontSize:'14px',
    lineHeight:'30px',
    textAlign:'center',
    cursor:'pointer',
}

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async e => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values },values);
        } catch (errInfo) {
            console.log('保存失败')
        }
    };

    const limitDecimals = (value) => { //限制输入为整数或两位小数
        const reg = /^(-)*(\d+)\.(\d\d).*$/;
        if(typeof value === 'string') {
            return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
        } else if (typeof value === 'number') {
            return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
        } else {
            return ''
        }
    };

    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ marginBottom:'0'}}
                name={dataIndex}
                rules={[{ required: true, message: '不能为空' }]}
            >
                <InputNumber min={0} formatter={limitDecimals} parser={limitDecimals} ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (<div onClick={toggleEdit}>{children}</div>);
    }
    return <td {...restProps}>{childNode}</td>;
};

const EditPage = (props) => {
    const [form] = Form.useForm();

    const [data, setData] = useState([]);
    const [resultdata, setResultdata] = useState([]);
    const [dataSource, setdataSource] = useState([]);
    const [columns, setcolumns] = useState([]);
    const [loading, setLoading] = useState(false);

    const taskId = props.location.search.split('=')[1];
    const GetData = (id, isSimple = false) => {
        setLoading(true);
        Axios.get({ 
            url: `/api/PathwayReport/${taskId}` ,
            params: {
                "simplifiedName": isSimple,
            }
         }).then(res => {
            setData(res);
            setLoading(false);
        }).catch(err => {
            message.error('表格加载失败！')
            setLoading(false);
        })
    }
    useState(() => {  //执行一次，请求数据
        GetData(taskId);
    }, [])

    useEffect(() => { //修改数据
        if (!_.isEmpty(data)) {
            createNode(data);
            form.setFieldsValue({
                'yearquarter': moment(`${data.year}-${data.quarter}`, 'YYYY-Q'),
                'customdate': [moment(`${data.sDate.split('T')[0]}`), moment(`${data.eDate.split('T')[0]}`)],
                'cnt': data?.cnt,
            });
        }
    }, [data, form]);

    
    const createNode = (data) => {
        if(_.isEmpty(data)){
            return;
        }else {
            //表格信息数据
            const titleData = {
                'superiorGovernmentName': data.superiorGovernmentName, //上级主管部门
                'hospName': data.hospName, //医疗机构名称
                'hospClass':data.hospClass,//级别等次
            };

            let pathInfo = _.compact(_.flatMapDeep(data.infos.map(i => {
                if(i["children"]){
                    let subItem = i["children"].map(t => ({
                        ...t,
                        ...titleData,
                        "specializedSubjectName": i["specializedSubjectName"],
                        "specializedSubjectId": i["specializedSubjectId"],
                    }));
                    return subItem;
                }else {
                    return [];
                }
            })));
    
            let columns_result = [];
            _.concat(columnGoven, columnHosp, columnClass).forEach(k => {
                columns_result.push({
                    ...k,
                    width: 140,
                    render: (text, record, index) => {
                        const obj = {
                            children: <Text>{text}</Text>,
                            props: {},
                        };
                        if (index === 0) {
                            obj.props.rowSpan = pathInfo.length;
                        }
                        for (var k = 1; k <= pathInfo.length; k++) {
                            if (index === k) {
                                obj.props.rowSpan = 0;
                            }
                        }
                        return obj;
                    }
                })
            });

            const mergeCount = _.compact(data.infos.map(i => {
                if(i["children"]){
                    const pathleng = i["children"].length;
                    return pathleng;
                }else {
                    return 0;
                }
            }));
            let spanCount = [];
            mergeCount.forEach((t, index) => {
                let count = _.reduce(_.cloneDeep(mergeCount).slice(0,index + 1), function(sum, n) {
                    return sum + n;
                }, 0);
                spanCount.push(count)
            });
            columnSubName.forEach(t => {
                columns_result.push({
                    ...t,
                    width: 140,
                    render: (text, record, index) => {
                        let obj = {
                            children: text,
                            props: {},
                        };
                        spanCount.forEach((r, idx) => {
                            if (index === (spanCount[idx] - mergeCount[idx])) {
                                obj.props.rowSpan = mergeCount[idx];
                            }
                            for (var k =  (spanCount[idx] - mergeCount[idx] + 1); k < spanCount[idx]; k++) {
                                if (index === k) {
                                    obj.props.rowSpan = 0;
                                }
                            }
                        })
                        return obj;
                    }
                });
            })
    
            columnPathName.forEach(n => { //专业及病种
                columns_result.push({
                    ...n,
                    width:140,
                })
            });
    
            columnDiseases.forEach(j => { //填报数据
                columns_result.push({
                    ...j,
                    width: 150,
                    editable: j.canInput, //是否可编辑
                    render: (text, record) => {
                        let commentTxt = "";
                        if(!_.isEmpty(record.comment)){
                            let itemComment = _.find(record.comment, function(o) { return o.name === j.dataIndex });     
                            if(!_.isEmpty(itemComment)){
                                commentTxt = itemComment.value;
                            }
                        };
                        return (
                            j.isRatio ? <span>{`${Fixed(text)}%`}</span> : <Space >
                                <div style={style}>{Fixed(text)}</div>
                                {!_.isEmpty(commentTxt) ? <Tooltip title={commentTxt}><InfoCircleTwoTone twoToneColor="#f00" style={{ cursor: 'pointer' }} /></Tooltip> : <span></span>}
                            </Space>
                        )
                    }
                })
            })
            setdataSource( pathInfo );
            setcolumns( columns_result );
        }
    };

    const handleSave = (row, values, id) => {
        let newData = [...dataSource];
        let newresult = [...resultdata]
        const index = newData.findIndex((item) => row.id === item.id); 
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setdataSource(newData);
        if(_.isEmpty(_.find(newresult, function(o) { return o.id === row.id }))){
            newresult.push({ id: row.id, ...values });
        }else {
            _.forEach(newresult, function(item,index) {
                if(item.id === row.id) {
                    newresult[index] = { ...item, ...values }
                }
            })
        };
        setResultdata(newresult);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const tableColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });

    const handleSubmit = () => {
        form.submit();
        // console.log(form.getFieldValue('cnt'));
        const totalcnt = form.getFieldValue('cnt');
        if(totalcnt){
            let options = {
                'id': data.id,
                'infos': resultdata,
                'year': data.year,
                "quarter": data.quarter,
                'cnt': totalcnt,
            };
            props.PutPathwayReport(options).then(ers=>{
                const hide = message.loading({
                    content: "更新成功！即将跳转到列表页...",
                    style: {
                        marginTop: "10vh",
                    },
                    duration: 0,
                });
                notification.success({
                    message: '提示信息',
                    duration:2.5,
                    description:'更新报表成功！',
                    placement: "bottomLeft",
                });
                setTimeout(()=>{
                    hide();
                    props.history.push('/Layout/PathwayReport/ManageMent');
                }, 1500);
            }).catch(error=>{
                message.error('更新失败！');
            })
        }
    }
    const handleCancel = () => {
        props.history.go(-1);
    }

    const ChangeName = (e) => {
        const value  = e.target.value;
        GetData(taskId, value);
    }

    return (
        <div className="content-card">
            <Card title={<h3 className='table-name-title'>医疗机构临床路径管理整体信息季度报送表</h3>} extra={
                <Radio.Group
                    className="space-margin4"
                    style={{ marginLeft: "8px" }}
                    defaultValue={false}
                    onChange={ ChangeName }
                    buttonStyle="solid"
                >
                    <Radio.Button style={{ borderRadius: "15px 0 0 15px" }} value={false}>机构全称</Radio.Button>
                    <Radio.Button style={{ borderRadius: "0 15px 15px 0" }} value={true}>机构简称</Radio.Button>
                </Radio.Group>
            } style={{ width: '100%' }}>
                <Form form={form} initialValues={{ 'yearquarter': moment('2020-1', 'YYYY-Q'), }}>
                    <Row gutter={[24]}>
                        <Col xl={{ span: 8 }} md={{span: 12}} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Form.Item label="全院出院人数" name='cnt' rules={[{ required: true }]}>
                                <InputNumber min={0} placeholder="请输入全院出院人数" precision={0} style={{minWidth: 120}} />
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 8 }} md={{span: 12}} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Form.Item label='年份-季度' name='yearquarter'>
                                <DatePicker picker='quarter' disabled ></DatePicker>
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 8 }} md={{span: 12}} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Form.Item label='统计日期' name='customdate'>
                                <RangePicker disabled></RangePicker>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table
                    bordered
                    rowKey="id"
                    components={components}
                    loading={loading}
                    dataSource={dataSource}
                    columns={tableColumns}
                    pagination={false}
                    scroll={{ x: 5000 }}
                    footer={() => (
                        <div className='flex-end-box'>
                            <Space>
                                <Button type='primary' onClick={handleSubmit}>提交表单</Button>
                                <Button type='default' onClick={handleCancel}>取消</Button>
                            </Space>
                        </div>
                    )}
                />
            </Card>
        </div>
    )
}


export default connect(
    state=>({}),
    dispatch => bindActionCreators({...actions},dispatch)
)(EditPage);