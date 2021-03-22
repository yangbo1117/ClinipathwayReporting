import { Axios } from "react";
import { message } from "antd";

export let GetPathwayGovernReport = (params) => dispatch => {
    dispatch({ type:"DataReviewManageLoading", payload: true });
    Axios.get({
        url: "/api/pathwayGovernReport" ,
        params: {
            "SkipCount": 0 ,
            "MaxResultCount": 10,
            "simplifiedName": false,
            ...params,
        }
    }).then(res => {
        dispatch({ type:"DataReviewManageLoading", payload: false });
        let result = res.items.map(i=>{
            return {...i, "key": i.id }
        })
        dispatch({
            type: "DataReviewManageTotal",
            payload: res.totalCount
        });
        dispatch({
            type: "DataReviewManageData",
            payload: result
        });
        dispatch({
            type: "DataReviewManageColumnRules",
            payload: res.columns,
        })
    }).catch(err => {
        dispatch({ type:"DataReviewManageLoading", payload: false });
        message.error("数据获取失败！");
    })
} 

export let LockPathwayGovernReport = (year, quarter) => dispatch => {
    return Axios.post({
        url: "/api/pathwayGovernReport/lock",
        params: { year, quarter }
    })
}

export let UnLockPathwayGovernReport = (year, quarter) => dispatch => {
    return Axios.post({
        url: "/api/pathwayGovernReport/unlock",
        params: { year, quarter },
    })
}

export let GetPathwayReportFromParentId = (params) => dispatch => {
    dispatch({ type: "GetPathwayReportFromParentId_Loading", payload: true });
    Axios.get({
        url: "/api/pathwayReport",
        params: params,
    }).then(res => {
        let result = res.items.map(i => ({ ...i, "key": i.id }));
        dispatch({ type: "GetPathwayReportFromParentId_TableData", payload: result });
        dispatch({ type: "GetPathwayReportFromParentId_Loading", payload: false });
    }).catch(err => {
        message.error("获取失败！");
        dispatch({ type: "GetPathwayReportFromParentId_Loading", payload: false });
    });
}
