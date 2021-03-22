export default function(
    state={
        years: [],
        institutions:[],
        loading: false,
        data: {},

        reqdata: {},
        selfTrendData: [],
        selfTrendLoading: false,
    },
    action,
)
{
    switch(action.type) {
        case "HospGetInstitution":
            return {
                ...state,
                institutions: action.payload
            }
        case "HospGetReportYear":
            return {
                ...state,
                years: action.payload,
            }
        case "HospGetReportData":
            return {
                ...state,
                data: action.payload
            }
        case "HospGetReportLoading":
            return {
                ...state,
                loading: action.payload
            }
        case 'HospSelfTrendReqData': 
            return {
                ...state,
                reqdata: action.payload,
            }
        case 'HospSelfTrendLoading': 
            return {
                ...state,
                selfTrendLoading: action.payload,
            }
        case 'HospSelfTrendData': 
            return {
                ...state,
                selfTrendData: action.payload,
            }
        default:
            return {
                ...state,
            }
    }
}

