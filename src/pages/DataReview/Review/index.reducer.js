export default function(
    state={
        data: {},
        loading: false,
        history: [],
        loadList: false,
    },
    action
)
{
    switch(action.type){
        case "GetReViewPathwayReport_Loading":
            return {
                ...state,
                loading: action.payload,
            }
        case "GetReViewPathwayReport_Data":
            return {
                ...state,
                data: action.payload,
            }
        case "GovenPathWayReportView_LoadHistory":
            return {
                ...state,
                loadList: action.payload,
            }
        case "GovenPathWayReportView_History":
            return {
                ...state,
                history: action.payload,
            }
        default:
            return {
                ...state,
            }
    }
}