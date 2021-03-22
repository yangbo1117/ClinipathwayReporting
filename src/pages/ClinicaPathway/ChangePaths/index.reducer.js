export default function (
    state = {
        subjects: [],
        paths: [],
        loading1: false,
        loading2: false,
    },
    action
)
{
    switch(action.type) {
        case "GetUser_Subjects":
            return {
                ...state,
                subjects: action.payload,
            }
        case "GetUser_SubjectPaths":
            return {
                ...state,
                paths: action.payload,
                pathscopy: action.payload,
            }
        case "GetUser_Loading1":
            return {
                ...state,
                loading1: action.payload
            }
        case "GetUser_Loading2":
            return {
                ...state,
                loading2: action.payload
            }
        default:
            return {
                ...state,
            }
    }
}