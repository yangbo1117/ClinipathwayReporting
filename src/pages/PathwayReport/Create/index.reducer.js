export default function (
    state={
        userInfo: {},
        loading: false,
        settingcolumns: [],
        settingloading: false,
    },
    action
)
{
    switch(action.type) {
        case "ReportCreate_Loading":
            return {
                ...state,
                loading: action.payload
            }
        case "ReportCreate_UserInfo":
            return {
                ...state,
                userInfo: action.payload,
            }
        case "GetSettingPathwayReport_Data":
            return {
                ...state,
                settingcolumns: action.payload,
            }
        case "GetSettingPathwayReport_Loading":
            return {
                ...state,
                settingloading: action.payload,
            }
        default:
            return {
                ...state,
            }
    }
}