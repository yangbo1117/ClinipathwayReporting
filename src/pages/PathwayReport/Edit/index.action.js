import { Axios } from 'react';

export let GetPathwayReport = (id, Np) =>dispatch =>{
    Axios.get({
        url:`/api/PathwayReport/${id}`
    }).then(res=>{
        dispatch({
            type:'MODIFY_GETPATHWAYREPORT',
            payload: res,
        })
    })
}

export let PutPathwayReport = data => dispatch =>{
     return Axios.patch({
        url:'/api/PathwayReport/' + data.id,
        data:data,
        contentType:"application/json"
    })
}