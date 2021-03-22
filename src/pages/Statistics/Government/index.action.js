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
            type: "GovernGetInstitution",
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
            type:"GovernGetReportYear",
            payload: res
        });
    }).catch(err => {
        message.error("时间列表获取失败！")
    })
}
export let GetPathwayReport = (id,data, params) => dispatch => {
    dispatch({ type: 'GovernGetReportLoading', payload: true });
    dispatch({ type: "GovernSelfTrendReqData", payload: data });
    Axios.post({
        url: id ? `/api/report/pathwayGovernReport/${id}` : "/api/report/pathwayGovernReport",
        contentType: "application/json",
        data: data,
        params: params,
    }).then(res => {
        dispatch({
            type:'GovernGetReportData',
            payload: res,
        })
        dispatch({ type: 'GovernGetReportLoading', payload: false });
    }).catch(err => {
        dispatch({ type: 'GovernGetReportLoading', payload: false });
        message.error("数据获取失败！");
    })
}

export let GetSelfTrendData = (data) => dispatch => {
    dispatch({ type: "GovernSelfTrendLoading", payload: true });
    Axios.post({
        url: data.organizations ? `/api/report/selfTrend/${data.organizations[0]}` : "/api/report/selfTrend",
        contentType: "application/json",
        data: data
    }).then(res => {
        dispatch({ type: "GovernSelfTrendLoading", payload: false });
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
        dispatch({ type: "GovernSelfTrendData", payload: FilterUndefineNull(result) })

    }).catch(err => {
        dispatch({ type: "GovernSelfTrendLoading", payload: false });
    });
}




