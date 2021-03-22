export default function(state={},action){
    switch(action.type){
        case 'MODIFY_GETPATHWAYREPORT':
            return{
                ...state,
                nodelist: action.payload,
            }
        default:
            return {
                ...state,
            }
    }
}