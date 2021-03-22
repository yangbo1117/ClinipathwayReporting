export default function(state={
    institutions: [],
    types: [],
    classes: [],
    loading: false,
    columnrules: [],
},action){
    switch(action.type){
        case 'GET_INSTITUTION':
            return{
                ...state,
                institutions: action.payload,
            }
        case 'Get_Types':
            return{
                ...state,
                types: action.payload,
            }
        case 'Get_Classes':
            return{
                ...state,
                classes: action.payload,
            }
        case "INSTITUTION_TABLE_LOADING":
            return{
                ...state,
                loading: action.payload,
            }
        case "INSTITUTION_TABLE_ColumnRules":
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

