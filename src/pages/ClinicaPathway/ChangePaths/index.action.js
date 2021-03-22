import { Axios } from "react";
import { message } from "antd";
import _ from "lodash";

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

function EnableSubject (enable, id, subjects) {
    subjects.forEach((value, index) => {
        if(value.id === id) {
            subjects[index]["enable"] = enable
        }
        if(value.hasChild) {
            subjects[index]["children"] = EnableSubject(enable, id, subjects[index]["children"]);
        }
    })
    return subjects;
}

export let GetUserSubject = () => dispatch => {
    dispatch({ type: "GetUser_Loading1", payload: true });
    Axios.get({
        url: "/api/user/subjects"
    }).then(res => {
        let result = AddKey(res.items);
        dispatch({
            type: "GetUser_Subjects",
            payload: result
        })
        dispatch({ type: "GetUser_Loading1", payload: false });
    }).catch(error => {
        message.error("专业列表加载失败");
        dispatch({ type: "GetUser_Loading1", payload: false });
    })
} 

export let GetUserPaths = (subjectId) => dispatch => {
    dispatch({ type: "GetUser_Loading2", payload: true });
    Axios.get({
        url: `/api/user/paths/${subjectId}`
    }).then(res => {
        let newPaths = _.map(res.items, (i) => ({ ...i, "key": i.id }));
        dispatch({
            type: "GetUser_SubjectPaths",
            payload: newPaths
        })
        dispatch({ type: "GetUser_Loading2", payload: false });
    }).catch(error => {
        message.error("临床路径病种获取失败！");
        dispatch({ type: "GetUser_Loading2", payload: false });
    })
} 

export let ChangeSubject = (enable, id, subjects) => dispatch => {
    dispatch({ type: "GetUser_Loading1", payload: true });
    Axios.post({
        url: "/api/user/subjects",
        data: { id, enable },
        contentType: "application/json",
    }).then(res=> {
        let newSubjects = EnableSubject(enable, id, subjects);
        dispatch({ type: "GetUser_Loading1", payload: false });
        dispatch({
            type: "GetUser_Subjects",
            payload: newSubjects
        });
        message.success("设置成功！");
    }).catch(err => {
        message.error("设置失败！");
        dispatch({ type: "GetUser_Loading1", payload: false });
    })
 }

 export let ChangePath = (enable, id, paths) => dispatch => {
    dispatch({ type: "GetUser_Loading2", payload: true });
    Axios.post({
        url: "/api/user/paths",
        data: { id, enable },
        contentType: "application/json",
    }).then(res => {
        let result = paths.map(i => {
            if(i.id === id) {
                return {
                    ...i,
                    "enable": enable,
                }
            }else {
                return i;
            }
        })
        dispatch({
            type: "GetUser_SubjectPaths",
            payload: result
        });
        dispatch({ type: "GetUser_Loading2", payload: false });
        message.success("设置成功！");
    }).catch(err => {
        message.error("设置失败！");
        dispatch({ type: "GetUser_Loading2", payload: false });
    })
 }

