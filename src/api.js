// 接口

export default {
  // 关注人员、系统推送人员
  personList: {
    // 线索标签
    findClueLabel: "dic/findClueLabel",
    // 户籍地
    findCensusRegister: "dic/findCensusRegister",
    // 关注人员
    findConcernPerson: "suspicious/findConcernPerson",
    // 系统推送人员
    findUnConcernPerson: "suspicious/findUnConcernPerson",
    // 添加关注
    suspiciousAdd: "suspicious/add",
    // 取消关注
    suspiciousDelete: "suspicious/delete",
    // 获取全息档案 url
    personnelArchives: "person/personnelArchives",
    // 获取关系分析 ur
    personnelShip: "person/personnelShip",
    // 关注人员、系统推送人员是否有更新
    suspiciousIsUpdate: "suspicious/initHome",
    // 配置性隐藏全息档案和关系分析按钮
    getFunctionStatus: "suspicious/getFunctionStatus",
    // 首页活动区域接口
    getActivityLocation: "clue/asyncTree",
    // 删除单一人员
    deletePerson: 'suspicious/delSuspiciousPerson',
    exportHuman: '/client/exportByHuman.do'
  },
  // 聚类研判
  clusterAnalysis: {
    // 搜索聚类研判数据
    analysisPage: "analysis/page.do",
    // tree 树
    asyncTree: "tree/asyncTree.do",
    // 聚类研判-保存到线索
    saveAsClue: "analysis/saveAsClue",
    // 删除线索
    deleteClueInfos: "clue/deleteClueInfos"
  },
  // 线索管理
  clueManage: {
    // 根据证件号查询嫌疑人员信息
    clueFindPersonInfo: "clue/findPersonInfo",
    // 获取线索类型
    findClueType: "dic/findClueType",
    // 查询所有线索
    findAllClues: "clue/findAllClues",
    // 根据证件号查询可以车辆标签和总数
    findBikeLabelAndCodes: "clue/findBikeLabelAndCodes",
    // 关联可疑车辆、自用车辆
    // addToSuspiciousBike: "clue/addToSuspiciousBike", // 1.26
    // 删除关联的车辆
    updateBikeLabel: "clue/updateBikeLabel",
    // 线索查询-车辆颜色字典常量查询接口
    findAllColors: "dic/findAllColors",
    // 添加线索-上传图片-打开上传工具
    clueUploadImg: "client/upload/url.do",
    // 上传附件后，取数据
    clueInfoList: "clue/clueInfoList",
    // 添加线索-上传视频-打开上传工具
    clueUploadVideo: "client/upload/videoUrl.do",
    // 添加线索-上传附件-打开上传工具
    clueUploadFile: "client/upload/fileUrl.do",
    // 下载线索
    downloadClue: "client/download/downloadClueUrl.do",
    // 拖拽车辆归类
    // updateBikeCode: "clue/updateBikeCode", // 1.28
    // 拖拽增加新的车辆分组
    // addBikeCode: "clue/addBikeCode"
    // 合并拖拽点击来关联及新增可疑车辆和自用车辆
    clueGroup: "clue/clueGroup",
    bikeModelQuery: "clue/bikeModelQuery",
    bikeModelQueryMore: "clue/bikeModelQueryMore",
    deleteGroup: "clue/deleteGroupClue",
    updateNote: 'clue/updateNote',
    updateGroup: 'clue/updateGroup',
    exportClues: 'client/export.do',
    personLabelList: 'suspicious/personLabelList',
    modifyLabel: 'suspicious/modifyPersonLabel'
  },
  // 研判报告
  researchReport: {
    //导出研判报告
    exportReport: "report/exportReport",
    // 查询研判报告
    reportSummary: "report/summary",
    // 刷新研判报告
    reportRefresh: "report/refresh",
    // 根据证件号查询可以车辆标签和总数
    findBikeLableAndCodes: "clue/findBikeLabelAndCodes",
    // 获取案件详细信息
    findArchiveCase: "clue/findArchiveCase"
  },
  // 线索详情
  clueDetails: {
    // 获取基本信息
    getClueInfo: "clue/getClueInfo",
    // 保存基本信息
    updateClueInfo: "clue/updateClueInfo",
    // 获取案件详情
    findArchiveCase: "clue/findArchiveCase",
    // 取消案件关联
    cancelArchiveCaseRelation: "clue/cancelArchiveCaseRelation"
  },
  // 线索查询
  clueSearch: {
    // 找点位-查询
    findElectricCarByParam: "search/findElectricCarByParam",
    // 找点位-加入到线索管理
    saveOnlineClue: "search/saveOnlineClue.do",
    //在线视频预览
    token: "search/token",
    // 定位搜-中心点搜索
    findByCameraName: "tree/findByCameraName.do",
    // 定位搜-定位搜索
    querySpatialResource: "search/querySpatialResource",
    // 找点位-定位搜-在线视频结构化
    videoOnlineTask: "search/video/onlineTask",
    // 视频结构化-tab 列表
    findTaskWithPage: "taskManage/findTaskWithPage",
    // 视频结构化-离线上传工具打开
    vidUrl: "search/video/vidUrl.do",
    // 视频结构化-上传视频
    vidConfig: "search/video/vidConfig.do",
    // 视频结构化-获取上传后的视频数据
    getVideoParsingParams: "search/video/getVideoParsingParams",
    // 离线视频的分析接口
    offlineTask: "search/video/offlineTask",
    // 结构化任务-刷新任务状态
    updateTaskStatus: "taskManage/updateTaskStatus",
    // 结构化任务-删除
    batchDelete: "taskManage/batchDelete"
  },
  // 周边案件
  caseIntelligence: {
    // 获取线索详情
    getClueInfo: "clue/getClueInfo",
    // 信息检索-查询
    findCaseByParam: "case/findCaseByParam",
    // 信息检索-关联案件
    relationCaseAndClue: "case/relationCaseAndClue",
    // 地图检索-查询
    findCaseBySpatial: "case/findCaseBySpatial",
    //  案件所属区域
    getCaseLocation: "department/findDepsByParentCode.do"
  },
  // 获取地图信息
  map: {
    // 获取地图配置
    getMapConfig: "getMapConfig"
  },
  // 获取名单库信息
  systemConfig: {
    saveConfig: "systemConfig/saveConfig.do",
    getConfigLibInfo: "systemConfig/getConfigLibInfo.do",
    getAllSystemConfig: "systemConfig/getAllSystemConfig.do",
    refreshLisbrary: "init/syncCriminalPersonInit.do",
    findDeviceList: 'systemConfig/findDeviceList.do',
    findDevicePoolList: 'systemConfig/findDevicePoolList.do'
  },
  // 任务管理配置
  taskConfig: {
    createNewTask: "snapTask/saveSnapTask",
    editTask: "snapTask/updateSnapTask",
    deleteTask: "snapTask/deleteSnapTask",
    getTaskDatas: "snapTask/querySnapTask",
    getTaskDetail: "snapTask/findDetail",
    modifyStatus: "snapTask/modifyStatus",
    getNameList: "snapTask/getLibInfo"
  },
  // 以车搜车
  searchCar: {
    uploadPic: "searchBike/uploadCloud",
    buildModel: "searchBike/analysis",
    search: "searchBike/search",
    featureSearch: 'searchBike/searchParams',
    faceSearch: 'searchFace/search',
    faceBuildModel: 'searchFace/analysis',
    findResourceByMap: 'tree/findResourceByMap',
    searchCase: 'searchBike/searchCase'
  },
  strategyConfig: {
    findAll: 'strategyInfo/findAll',
    findDetail: 'strategyInfo/findDetail',
    createNewStrategy: 'strategyInfo/save',
    updateStrategy: 'strategyInfo/update',
    editStrategy: 'strategyInfo/update',
    deleteStrategy: 'strategyInfo/delete'
  }
};
