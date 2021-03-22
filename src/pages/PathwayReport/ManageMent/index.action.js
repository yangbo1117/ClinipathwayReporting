import { Axios } from 'react';
import { message } from 'antd';
  
//获取列表
export let GetPathwayReport = (params) => dispatch =>{  //根据状态获取
    dispatch({
        type: 'GetManaPathwayReport_Loading',
        payload: true,
    })
    Axios.get({
        url: "/api/PathwayReport",
        params: {
            "SkipCount": 0,
            "MaxResultCount": 10,
            "simplifiedName": false,
            ...params,
        },
    }).then(res=>{
        let result = res.items.map(i=>({key:i.id,...i}));
        dispatch({
            type:'GetManaPathwayReport',
            payload: result
        });
        dispatch({
            type: "GetManaPathwayReport_Total",
            payload: res.totalCount
        })
        dispatch({
            type: "GetManaPathwayReport_ColumnRules",
            payload: res.columns,
        })
        dispatch({
            type: 'GetManaPathwayReport_Loading',
            payload: false,
        })
    }).catch(err=>{
        message.error('表格信息加载失败！');
        dispatch({
            type: 'GetManaPathwayReport_Loading',
            payload: false,
        })
    })
}

//获取提交表格信息
export let GetLockedPathwayReport = (status) => dispatch =>{ //协会从定向获取提交
    dispatch({
        type: 'GetManaPathwayReport_Loading',
        payload: true,
    })
    Axios.get({
        url:"/api/PathwayAssocReport/locked"
    }).then(res=>{
        let result = res.map(i=>({key:i.id,...i}))
        dispatch({
            type:'JURISDICTION_DATAFILLING_GET',
            payload: result
        })
        dispatch({
            type: 'GetManaPathwayReport_Loading',
            payload: false,
        })
    }).catch(err=>{
        message.error('表格信息加载失败！');
        dispatch({
            type: 'GetManaPathwayReport_Loading',
            payload: false,
        })
    })
}
export let ClearnData = () => dispatch =>{ //清空store里面的数据源
    dispatch({
        type:'JURISDICTION_DATAFILLING_GET',
        payload: [],
    })
}

export let DeletePathwayReport = (id) => dispatch =>{ //删除临床路径任务
    return Axios.delete({
        url:`/api/PathwayReport/${id}`
    })
}

export let ConfirmPathwayReport = (id) => dispatch =>{ //确认临床路径任务
    return Axios.post({
        url:`/api/PathwayReport/${id}/Confirm`
    })
}

export let GetPathwayManangeInstitution = (id) => dispatch => {
    Axios.get({
        url: '/api/institution/children',
    }).then(res => {
        dispatch({
            type: "GetPathwayManangeInstitution",
            payload: res.items,
        })
    }).catch(err => {
        message.error("机构数据获取失败！");
    })
} 