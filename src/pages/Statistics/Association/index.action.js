import { Axios } from "react";
import { message } from "antd";
import _ from "lodash";
import { FilterUndefineNull } from "wrappers/index";

export let GetTimes = () => dispatch => {
    Axios.get({
        url:'/api/times'
    }).then(res => {
        dispatch({
            type: "AssocGetReportYear",
            payload: res
        })
    }).catch(err => {
        message.error("时间信息获取失败！");
    })
}

export let GetPathwayReport = (id, data, params) => dispatch => {
    dispatch({ type: "AssocSelfTrendReqData", payload: data });
    dispatch({ type: 'AssocGetReportLoading', payload:true });
    Axios.post({
        url: id ? `/api/report/pathwayAssocReport/${id}` : "/api/report/pathwayAssocReport",
        contentType: "application/json",
        data: data,
        params: params,
    }).then(res => {
        if(!_.isEmpty(res.total)) {
            dispatch({
                type: "AssocGetReportDataTotal",
                payload: res.total
            })
        };
        if(!_.isEmpty(res.center)) {
            dispatch({
                type: "AssocGetReportDataCenter",
                payload: res.center
            })
            dispatch({ type: "AssocGetReportSource", payload:  res.center});
        }
        if(!_.isEmpty(res.others)) {
            dispatch({
                type: "AssocGetReportDataOthers",
                payload: res.others
            })
        }
        dispatch({ type: 'AssocGetReportLoading', payload:false });
    }).catch(err => {
        message.error("数据获取失败！");
        dispatch({ type: 'AssocGetReportLoading', payload:false });
    });
}

export let changeSource = (data) => dispatch => {
    dispatch({ type: "AssocGetReportSource", payload:  data});
}

export let GetSelfTrendData = (data) => dispatch => {
    dispatch({ type: "AssocSelfTrendLoading", payload: true });
    Axios.post({
        url: data.organizations ? `/api/report/selfTrend/${data.organizations[0]}` : "/api/report/selfTrend",
        contentType: "application/json",
        data: data
    }).then(res => {
        dispatch({ type: "AssocSelfTrendLoading", payload: false });
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
        dispatch({ type: "AssocSelfTrendData", payload: FilterUndefineNull(result) })
    }).catch(err => {
        dispatch({ type: "AssocSelfTrendLoading", payload: false });
    });
}