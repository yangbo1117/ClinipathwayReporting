import React, { Axios } from "react";
import _ from "lodash";
import { message, Typography } from "antd";
import { FolderOpenFilled, FileExclamationFilled } from "@ant-design/icons";

const { Text } = Typography;

function renderTree (data)
{
    data.forEach((value,index) => {
        if(value.hasChild)
        {
            data[index]= {
                "title": value.name, 
                "value": value.id, 
                "icon": <Text type="warning"><FolderOpenFilled /></Text>,
                "selectable": false, //父级不可选
                ...value 
            };
            data[index]['children'] = renderTree(data[index]['children'])
        }else {
            data[index]= {
                "title": value.name, 
                "value": value.id, 
                "icon": <Text type="warning"><FileExclamationFilled /></Text>,
                ...value 
            };
        }
    })
    return data;
}

export let GetCliniPath = (params) => dispatch => {
    dispatch({ type:"Get_CliniPathLoading", payload: true });
    Axios.get({
        url:"/api/CliniPath",
        params: {
            "SkipCount": 0,
            "MaxResultCount": 10,
            ...params,
        },
    }).then(res => {
        let result = _.map(res.items, function(value,index) {
            return {
                ...value,
                "key": value.id,
            }
        });
        dispatch({ type:"Get_CliniPathLoading", payload: false });
        dispatch({
            type:"Get_CliniPath",
            payload: result,
        });
        dispatch({
            type:"ClinPath_Total",
            payload: res.totalCount,
        });
        dispatch({
            type: "ClinPath_ColumnRules",
            payload: res.columns,
        })
    }).catch(err => {
        dispatch({ type:"Get_CliniPathLoading", payload: false });
    })
}

export let GetSubjects = () => dispatch => {
    Axios.get({
        url: "/api/subject",
    }).then(res => {
        let result = renderTree(res.items);
        dispatch({
            type: "Parents_Subjects",
            payload: result
        })
    }).catch(err => {
        message.error("专业获取失败!");
    })
}

export let CreateCliniPath = (data) => dispatch => {
    return Axios.post({
        url: "/api/clinipath",
        data: data,
        noTip: true,
        contentType: "application/json",
    })
}

export let EditClinipath = (data) => dispatch => {
    return Axios.put({
        url: `/api/clinipath/${data.id}`,
        data: data,
        noTip: true,
        contentType: "application/json",
    })
}

export let DeleteClinipath = (id) => dispatch => {
    return Axios.delete({
        url: `/api/cliniPath/${id}`
    })
}

export let DownLoadPaths = () => dispatch => {
    return Axios.get({
        url: "/api/cliniPath/download",
        responseType: "blob",
    })
}