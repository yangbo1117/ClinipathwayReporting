export default function (
    state = {
        data: {},
        loading: false,
        loadList: false,
        history: []
    },
    action,
) {
    switch (action.type) {
        case "PathWayReportView_Loading":
            return {
                ...state,
                loading: action.payload,
            }
        case "PathWayReportView_Data":
            return {
                ...state,
                data: action.payload,
            }
        case "PathWayReportView_LoadHistory":
            return {
                ...state,
                loadList: action.payload,
            }
        case "PathWayReportView_History":
            return {
                ...state,
                history: action.payload
            }
        default:
            return {
                ...state,
            }
    }
}
