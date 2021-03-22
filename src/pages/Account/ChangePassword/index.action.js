import { Axios } from "react";

export let ChangePassword = (data) => dispatch => {
    return Axios.post({
        url:"/api/identity/my-profile/change-password",
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