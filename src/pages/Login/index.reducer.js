export default function(
    state={
        name: "",
        Auth: { "accessToken": null, "roles": [] },
        Message: { "name": null, },
        institutionName: "",
    },action)
{
    switch(action.type){
        case 'Store_Token_Role':
            return{
                ...state,
                Auth: action.payload,
            };
        case "Store_MyProfile":
            return{
                ...state,
                Message: action.payload,
            }
        case "Store_Current":
            return {
                ...state,
                institutionName: action.payload,
            }
        case "Custom":
            return {
                ...state,
                name: action.payload,
            }
        default:
            return state
    }
}