export let Work = () => dispatch => {
    dispatch({
        type:"Work",
        payload: "湛山",
    })
}

export let ChangeToken = (data) => dispatch => {
    dispatch({
        type: "Store_Token_Role",
        payload: data,
    })
}