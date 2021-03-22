export default function (
    state= {
        guidance: true,
    },
    action
) {
    switch(action.type) {
        case "ChangeGuidance":
            return {
                ...state,
                guidance: action.payload,
            }
        default:
            return state
    }
}