import  React, { Axios } from "react";
import _ from "lodash";
import { message, Typography } from "antd";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

function renderTree (data)
{
    data.forEach((value,index) => {
        if(value.children && !_.isEmpty(value.children))
        {
            data[index]= {
                "title": value.name, 
                "value": value.id, 
                "icon": <Text type="warning"><TeamOutlined /></Text>,
                ...value 
            };
            data[index]['children'] = renderTree(data[index]['children'])
        }else {
            data[index]= {
                "title": value.name, 
                "value": value.id, 
                "icon": <Text type="warning"><UserOutlined /></Text>,
                ...value 
            };
        }
    })
    return data;
}

export let GetUsers = (params) => dispatch => {
    dispatch({ type: "User_Loading", payload: true });
    Axios.get({
        url: "/api/identity/users",
        params: {
            "SkipCount": 0,
            "MaxResultCount": 10,
            ...params,
        },
    }).then(res => {
        let result = _.map(res.items, function(value, key) {
            return {
                ...value,
                "key": value.id
            }
        });
        dispatch({
            type: "Get_Users",
            payload: result,
        })
        dispatch({ type: "User_ColumnRules", payload: res.columns });
        dispatch({ type: "User_Total", payload: res.totalCount });
        dispatch({ type: "User_Loading", payload: false });
    }).catch( err => {
        message.error("用户列表获取失败！");
        dispatch({ type: "User_Loading", payload: false });
    })
}

export let GetInstitution = () => dispatch => {
    Axios.get({
        url: "/api/institution",
    }).then(res => {
        let result = renderTree(res.items);
        dispatch({
            type: "User_Institution",
            payload: result,
        })
    }).catch(err => {
        message.error("机构列表加载失败");
    })
}

export let CreateUser = (data) => dispatch => {
    return Axios.post({
        url:"/api/identity/users",
        data: data,
        noTip: true,
        contentType: "application/json",
    })
}

export let EditUser = (data) => dispatch => {
    return Axios.put({
        url:`/api/identity/users/${data.id}`,
        data: data,
        contentType: "application/json",
    })
}

export let DeleteUser = (id) => dispatch => {
    return Axios.delete({
        url: `/api/identity/users/${id}`
    })
}

export let ManageUser = (data) => dispatch => {
    return Axios.put({
        url: `/api/account/${data.id}/institution/${data.parentId}`
    })
}
export let ClearnManageUser = (id) => dispatch => {
    return Axios.delete({
        url: `/api/account/${id}/institution`
    })
}

export let GetInstitutionUser = (id) => dispatch => {
    return Axios.get({
        url: `/api/user/${id}/institution`,
    })
}

export let checkUserPassword = (data) => dispatch => {
    return Axios.post({
        url: "/api/user/change-password",
        data: data,
        contentType: "application/json",
    })
}

export let setAdmin = (id, data) => dispatch => {
    return Axios.put({
        url: `/api/identity/users/${id}/roles`,
        data: data,
        contentType: "application/json",
    })
}

export let LoginOut = () => dispatch => {
    dispatch({
        type: 'Store_Token_Role',
        payload: { "accessToken": null, "roles": [ "" ] },
    });
}