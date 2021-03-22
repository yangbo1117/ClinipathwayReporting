import { Axios } from "react";
import { message } from "antd";
import _ from "lodash";
import { FilterUndefineNull } from "wrappers/index";

function RenderTree (data)
{
    data.forEach((value,index) => {
        if(value.children && !_.isEmpty(value.children)) 
        {
            data[index]= {
                ...value,
                "key": value.id,
                "title": value.name,
                "value": value.id,
                "selectable": false
             };
            data[index]['children'] = RenderTree(data[index]['children'])
        }else {
            data[index]= { 
                ...value, 
                "key": value.id, 
                "children": null,
                "title": value.name,
                "value": value.id,
            };
        }
    })
    return data;
}

export let GetInstitution = () => dispatch => {
    Axios.get({
        url:'/api/institution/children'
    }).then(res => {
        let result = RenderTree(res.items);
        dispatch({
            type: "HospGetInstitution",
            payload: result
        })
    }).catch(err => {
        message.error("机构信息获取失败！");
    })
}

export let GetReportTimes = (id) => dispatch => {
    Axios.get({
        url: id ? `/api/times/${id}` : "/api/times"
    }).then(res=> {
        dispatch({
            type:"HospGetReportYear",
            payload: res
        });
    }).catch(err => {
        message.error("时间列表获取失败！")
    })
}

export let GetPathwayReport = (id, data, params) => dispatch => {
    dispatch({ type: 'HospGetReportLoading', payload: true });
    dispatch({ type: "HospSelfTrendReqData", payload: data })
    Axios.post({
        url: id ? `/api/report/pathwayReport/${id}` : "/api/report/pathwayReport",
        contentType: "application/json",
        data: data,
        params: params,
    }).then(res => {
        dispatch({ type: "HospGetReportData", payload: res});
        dispatch({ type: 'HospGetReportLoading', payload: false });
    }).catch(err => {
        message.error("查询失败！");
        dispatch({ type: 'HospGetReportLoading', payload: false });
    })
}

export let GetSelfTrendData = (data) => dispatch => {
    dispatch({ type: "HospSelfTrendLoading", payload: true });
    Axios.post({
        url: data.organizations ? `/api/report/selfTrend/${data.organizations[0]}` : "/api/report/selfTrend",
        contentType: "application/json",
        data: data
    }).then(res => {
        dispatch({ type: "HospSelfTrendLoading", payload: false });
        let result = []
        if(!_.isEmpty(res.details)) {
            res.details.forEach(item => {
                result.push(item)
            })
        }
        if(!_.isEmpty(res.summary)) {
            result.push({
                ...res.summary,
                "formatDate": '合计'
            })
        }
        dispatch({ type: "HospSelfTrendData", payload: FilterUndefineNull(result) })

    }).catch(err => {
        dispatch({ type: "HospSelfTrendLoading", payload: false });
    });
}
