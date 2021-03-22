
export default function(value) {
    switch(value) {
        case "FirstGeneral":
            return "一级综合"
        case "FirstSpecialist":
            return "一级专科"
        case "SecondGeneral":
            return "二级综合"
        case "SecondSpecialist":
            return "二级专科"
        case "ThirdGeneral":
            return "三级综合"
        case "ThirdSpecialist":
            return "三级专科"
        case "Others":
            return "其他"
        default:
            return "未知"
    }
}

