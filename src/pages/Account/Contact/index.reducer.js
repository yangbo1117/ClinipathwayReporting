export default function(
    state = {
        contacts: [],
        loading: false,
        total: 0,
        columnrules: [],
    },
    action
)
{
    switch(action.type) {
        case "Account_GetContacts":
            return {
                ...state,
                contacts: action.payload,
            }
        case "Account_ContactLoading":
            return {
                ...state,
                loading: action.payload,
            }
        case "Account_ContactTotal":
            return {
                ...state,
                total: action.payload,
            }
        case "Account_ContactColumnRules":
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