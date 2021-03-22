export default function (
    state= {
        subjects:[],
        loading: false,
        columnrules: [],
    },
    action
) {
    switch(action.type) {
        case "Get_Subject":
            return {
                ...state,
                subjects: action.payload,
            }
        case "Subject_Loading":
            return {
                ...state,
                loading: action.payload,
            }
        case "Subject_ColumnRules":
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