export let LoginOut = () => dispatch =>{
    dispatch({
        type: 'Store_Token_Role',
        payload: { "accessToken": null, "roles": [ "" ] },
    });
    dispatch({
        type: "ChangeGuidance",
        payload: true
    })
}

export let ChangeGuidanceStatus = (value) => dispatch => {
    dispatch({
        type: "ChangeGuidance",
        payload: value
    })
}
