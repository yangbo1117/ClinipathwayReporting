import { Axios } from "react";
import { message } from "antd";

export let StoreTokenRole = (data) => dispatch => {
    const now = new Date()
    .getTime()
    .toString()
    .substr(0, 10); // 秒
    dispatch({
        type: "Store_Token_Role",
        payload: {
            ...data,
            timeStamp: now,
        },
    });
};

export let GetMyProfile = () => dispatch => {
    Axios.get({
        url: "/api/identity/my-profile",
    }).then( res => {
        dispatch({
            type: "Store_MyProfile",
            payload: res,
        })
    }).catch(err => {
        message.error("用户名获取失败！");
    })
};

export let registerUser = (data) => dispatch => {
    return Axios.post({
        url: "/api/account/register",
        data:{
            ...data,
            "appName":"DirectReport"
        },
        contentType: "application/json"
    })
}

export let GetCurrent = () => dispatch => {
    Axios.get({
        url: '/api/institution/current'
    }).then(res => {
        dispatch({ type: "Store_Current", payload: res.name });
    })
}