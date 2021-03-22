import { Axios } from "react";
import { message } from "antd";
import _ from "lodash";

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

export let GetTimes = () => dispatch =>{
    Axios.get({
        url: '/api/times'
    }).then(res => {
        dispatch({
            type:"TrendGetReportYear",
            payload: res
        });
    }).catch(err => {
        message.error("时间信息获取失败！");
    })
}

export let GetReportTrend = (data) => dispatch => {
    dispatch({ type:"GetReportTrendLoading", payload: true });
    Axios.post({
        url: "/api/report/trend",
        data: data,
        contentType: "application/json",
    }).then(res => {
        if(!_.isEmpty(res.summary)){
            dispatch({ type: "GetReportTrendSummaryData", payload: res.summary })
        }
        dispatch({ type:"GetReportTrendLoading", payload: false });
        if(!_.isEmpty(res.details)){
            dispatch({ type: "GetReportTrendData", payload: res.details})
            dispatch({ type: "GetReportTrendDataItem", payload: res.details[0]})
            if(!_.isEmpty(res.details[0].details)){
                dispatch({ type: "ChangeInstitutionNameItem", payload: res.details[0].details[0].formatDate });
            }
        }
    }).catch(err => {
        dispatch({ type:"GetReportTrendLoading", payload: false });
        message.error("获取数据失败！");
    })
}

//获取机构
export let GetInstitution = () => dispatch => {
    Axios.get({
        url:'/api/institution/children'
    }).then(res => {
        let result = RenderTree(res.items);
        dispatch({
            type: "TrendGetInstitution",
            payload: result,
        })
    }).catch(err => {
        message.error("机构信息获取失败！");
    })
}

//筛选机构
export let FilterInstitution = (filterVal, data, props) => dispatch => {
    if(!_.isEmpty(filterVal)) {
        let result = FilterTree(data, filterVal);
        dispatch({
            type: "TrendGetInstitution",
            payload: result,
        })
    }else {
        props.GetInstitution();
    }
}

function FilterTree (data, filterVal)
{
    data.forEach((value,index) => {
        if(value.children && !_.isEmpty(value.children)) 
        {
            data[index]= {
                ...value,
                "key": value.id,
                "title": value.name,
                "value": value.id,
                "selectable": value.type === filterVal ? true : false,
             };
            data[index]['children'] = FilterTree(data[index]['children'], filterVal)
        }else {
            data[index]= { 
                ...value, 
                "key": value.id, 
                "children": null,
                "title": value.name,
                "value": value.id,
                "selectable": value.type === filterVal ? true : false,
            };
        }
    })
    return data;
}

//更改DataItem的数据
export let ChangDataItem = (value) => dispatch => {
    dispatch({
        type: "TrendChangeDataItem",
        payload: value,
    })
    if(_.isEmpty(value.details)){
        dispatch({
            type: "ChangeInstitutionNameItem",
            payload: "",
        })
    }else{
        dispatch({
            type: "ChangeInstitutionNameItem",
            payload: value.details[0].formatDate,
        })
    }
}

//rabar change organizationName
export let ChangeInstitutionName = (value) => dispatch => {
    dispatch({
        type: "ChangeInstitutionNameTrend",
        payload: value,
    })
}

export let ChangeInstitutionNameItem = (value ) => dispatch => {
    dispatch({
        type: "ChangeInstitutionNameItem",
        payload: value,
    })
}

// 测试专用
export let Test = (res) => dispatch => {
    if(!_.isEmpty(res.summary)){
        dispatch({ type: "GetReportTrendSummaryData", payload: res.summary })
    }
    dispatch({ type:"GetReportTrendLoading", payload: false });
    if(!_.isEmpty(res.details)){
        dispatch({ type: "GetReportTrendData", payload: res.details})
        dispatch({ type: "GetReportTrendDataItem", payload: res.details[0]})
        if(!_.isEmpty(res.details[0].details)){
            dispatch({ type: "ChangeInstitutionNameItem", payload: res.details[0].details[0].formatDate });
        }
    }
}