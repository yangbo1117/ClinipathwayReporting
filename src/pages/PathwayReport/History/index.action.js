import { Axios } from "react";
import { message } from "antd";
// import _ from "lodash";

// function RenderTree (data)
// {
//     data.forEach((value,index) => {
//         if(value.children && !_.isEmpty(value.children)) 
//         {
//             data[index]= {
//                 ...value,
//                 "key": value.id,
//                 "title": value.name,
//                 "value": value.id,
//                 "selectable": false,
//              };
//             data[index]['children'] = RenderTree(data[index]['children'])
//         }else {
//             data[index]= { 
//                 ...value, 
//                 "key": value.id, 
//                 "children": null,
//                 "title": value.name,
//                 "value": value.id,
//             };
//         }
//     })
//     return data;
// }

export let GetInstitutionChildren = () => dispatch => {
    Axios.get({ url: '/api/institution/children' }).then(res => {
        let result = res.items
        dispatch({
            type: "GetChildrenInstitution",
            payload: result,
        })
    }).catch(err => {
        message.warn("数据获取失败！");
    })
}

export let GetPathwayReport = (url,params) => dispatch => {
    dispatch({ type:'HistoryReportLoading', payload: true });
    Axios.get({
        url: url + params.id,
        params: {
            "simplifiedName": false,
            "SkipCount": 0,
            "MaxResultCount": 10,
            "WithComment": true,
            ...params,
        }
    }).then(res=> {
        let result = res.items.map(i => ({ ...i, "key": i.id }));
        dispatch({
            type:'HistoryReportData',
            payload: result,
        });
        dispatch({ type:'HistoryReportTotalCount', payload: res.totalCount });
        dispatch({ type:'HistoryReportLoading', payload: false });
    }).catch(err => {
        dispatch({ type:'HistoryReportLoading', payload: false });
    })
}