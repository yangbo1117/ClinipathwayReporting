
import { Axios } from "react";
import { message } from "antd";
import FileSaver from "file-saver";

//下载上传模板
export let DownloadTemplate = (selected) => dispatch => {
    Axios.get({
        url: "/api/pathwayReport/template",
        params: {
            selected,
        },
        responseType: "blob",
    }).then(res => {
        var file = new File([res], "数据报表模板.xlsx", {type: "application/octet-stream;charset=utf-8"});
        FileSaver.saveAs(file);
    }).catch(error => {
        message.error("下载失败！");
    })
}

//下载临床路径
export let DownLoadPaths = () => dispatch => {
    Axios.get({
        url: "/api/cliniPath/download",
        responseType: "blob",
    }).then(res => {
        var file = new File([res], "临床路径专业及病种列表.xlsx", {type: "application/octet-stream;charset=utf-8"});
        FileSaver.saveAs(file);
    }).catch(error => {
        message.error("下载失败！");
    })
}

//下载临床路径专业
export let DownLoadSubject = () => dispatch => {
    Axios.get({
        url: "/api/subject/download",
        responseType: "blob",
    }).then(res => {
        var file = new File([res], "临床路径专业列表.xlsx", {type: "application/octet-stream;charset=utf-8"});
        FileSaver.saveAs(file);
    }).catch(error => {
        message.error("下载失败！");
    })
}

export let UplodaFile = (data, params) => dispatch => {
    return Axios.post({
        url: "/api/pathwayReport/upload",
        data: data,
        noTip: true,
        params: params,
        contentType: "multipart/form-data"
    })
}