// import ajson from "./trend.json";
export default function(
    state = {
        // data: ajson.details,
        // summarydata: {...ajson.summary,
        //     "organizationName": "所选机构合集",
        //     "organizationId": "allCheck"
        // },
        // dataItem: ajson.details[0],
        // activeKey: ajson.details[0].organizationName,
        // rabarInstitutionName: ajson.details[0].organizationName,
        // rabarInstitutionNameItem: ajson.details[0].details[0].formatDate,
        data: [],
        summarydata: {},
        dataItem: {}, //单个机构的数据
        activeKey: "初始机构",
        rabarInstitutionName: null,
        rabarInstitutionNameItem: null,
        years: [],
        loading: false,
        institutions: [], //机构
        
    },
    action
)
{
    switch(action.type) {
        case "TrendGetReportYear":
            return {
                ...state,
                years: action.payload,
            }
        case "GetReportTrendLoading":
            return {
                ...state,
                loading: action.payload,
            }
        case "GetReportTrendData":
            return {
                ...state,
                data: action.payload,
            }
        case "GetReportTrendSummaryData":
            return {
                ...state,
                summarydata: {
                    ...action.payload,
                    "organizationName": "所选机构合集",
                    "organizationId": "allCheck",
                },
            }
        case "GetReportTrendDataItem":
            return {
                ...state,
                dataItem: action.payload,
                activeKey: action.payload.organizationName,
                rabarInstitutionName: action.payload.organizationName,
            }
        case "TrendGetInstitution":
            return {
                ...state,
                institutions: action.payload,
            }
        case "TrendChangeDataItem":
            return {
                ...state,
                dataItem: action.payload,
                activeKey: action.payload.organizationName
            }
        case "ChangeInstitutionNameTrend":
            return {
                ...state,
                rabarInstitutionName: action.payload,
            }
        case "ChangeInstitutionNameItem":
            return {
                ...state,
                rabarInstitutionNameItem: action.payload,
            }
        default:
            return {
                ...state,
            }
    }
}


