export default function (
    state = {
        loading: false,
        // data: [],
        data: { columns: [], dataSource: [] },
    },
    action,
) {
    switch (action.type) {
        case 'GetAreaStatisticsData':
            return {
                ...state,
                data: action.payload,
            }
        case 'GetAreaStatisticsLoading':
            return {
                ...state,
                loading: action.payload,
            }
        default:
            return {
                ...state,
            }
    }
}