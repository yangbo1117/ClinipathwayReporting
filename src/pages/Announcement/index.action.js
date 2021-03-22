import { Axios } from "react";
import { message } from "antd";

export let GetAnnouncement = (params) => dispatch => {
    dispatch({ type:"GetAnnouncement_Loading", payload: true });
    Axios.get({
        url: "/api/announcement",
        params: {
            "SkipCount": 0,
            "MaxResultCount": 10,
            ...params,
        },
    }).then(res => {
        let result = res.items.map(i => ({ "key": i.id, ...i }));
        dispatch({ type:"GetAnnouncement_Loading", payload: false });
        dispatch({ type:"GetAnnouncement_Data", payload: result });
        dispatch({ type:"GetAnnouncement_ColumnRules", payload: res.columns });
        dispatch({ type:"GetAnnouncement_totalCount", payload: res.totalCount });
    }).catch(err => {
        message.error("公告列表获取失败！");
        dispatch({ type:"GetAnnouncement_Loading", payload: false });
    });
}

export let CreateAnnouncement = (data) => dispatch => {
    return Axios.post({
        url: "/api/announcement",
        data: data,
        contentType: "multipart/form-data"
    })
}

export let EditAnnouncement = (id,data) => dispatch => {
    return Axios.put({
        url: `/api/announcement/${id}`,
        data: data,
        contentType: "multipart/form-data"
    });
}

//删除
export let DeleteAnnouncement = (id) => dispatch => {
    return Axios.delete({
        url: `/api/announcement/${id}`
    })
} 

// //文件下载
// export let DownLoadFile = (id) => dispatch => {
//     return Axios.get({
//         url: `/api/download/${id}`
//     });
// }