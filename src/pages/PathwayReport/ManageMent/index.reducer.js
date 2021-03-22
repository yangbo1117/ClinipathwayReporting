export default function (
    state={
        pathwayreports:[],
        total: 0,
        loading: false,
        institutions: [],
        columnrules: [],
    }, 
    action)
{
    switch(action.type){
        case 'GetManaPathwayReport':
            return{
                ...state,
                pathwayreports:action.payload,
            }
        case 'GetManaPathwayReport_Loading':
            return{
                ...state,
                loading: action.payload
            }
        case "GetManaPathwayReport_Total":
            return {
                ...state,
                total: action.payload,
            }
        case "GetPathwayManangeInstitution":
            return {
                ...state,
                institutions: action.payload,
            }
        case "GetManaPathwayReport_ColumnRules":
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