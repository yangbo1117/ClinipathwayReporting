export default function (
    state = {
        users: [],
        loading: false,
        total: 0,
        institutions: [],
        columnrules: [],
    },
    action
)
{
    switch(action.type) {
        case "Get_Users":
            return {
                ...state,
                users: action.payload,
            }
        case "User_Loading":
            return {
                ...state,
                loading: action.payload,
            }
        case "User_Total":
            return {
                ...state,
                total: action.payload,
            }
        case "User_Institution":
            return {
                ...state,
                institutions: action.payload,
            }
        case "User_ColumnRules":
            return {
                ...state,
                columnrules: action.payload,
            }
        default:
            return {
                ...state,
            }
    }
}