import { Axios } from "react";
import { message } from "antd";

export let GetAnnouncement = (params) => dispatch => {
    dispatch({ type:"Welecome_Loading", payload: true });
    Axios.get({
        url: "/api/announcement",
        params: {
            "Sorting": "creationTime desc",
            "SkipCount": 0,
            "MaxResultCount": 4,
            ...params,
        },
    }).then(res => {
        dispatch({ type:"Welecome_Loading", payload: false });
        dispatch({ type:"Welecome_Data", payload: res.items });
        dispatch({ type:"Welcome_Total", payload: res.totalCount })
    }).catch(err => {
        message.error("公告列表获取失败！");
        dispatch({ type:"Welecome_Loading", payload: false });
    });
}

// //文件下载
// export let DownLoadFile = (id) => dispatch => {
//     return Axios.get({
//         url: `/api/download/${id}`
//     });
// }