export default function(
    state = {
        data: [],
        loading: false,
        total: 0,
        columnrules: [], //sort规则
        //details
        detailsData: [],
        detailsLoading: false,
    },
    action
)
{
    switch(action.type){
        case "DataReviewManageData":
            return {
                ...state,
                data: action.payload,
            }
        case "DataReviewManageLoading":
            return {
                ...state,
                loading: action.payload,
            }
        case "DataReviewManageTotal":
            return {
                ...state,
                total: action.payload,
            }
        case "DataReviewManageColumnRules":
            return {
                ...state,
                columnrules: action.payload,
            }
        case "GetPathwayReportFromParentId_Loading":
            return{
                ...state,
                detailsLoading: action.payload,
            }
        case "GetPathwayReportFromParentId_TableData":
            return {
                ...state,
                detailsData: action.payload,
            }
        default: 
            return {
                ...state,
            }
    }
}