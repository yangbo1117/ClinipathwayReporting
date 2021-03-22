import { Axios } from "react";
// https://localhost:5002/api/report/word?year=2020&quarter=4

export const getReportWord = (params) => dispatch => {
    return Axios.get({
        url: "/api/report/word",
        responseType: "blob",
        params: params,
    })
}