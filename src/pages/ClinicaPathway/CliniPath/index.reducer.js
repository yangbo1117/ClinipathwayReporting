export default function(
    state={
        clinipaths: [],
        total: 10,
        subjects: [],
        loading: false,
        columnrules: [],
    },
    action)
{
    switch(action.type) {
        case "Get_CliniPath":
            return {
                ...state,
                clinipaths: action.payload
            }
        case "ClinPath_Total":
            return {
                ...state,
                total: action.payload,
            }
        case "Parents_Subjects":
            return {
                ...state,
                subjects: action.payload
            }
        case "Get_CliniPathLoading":
            return {
                ...state,
                loading: action.payload,
            }
        case "ClinPath_ColumnRules":
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