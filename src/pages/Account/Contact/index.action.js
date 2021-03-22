import { Axios } from "react";
import { message } from "antd";

export let GetContact = (params) => dispatch => {
    dispatch({ type: "Account_ContactLoading", payload: true });
    Axios.get({
        url: "/api/contact",
        params: {
            "SkipCount": 0,
            "MaxResultCount": 10,
            ...params,
        },
    }).then(res => {
        let result = res.items.map(i => {
            return { ...i, "key": i.id }
        })
        dispatch({ type: "Account_ContactLoading", payload: false });
        dispatch({ type: "Account_ContactTotal", payload:  res.totalCount });
        dispatch({ type: "Account_ContactColumnRules", payload: res.columns })
        dispatch({
            type:"Account_GetContacts",
            payload: result,
        })
    }).catch(err => {
        dispatch({ type: "Account_ContactLoading", payload: false });
        message.error("联系人列表获取失败！");
    })
}

//新建
export let CreateContact = (values) => dispatch => {
    return Axios.post({
        url: "/api/contact",
        data: values,
        noTip: true,
        contentType: "application/json"
    })
}

//编辑
export let EditContact = (values) => dispatch => {
    return Axios.put({
        url: `/api/contact/${values.id}`,
        data: values,
        noTip: true,
        contentType: "application/json",
    })
}

//删除
export let DeleteContact = (id) => dispatch => {
    return Axios.delete({
        url: `/api/contact/${id}`
    })
} 