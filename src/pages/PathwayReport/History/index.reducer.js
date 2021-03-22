export default function (
    state={
        data:[],
        loading: false,
        institutions: [],
        total: 0,
        columnrules: [],
    }, 
    action)
{
    switch(action.type){
        case "HistoryReportTotalCount":
            return {
                ...state,
                total: action.payload,
            }
        case "GetChildrenInstitution":
            return {
                ...state,
                institutions: action.payload,
            }
        case 'HistoryReportLoading':
            return{
                ...state,
                loading: action.payload
            }
        case "HistoryReportData":
            return {
                ...state,
                data: action.payload,
            }
        default:
            return {
                ...state,
            }
    }
}