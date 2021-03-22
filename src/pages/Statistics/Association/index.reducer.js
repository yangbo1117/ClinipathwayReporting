// import getjson from "./data.json";
export default function(
    state = {
        loading: false,
        years: [],
        total: {},
        center: {},
        others: {},
        source: {},

        reqdata: {},
        selfTrendData: [],
        selfTrendLoading: false,
    },
    action
)
{
    switch(action.type) {
        case "AssocGetReportYear":
            return {
                ...state,
                years: action.payload,
            }
        case "AssocGetReportLoading":
            return {
                ...state,
                loading: action.payload
            }
        case "AssocGetReportDataTotal":
            return{
                ...state,
                total: action.payload
            }
        case "AssocGetReportDataCenter":
            return{
                ...state,
                center: action.payload
            }
        case "AssocGetReportDataOthers":
            return{
                ...state,
                others: action.payload
            }
        case 'AssocGetReportSource': 
            return {
                ...state,
                source: action.payload,
            }
        case 'AssocSelfTrendReqData':
            return {
                ...state,
                reqdata: action.payload,
            }
        case 'AssocSelfTrendLoading':  
            return {
                ...state,
                selfTrendLoading: action.payload,
            }
        case 'AssocSelfTrendData':
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
