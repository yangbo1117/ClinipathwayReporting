const columnGoven = [
    {
        title:'上层机构',  //名称
        name:'上层机构',  //名称
        dataIndex:'superiorGovernmentName', //列
        key:'superiorGovernmentName', //key
        canInput: false, //是否可输入
        isRatio: false,  //是不是比例
    }
]

const columnHosp = [
    {
        title:'机构名称',
        name:'机构名称',
        dataIndex: "hospName",
        key:'hospName',
        canInput: false,
        isRatio:false,
    }
]

const columnClass = [
    {
        title:'级别等次',
        name:'级别等次',
        dataIndex:'hospClass',
        key:'hospClass',
        canInput: false,
        isRatio: false,
    }
]

//专业名称
const columnSubName = [
    {
        title: "专业名称",
        name: "专业名称",
        dataIndex: "specializedSubjectName",
        key: "specializedSubjectName",
        canInput: false,
        isRatio: false,
    }
]

//专业数量
const columnSubCnt = [
    {
        title:'专业数（个）',
        name:'专业数',
        dataIndex: "specializedSubjectCnt",
        key:'specializedSubjectCnt',
        canInput:false,
        isRatio:false,
    }
]


const columnPathCnt = [
    { 
        title:'病种数（个）',
        name:'病种数',
        dataIndex: "specificDiseasesCnt",
        key:'specificDiseasesCnt',
        canInput: false,
        isRatio: false,
    },
]

const columnPathName  = [
    { 
        title:'病种名称',
        name:'病种名称',
        dataIndex: "clinicalPathwayName",
        key:'clinicalPathwayName',
        canInput: false,
        isRatio: false,
    },
]

const columnDiseases = [
    {
        title:'已开展临床路径的病种全院收治人数（例）',
        name:'已开展临床路径的病种全院收治人数',
        dataIndex:'pathwayOfDiseasesCnt',
        key:'pathwayOfDiseasesCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院进入路径人数（例）',
        name:'全院进入路径人数',
        dataIndex: "inPathwayCnt",
        key:'inPathwayCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院入组率（%）',
        name:'全院入组率',
        dataIndex: "inPathwayRatio",
        key:'inPathwayRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院临床路径变异人数（例）',
        name:'全院临床路径变异人数',
        dataIndex: "negativeVariantCnt",
        key:'negativeVariantCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径变异率（%）',
        name:'全院临床路径变异率',
        dataIndex: "negativeVariantRatio",
        key:'negativeVariantRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院退出路径人数（例）',
        name:'全院退出路径人数',
        dataIndex:'outOfPathwayCnt',
        key:'outOfPathwayCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院完成路径人数（例）',
        name:'全院完成路径人数',
        dataIndex:'completionOfPathwayCnt',
        key:'completionOfPathwayCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'入组后全院完成率（%）',
        name:'入组后全院完成率',
        dataIndex:'completionOfPathwayRatio',
        key:'completionOfPathwayRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院出院人数（例）',
        name:'全院出院人数',
        dataIndex:'patCnt',
        key:'patCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院完成路径人数占全院出院人数比例（%）',
        name:'全院完成路径人数占全院出院人数比例',
        dataIndex:'completedPathwayCntToPatCntRatio',
        key:'completedPathwayCntToPatCntRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院临床路径平均住院日（天）',
        name:'全院临床路径平均住院日',
        dataIndex:'inPeriod',
        key:'inPeriod',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径平均住院费用（元）',
        name:'全院临床路径平均住院费用',
        dataIndex:'totalFee',
        key:'totalFee',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径住院均次药费（元）',
        name:'全院临床路径住院均次药费',
        dataIndex:'avgMedicineFee',
        key:'avgMedicineFee',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径预防性使用抗菌药物的人数（例）',
        name:'全院临床路径预防性使用抗菌药物的人数',
        dataIndex:'dddCnt',
        key:'dddCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径预防性抗菌药物使用率（%）',
        name:'全院临床路径预防性抗菌药物使用率',
        dataIndex:'dddRatio',
        key:'dddRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院临床路径治愈人数（例）',
        name:'全院临床路径治愈人数',
        dataIndex:'cureCnt',
        key:'cureCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径好转人数（例）',
        name:'全院临床路径好转人数',
        dataIndex:'improveCnt',
        key:'improveCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径死亡人数（例）',
        name:'全院临床路径死亡人数',
        dataIndex:'deathCnt',
        key:'deathCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径治愈率（%）',
        name:'全院临床路径治愈率',
        dataIndex:'cureRatio',
        key:'cureRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院临床路径好转率（%）',
        name:'全院临床路径好转率',
        dataIndex:'improveRatio',
        key:'improveRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院临床路径管理病种死亡率（%）',
        name:'全院临床路径管理病种死亡率',
        dataIndex:'deathRatio',
        key:'deathRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院临床路径院内感染发生人数（例）',
        name:'全院临床路径院内感染发生人数',
        dataIndex:'infectedCnt',
        key:'infectedCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径院内感染发生率（%）',
        name:'全院临床路径院内感染发生率',
        dataIndex:'infectedRatio',
        key:'infectedRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院临床路径手术人数（例）',
        name:'全院临床路径手术人数',
        dataIndex:'operationCnt',
        key:'operationCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径手术部位感染人数（例）',
        name:'全院临床路径手术部位感染人数',
        dataIndex:'operationInfectedCnt',
        key:'operationInfectedCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径手术部位感染率（%）',
        name:'全院临床路径手术部位感染率',
        dataIndex:'operationInfectedRatio',
        key:'operationInfectedRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院临床路径再住院人数（例）',
        name:'全院临床路径再住院人数',
        dataIndex:'backInCnt',
        key:'backInCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径再住院率（%）',
        name:'全院临床路径再住院率',
        dataIndex:'backInRatio',
        key:'backInRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院临床路径非计划重返手术室发生人数（例）',
        name:'全院临床路径非计划重返手术室发生人数',
        dataIndex:'operationReturnCnt',
        key:'operationReturnCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径非计划重返手术室发生率（%）',
        name:'全院临床路径非计划重返手术室发生率',
        dataIndex:'operationReturnRatio',
        key:'operationReturnRatio',
        canInput: false,
        isRatio: true,
    },
    {
        title:'全院临床路径常见并发症发生人数（例）',
        name:'全院临床路径常见并发症发生人数',
        dataIndex:'complicationCnt',
        key:'complicationCnt',
        canInput: true,
        isRatio: false,
    },
    {
        title:'全院临床路径常见并发症发生率（%）',
        name:'全院临床路径常见并发症发生率',
        dataIndex:'complicationRatio',
        key:'complicationRatio',
        canInput: false,
        isRatio: true,
    },
]

const columnYear = [
    {
        title: "年份",
        name: "年份",
        dataIndex: "year",
        key: "year",
        canInput: false,
        isRatio: false,
    }
]

const columnQuarter = [
    {
        title: "季度",
        dataIndex: "quarter",
        key: "quarter",
        canInput: false,
        isRatio: false,
    }
]

//日期
const columnDate = [
    {
        title: '时间',
        name: '时间',
        dataIndex: "formatDate",
        key: "formatDate",
        canInput: false,
        isRatio: false
    }
]

//统计
const columnSummary = [
    { 
        title: "汇总", 
        name: "汇总",
        width: 100, 
        dataIndex: 'summary', 
        key: 'summary',
        canInput: false,
        isRatio: false,
    }, 
    { 
        title: "医院数量", 
        name: "医院数量",
        width: 100, 
        dataIndex: 'total', 
        key: 'total',
        canInput: false,
        isRatio: false,
    },
    { 
        title: "医院数量值", 
        width: 100, 
        name: "医院数量值",
        dataIndex: 'totalVal', 
        key: 'totalVal',
        canInput: false,
        isRatio: false,
    },
    { 
        title: "开展医院数量",
        name: "开展医院数量",
        width: 200, 
        dataIndex: 'openCnt', 
        key: 'openCnt' 
    }, 
    { 
        title: "开展医院数量值", 
        name: "开展医院数量值",
        width: 100, 
        dataIndex: 'openCntVal', 
        key: 'openCntVal',
        canInput: false,
        isRatio: false,
    }, 
    { 
        title: "比例", 
        name: "比例",
        width: 100, 
        dataIndex: 'scale', 
        key: 'scale',
        canInput: false,
        isRatio: false,
    }, 
    { 
        title: "比例值", 
        width: 100, 
        name: "比例值",
        dataIndex: 'scaleVal', 
        key: 'scaleVal',
        canInput: false,
        isRatio: false,
    },
]

const columnsChart = {
    "specializedSubjectName": "专业名称",
    "specializedSubjectCnt": "专业数",
    "specificDiseasesCnt": "病种数",
    "pathwayOfDiseasesCnt": "已开展临床路径的病种全院收治人数",
    "inPathwayCnt": "全院进入路径人数",
    "inPathwayRatio": "全院入组率",
    "negativeVariantCnt": "全院临床路径变异人数",
    "negativeVariantRatio": "全院临床路径变异率",
    "outOfPathwayCnt": "全院临床路径变异率",
    "completionOfPathwayCnt": "全院完成路径人数",
    "completionOfPathwayRatio": "入组后全院完成率",
    "patCnt": "全院出院人数",
    "completedPathwayCntToPatCntRatio": "全院完成路径人数占全院出院人数比例",
    "inPeriod":"全院临床路径平均住院日",
    "totalFee": "全院临床路径平均住院费用",
    "avgMedicineFee": "全院临床路径住院均次药费",
    "dddCnt": "全院临床路径预防性使用抗菌药物的人数",
    "dddRatio": "全院临床路径预防性抗菌药物使用率",
    "cureCnt": "全院临床路径治愈人数",
    "improveCnt": "全院临床路径好转人数",
    "deathCnt": "全院临床路径死亡人数",
    "cureRatio": "全院临床路径治愈率",
    "improveRatio": "全院临床路径好转率",
    "deathRatio": "全院临床路径管理病种死亡率",
    "infectedCnt": "全院临床路径院内感染发生人数",
    "infectedRatio": "全院临床路径院内感染发生率",
    "operationCnt": "全院临床路径手术人数",
    "operationInfectedCnt": "全院临床路径手术部位感染人数",
    "operationInfectedRatio": "全院临床路径手术部位感染率",
    "backInCnt": "全院临床路径再住院人数",
    "backInRatio": "全院临床路径再住院率",
    "operationReturnCnt": "全院临床路径非计划重返手术室发生人数",
    "operationReturnRatio": "全院临床路径非计划重返手术室发生率",
    "complicationCnt": "全院临床路径常见并发症发生人数",
    "complicationRatio": "全院临床路径常见并发症发生率",
}

//导出
export { 
    columnGoven,
    columnHosp,
    columnClass,
    columnSubName,
    columnSubCnt,
    columnPathCnt,
    columnPathName,
    columnDiseases,
    columnYear,
    columnQuarter,
    columnDate,
    columnSummary,
    columnsChart,
 };
