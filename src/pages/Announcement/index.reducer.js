export default function(
    state = {
        announcements: [],
        loading: false,
        total: 0,
        columnrules: [],
    },
    action
)
{
    switch(action.type) {
        case "GetAnnouncement_Data":
            return {
                ...state,
                announcements: action.payload,
            }
        case "GetAnnouncement_Loading":
            return {
                ...state,
                loading: action.payload,
            }
        case "GetAnnouncement_totalCount":
            return {
                ...state,
                total: action.payload,
            }
        case "GetAnnouncement_ColumnRules":
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