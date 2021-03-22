// import getjson from "./data.json";
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
        case "GovernGetInstitution":
            return {
                ...state,
                institutions: action.payload
            }
        case "GovernGetReportYear":
            return {
                ...state,
                years: action.payload,
            }
        case "GovernGetReportData":
            return {
                ...state,
                data: action.payload,
            }
        case "GovernGetReportLoading":
            return {
                ...state,
                loading: action.payload,
            }
        case 'GovernSelfTrendReqData':
            return {
                ...state,
                reqdata: action.payload,
            }
        case 'GovernSelfTrendLoading': 
            return {
                ...state,
                selfTrendLoading: action.payload,
            }
        case 'GovernSelfTrendData': 
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
