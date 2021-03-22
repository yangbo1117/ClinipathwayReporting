import  { Axios } from "react";
import {message} from "antd";

function AddKey (data)
{
    data.forEach((value,index) => {
        if(value.hasChild)
        {
            data[index]= {"key": value.id, ...value };
            data[index]['children'] = AddKey(data[index]['children'])
        }else {
            data[index]= {"key": value.id, ...value };
            data[index]['children'] = null;
        }
    })
    return data;
}

export let GetSubject = () => dispatch => {
    dispatch({ type: "Subject_Loading", payload: true });
    Axios.get({
        url: "/api/subject"
    }).then(res => {
        dispatch({ type: "Subject_Loading", payload: false });
        let nodeList = AddKey(res.items);
        dispatch({
            type: "Get_Subject",
            payload: nodeList,
        });
        dispatch({
            type: "Subject_ColumnRules",
            payload: res.columns,
        })
    }).catch(err => {
        dispatch({ type: "Subject_Loading", payload: false });
        message.warn("表格加载失败！");
    })
}

export let DeleteSubject = (id, props) => dispatch => {
    Axios.delete({
        url: `/api/subject/${id}`,
    }).then(res => {
        message.success("删除成功！");
        props.GetSubject();
    }).catch(err => {
        message.error("删除失败！");
    });
}

export let EditSubject = (data) => dispatch => {
    return Axios.put({
        url: `/api/subject/${data.id}`,
        data,
        noTip: true,
        contentType: "application/json",
    })
}

export let CreateSubject = (data) => dispatch => {
    return Axios.post({
        url:"/api/subject",
        data,
        noTip: true,
        contentType: "application/json",
    })
}

export let DownLoadSubject = () => dispatch => {
    return Axios.get({
        url: "/api/subject/download",
        responseType: "blob",
    })
}