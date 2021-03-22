import React, { Axios } from 'react';
import { Typography, message } from "antd";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import _ from "lodash";

const { Text }  = Typography;
function RenderTree (data)
{
    data.forEach((value,index) => {
        if(value.children && !_.isEmpty(value.children)) 
        {
            data[index]= {
                ...value,
                "key": value.id,
                "title": value.name,
                "value": value.id,
                "icon": <Text type="warning"><TeamOutlined /></Text>,
             };
            data[index]['children'] = RenderTree(data[index]['children'])
        }else {
            data[index]= { 
                ...value, 
                "key": value.id, 
                "children": null,
                "title": value.name,
                "value": value.id,
                "icon": <Text type="warning"><UserOutlined /></Text>,
            };
        }
    })
    return data;
}

export let GetInstitution = () => dispatch =>{ //获取所有机构的信息，以树形结构显示
    dispatch({ type: "INSTITUTION_TABLE_LOADING", payload: true, });
    Axios.get({
        url:'/api/Institution'
    }).then(res=>{
        let result = RenderTree(res.items);
        dispatch({
            type:'GET_INSTITUTION',
            payload: result
        });
        dispatch({ type: "INSTITUTION_TABLE_ColumnRules", payload: res.columns });
        dispatch({ type: "INSTITUTION_TABLE_LOADING", payload: false, });
    }).catch(() => {
        message.error("表格加载失败！");
        dispatch({ type: "INSTITUTION_TABLE_LOADING", payload: false, });
    })
}


export let GetTypes = () => dispatch =>{
    Axios.get({url:'/api/institution/types'}).then(res => {
        dispatch({
            type:"Get_Types",
            payload:res.items,
        })
    }).catch(err => {
        message.error("用户类型获取失败！");
    })
}

export let GetClasses = () => dispatch =>{
    Axios.get({url:'/api/institution/classes'}).then(res => {
        dispatch({
            type:"Get_Classes",
            payload:res.items,
        })
    }).catch( err => {
        message.error("医院等级获取失败！");
    })
}

export let CreateInstitution = (data) => dispatch => {
    return Axios.post({
        url: "/api/institution",
        data: data,
        contentType: "application/json",
    })
}

export let EditInstitution = (data) => dispatch => {
    return Axios.put({
        url: `/api/institution/${data.id}`,
        data: data,
        contentType: "application/json",
    })
}


export let DeleteInstitution = (id) => dispatch => {
    return Axios.delete({
        url: `/api/institution/${id}`
    })
}


