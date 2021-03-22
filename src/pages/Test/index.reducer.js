export default function(
    state={
        name:""
    }, action
)
{
    switch(action.type){
        case "Work":
        return{
            ...state,
            name: action.payload,
        }
        default:
            return {
                ...state,
            }
    }
}