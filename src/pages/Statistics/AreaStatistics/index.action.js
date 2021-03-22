import React, { Axios } from "react";
import _ from "lodash";
import { message } from "antd";

function shakeSourceData(source) {
    const details = source.details || [];
    const summary = source.summary || {};
    var sourceCol = [];
    var resultArr = _.flattenDeep(
        details.map(item => {
            if (item.children && item.children.length > 0) {
                var obj = {
                    'subjectName': item['subjectName'],
                    'diseaseName': item['diseaseName'],
                    'specificDiseasesCnt': item['specificDiseasesCnt']
                }
                item.children.forEach(child => {
                    sourceCol.push(child)
                    obj[child['organizationName']] = child['specificDiseasesCnt'];
                })
                return obj;
            }
            return []
        })
    );

    var footer = { 
        'subjectName': "合计",
        'specificDiseasesCnt': summary['specificDiseasesCnt'] 
    };
    summary.children.forEach(item => {
        footer[item['organizationName']] = item['specificDiseasesCnt']
    });
    var dataSource = _.concat(resultArr, footer);
    sourceCol = _.uniq(sourceCol.map(i => i['organizationName']));
    var preCol = [
        {
            title: '专业名称',
            name: '专业名称',
            dataIndex: "subjectName",
            key: 'subjectName',
            render:(text, record, index)=>{
                const obj = {
                children: <span>{text}</span>,
                    props: {},
                };
                if(index === dataSource.length - 1){
                    obj.props.colSpan = 2;
                }
                return obj;
            }
        },
        {
            title: '病种名称',
            name: '病种名称',
            dataIndex: "diseaseName",
            key: 'diseaseName',
            render:(text, record, index)=>{
                const obj = {
                    children: <span>{text}</span>,
                    props: {},
                };
                if(index === dataSource.length - 1){
                    obj.props.colSpan = 0;
                }
                return obj;
            }
        },
    ];
    var columns = _.concat(
        preCol,
        sourceCol.map(i => ({
            title: i,
            name: i,
            dataIndex: i,
            key: i,
        })),
        [
            {
                title: "病种数量统计",
                name: "病种数量统计",
                dataIndex: "specificDiseasesCnt",
                key: "specificDiseasesCnt",
            }
        ]
    );
    return {
        'dataSource': dataSource,
        'columns': columns,
    }

};

export let GetAreaStatisticsData = (data) => dispatch => {
    dispatch({ type: "GetAreaStatisticsLoading", payload: true });
    Axios.post({
        url: "/api/report/assocWays",
        data: data,
    }).then(res => {
        let result = shakeSourceData(res);
        dispatch({ type: "GetAreaStatisticsLoading", payload: false });
        dispatch({ type: "GetAreaStatisticsData", payload: result });
    }).catch(err => {
        dispatch({ type: "GetAreaStatisticsLoading", payload: false });
        message.error("数据请求失败！");
    });
}