export default function(
    state = {
        announcements: [],
        total: 0,
    },
    action
)
{
    switch(action.type) {
        case "Welecome_Data":
            return {
                ...state,
                announcements: action.payload,
            }
        case "Welcome_Total":
            return {
                ...state,
                total: action.payload,
            }
        default:
            return {
                ...state,
            }
    }
}