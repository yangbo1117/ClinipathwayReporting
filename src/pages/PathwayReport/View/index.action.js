import { Axios } from "react";
import { message } from "antd";

export let GetData = (id, isSimple = false ) => dispatch => {
    dispatch({ type: "PathWayReportView_Loading", payload: true });
    Axios.get({
        url:  `/api/PathwayReport/${id}`,
        params: {
            simplifiedName: isSimple
        }
    }).then(res => {
        dispatch({ type: "PathWayReportView_Loading", payload: false });
        dispatch({ type: "PathWayReportView_Data", payload: res });
    }).catch(err=>{
        dispatch({ type: "PathWayReportView_Loading", payload: false });
        message.error('表格加载失败！');
    });
}

export let GetHistoryData = (id) => dispatch => {
    dispatch({ type: "PathWayReportView_LoadHistory", payload: true });
    Axios.get({
        url:`/api/PathwayReport/${id}/history`
    }).then(res=>{
        const newres = res.items.map(i=>({...i,'key':i.id}));
        dispatch({ type: "PathWayReportView_LoadHistory", payload: false });
        dispatch({ type: "PathWayReportView_History", payload: newres });
    }).catch(err=>{
        message.error('获取历史版本数据失败！');
        dispatch({ type: "PathWayReportView_LoadHistory", payload: false });
    })
}