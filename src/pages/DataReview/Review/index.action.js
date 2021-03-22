import { Axios } from "react";
import { message } from "antd";

export let GetGovernPathwayReport = (params) => dispatch => {
    dispatch({ type: "GetReViewPathwayReport_Loading", payload: true });
    Axios.get({
        url: `/api/pathwaygovernreport/0`,
        params: params
    }).then(res=>{
        dispatch({ type: "GetReViewPathwayReport_Data", payload: res });
        dispatch({ type: "GetReViewPathwayReport_Loading", payload: false });
    }).catch(err=>{
        dispatch({ type: "GetReViewPathwayReport_Loading", payload: false });
        message.error('表格信息加载失败!');
    })
}

export let GetGovernPathwayReportNostatus = (params, id) => dispatch => {
    dispatch({ type: "GetReViewPathwayReport_Loading", payload: true });
    Axios.get({
        url: `/api/pathwaygovernreport/${id}`,
        params: params
    }).then(res=>{
        dispatch({ type: "GetReViewPathwayReport_Data", payload: res });
        dispatch({ type: "GetReViewPathwayReport_Loading", payload: false });
    }).catch(err=>{
        dispatch({ type: "GetReViewPathwayReport_Loading", payload: false });
        message.error('表格信息加载失败!');
    })
}


export let GetHistoryData = (id) => dispatch => {
    dispatch({ type: "GovenPathWayReportView_LoadHistory", payload: true });
    Axios.get({
        url:`/api/pathwaygovernreport/${id}/history`
    }).then(res=>{
        const newres = res.items.map(i=>({...i,'key':i.id}));
        dispatch({ type: "GovenPathWayReportView_LoadHistory", payload: false });
        dispatch({ type: "GovenPathWayReportView_History", payload: newres });
    }).catch(err=>{
        message.error('获取历史版本数据失败！');
        dispatch({ type: "GovenPathWayReportView_LoadHistory", payload: false });
    })
}