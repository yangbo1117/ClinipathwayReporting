import React, { useState, useEffect, useMemo } from 'react';
import { Table, Row, Col, DatePicker, Typography, Form, Tooltip, Space, Button } from 'antd';
import { columnGoven, columnHosp, columnClass, columnSubName, columnPathCnt, columnDiseases, columnPathName } from "assets/js/reportColumns";
import { InfoCircleTwoTone, ExportOutlined } from '@ant-design/icons';
import _ from 'lodash';
import moment from 'moment';
import ExportExcell from "assets/js/better-xlsx";
import Fixed from 'utils/tofixed';

const { Text }  = Typography;
const { RangePicker } = DatePicker;
const TablePage = (props)=>{
    const [form] = Form.useForm();

    useEffect(()=>{
        if(!_.isEmpty(props.data)){
            form.setFieldsValue({
                'yearquarter': moment(`${props.data.year}-${props.data.quarter}`, 'YYYY-Q'),    
                'customdate': [ moment(`${props.data.sDate.split('T')[0]}`), moment(`${props.data.eDate.split('T')[0]}`)]
            });
        }
    },[props.data,form]);

    const dataSource = useMemo(() => {
        if(!_.isEmpty(props.data)){
            const others = {
                "hospName": props.data.hospName,
                "hospClass": props.data.hospClass,
                "superiorGovernmentName": props.data.superiorGovernmentName,
            }
            const summary = props.data.summary;
            if(props.data.infos) {
                let node = props.data.infos.map(i => {
                    if(i["children"]){
                        let childrenItem = i["children"].map(t => ({
                            ...t,
                            "specializedSubjectId": i["specializedSubjectId"],
                            "specializedSubjectName": i["specializedSubjectName"],
                            "specificDiseasesCnt": i["specificDiseasesCnt"],
                            ...others,
                        
                        }));
                        return _.concat(childrenItem, [
                            {
                                ...i,
                                ...others,
                                "clinicalPathwayName": i['specificDiseasesCnt'],
                            }
                        ]);
                    }else {
                        return [
                            {
                                ...i,
                                ...others,
                                "clinicalPathwayName": i['specificDiseasesCnt'],
                            }
                        ];
                    }
                });
                let result = _.concat(_.flatMapDeep(node), [
                    {
                        ...others,
                        ...props.data.summary,
                        "superiorGovernmentName": "合计",
                        "specializedSubjectName": props.data.infos.length,
                        "clinicalPathwayName": _.flatMapDeep(node).length - props.data.infos.length,
                    }
                ]).map((item, index) => {
                    let obj = {'key': index};
                    _.forIn(item, function(value, key) {
                        if(_.isUndefined(value) || _.isNull(value)) {
                            obj[key] = 0;
                        }else {
                            if(value.toString().indexOf('.') === -1){
                                obj[key] = value;
                            }else{
                                if(_.isNumber(value)) {
                                    obj[key] = +value.toFixed(2);
                                }else {
                                    obj[key] = value;
                                }
                            }
                        }
                    });
                    return obj;
                });
                return result;
            }else {
                return [{
                    ...others,
                    ...props.data.summary,
                    "superiorGovernmentName": "合计",
                }].map((item, index) => {
                    let obj = {'key': index};
                    _.forIn(item, function(value, key) {
                        if(_.isUndefined(value) || _.isNull(value)) {
                            obj[key] = 0;
                        }else {
                            if(value.toString().indexOf('.') === -1){
                                obj[key] = value;
                            }else{
                                if(_.isNumber(value)) {
                                    obj[key] = +value.toFixed(2);
                                }else {
                                    obj[key] = value;
                                }
                            }
                        }
                    });
                    return obj;
                });
            }
        }else {
            return []
        }
    },[props.data]);


    const finalCol = useMemo(() => {
        if(_.isEmpty(dataSource)){
            return _.concat(columnGoven, columnHosp, columnClass, columnSubName, columnPathName, columnDiseases);
        }else {
            let columns = [];
            columnGoven.forEach(k=>{ 
                columns.push({
                    ...k,
                    render:(text, record, index)=>{
                        const obj = {
                            children: <div className="title-center">{text}</div>,
                            props: {},
                        };
                        if(dataSource.length > 1){
                            if (index === 0) {
                                obj.props.rowSpan = dataSource.length - 1;
                            }
                            for(let k = 1; k < dataSource.length - 1; k++){
                                if(index === k){
                                    obj.props.rowSpan = 0;
                                }
                            }
                        }
                        if(index === dataSource.length - 1){
                            obj.props.colSpan = 3;
                        }
                        return obj;
                    }
                })
            });
            _.concat( columnHosp, columnClass).forEach(k=>{ 
                columns.push({
                    ...k,
                    render:(text, record, index)=>{
                        const obj = {
                            children: <Text>{ text }</Text>,
                            props: {},
                        };
                        if(dataSource.length > 0){
                            if (index === 0) {
                                obj.props.rowSpan = dataSource.length - 1;
                            }
                            for(let k = 1; k < dataSource.length - 1; k++){
                                if(index === k){
                                    obj.props.rowSpan = 0;
                                }
                            };
                        }
                        if(index === dataSource.length - 1){
                            obj.props.colSpan = 0;
                        }
                        return obj;
                    }
                })
            });
            const mergeCount = _.compact(props.data.infos.map(i => {
                if(i["children"]){
                    const pathleng = i["children"].length + 1;
                    return pathleng;
                }else {
                    return 1;
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
                columns.push({
                    ...t,
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
            _.concat(columnPathName, columnDiseases).forEach(i => {
                if (i.isRatio) {
                    columns.push({
                        ...i,
                        // width: 140,
                        render: (text, record) => {
                            return (<span>{`${text}%`}</span>)
                        }
                    });
                } else {
                    columns.push({
                        ...i,
                        render: (text, record) => {
                            let commentTxt = "";
                            if(!_.isEmpty(record.comment)){
                                let itemComment = _.find(record.comment, function(o) { return o.name === i.dataIndex });     
                                if(!_.isEmpty(itemComment)){
                                    commentTxt = itemComment.value;
                                }
                            };
                            return (
                                <Space>
                                    <span>{`${text}`}</span>
                                    {!_.isEmpty(commentTxt) ? <Tooltip title={commentTxt}><InfoCircleTwoTone twoToneColor="#f00" style={{cursor:'pointer'}}/></Tooltip> : null}
                                </Space>
                            )
                        }
                    });
                }
            });
            return columns;
        }
    },[dataSource])

   const handleExport = () =>{
       let filename = props.exportName || `${props.data.year}年第${props.data.quarter}季度报送表`;
       if(!_.isEmpty(finalCol)) {
        ExportExcell(
            [
               { column: finalCol, dataSource: dataSource }
            ],
            filename,
        )
       }
    };

    return(
        <div>
            <Form form={ form } initialValues={{'yearquarter': moment('2020-1','YYYY-Q'),}}>
                <Row gutter={[24]}>
                    <Col md={{span:8}} sm={{ span:24}} xs={{span:24}}>
                        <Form.Item label='年份-季度' name='yearquarter'>
                                <DatePicker  picker='quarter' disabled ></DatePicker>
                        </Form.Item>
                    </Col>
                    <Col md={{span:10}} sm={{ span:24}} xs={{span:24}}>
                        <Form.Item label='统计日期' name='customdate'>
                                <RangePicker  disabled></RangePicker>
                        </Form.Item>
                    </Col>
                    <Col md={{span:6}} sm={{span:24}} xs={{span:24}}>
                        <Form.Item>
                            <Button disabled={_.isEmpty(props.data)} icon={ <ExportOutlined /> } onClick={ handleExport }>导出Excel</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div>
                <Table
                    bordered
                    loading={ props.loading }
                    dataSource={ dataSource }
                    columns={ finalCol }
                    rowKey="key"
                    pagination={ false }
                    expandable={{
                        childrenColumnName: "custom_children", //指定树形展示字段
                    }}
                    scroll={{ x: "max-content" }}
                    footer={()=>{
                        if(_.isEmpty(props.data)){
                            return null;
                        }else{
                            return ( props.data.hasComment ? <Text strong>备注信息：<Text type="danger">{props.data.comment}</Text></Text> : false)
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default TablePage;