import { combineReducers } from 'redux';

import Test from "pages/Test/index.reducer";
import Welcome from "pages/Welcome/index.reducer";
import Login from "pages/Login/index.reducer"; //Login
import baseLayout from "layouts/BaseLayout/index.reducer";

import  ClinicaPathwaySubject from "pages/ClinicaPathway/Subject/index.reducer";
import  ClinicaPathwayCliniPath from "pages/ClinicaPathway/CliniPath/index.reducer";
import  ClinicaPathwayChangePaths from "pages/ClinicaPathway/ChangePaths/index.reducer";

import AccountUser from "pages/Account/Users/index.reducer";
import AccountContact from "pages/Account/Contact/index.reducer";

import Announcement from "pages/Announcement/index.reducer";

import PathwayReportManage from 'pages/PathwayReport/ManageMent/index.reducer';//临床路径表二列表
import PathwayReportCreate from "pages/PathwayReport/Create/index.reducer";
import PathwayReportHistory from 'pages/PathwayReport/History/index.reducer';//carete
import PathwayReportView from 'pages/PathwayReport/View/index.reducer';//View

import Institution from 'pages/Institution/index.reducer'; //机构管理

import StatisticsHosp from "pages/Statistics/Hosp/index.reducer";
import StatisticsGovern from "pages/Statistics/Government/index.reducer";
import StatisticsAssoc from "pages/Statistics/Association/index.reducer";
import StatisticsTrend from "pages/Statistics/TrendAnalysis/index.reducer";
import StatisticsArea from "pages/Statistics/AreaStatistics/index.reducer";

import DataReviewManage from "pages/DataReview/ManageMent/index.reducer";
import DataReviewReview from "pages/DataReview/Review/index.reducer";

export default combineReducers({
    Test,
    Welcome,
    Login,
    baseLayout,
    ClinicaPathwaySubject,
    ClinicaPathwayCliniPath,
    ClinicaPathwayChangePaths,
    AccountUser,
    AccountContact,
    Announcement,
    Institution,
    PathwayReportManage,
    PathwayReportCreate,
    PathwayReportHistory,
    PathwayReportView,
    StatisticsHosp,
    StatisticsGovern,
    StatisticsAssoc,
    StatisticsTrend,
    StatisticsArea,
    DataReviewManage,
    DataReviewReview,
})