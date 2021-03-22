import { Axios } from "react";
import { message } from "antd";

export let GetReportInfo = () => dispatch => {
    dispatch({ type: "ReportCreate_Loading", payload: true });
    Axios.get({
        url: "/api/user/reportInfo",
    }).then(res => {
        dispatch({ type: "ReportCreate_Loading", payload: false });
        dispatch({ type: "ReportCreate_UserInfo", payload: res });
    }).catch(err => {
        message.warn('表格初始化失败！');
        dispatch({ type: "ReportCreate_Loading", payload: false });
    })
}

export let GetSettingPathwayReport = () => dispatch => {
    dispatch({ type:"GetSettingPathwayReport_Loading", payload: true });
    Axios.get({
        url: "/api/setting/pathwayreport",
    }).then(res => {
        dispatch({ type: "GetSettingPathwayReport_Data", payload: res });
        dispatch({ type:"GetSettingPathwayReport_Loading", payload: false });
    }).catch(err => {
        message.error("模板信息获取失败！");
        dispatch({ type:"GetSettingPathwayReport_Loading", payload: false });
    });
}

export let SubmitReport = (data) => dispatch => {
    return Axios.post({
        url: '/api/PathwayReport',
        noTip: true,
        data: data,
        contentType: "application/json"
    })
}

export let DownloadTemplate = () => dispatch => {
    return Axios.get({
        url: "/api/pathwayReport/template",
        responseType: "blob",
    })
}