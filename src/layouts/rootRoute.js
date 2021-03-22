import React from "react";
import { FormOutlined, FileSearchOutlined, OrderedListOutlined, BarChartOutlined, UserSwitchOutlined, TeamOutlined, UnorderedListOutlined, LayoutOutlined } from '@ant-design/icons';

import EmptyHome from "pages/EmptyHome/index"; //空首页
import Home from 'pages/Home/index'; //首页
import DataReporting from "pages/DataReporting/index";
import PathwayReport_Create from 'pages/PathwayReport/Create/index'; //在线填报
import PathwayReport_Upload from 'pages/PathwayReport/DataUploading/index'; //上传
import PathwayReport_ManageMent from 'pages/PathwayReport/ManageMent/index'; //管理信息列表
import PathwayReport_History from 'pages/PathwayReport/History/index'; //查看历史版本
import PathwayReport_View from 'pages/PathwayReport/View/index'; //查看表二
import PathwayReport_Edit from 'pages/PathwayReport/Edit/index'; //查看表二
import PathwayReport_Reject from 'pages/PathwayReport/Reject/index'; // 标记表二
import DataReview_ManageMent from "pages/DataReview/ManageMent/index"; //管理信息
import DataReview_ReView from "pages/DataReview/Review/index"; //管理信息
import DataReview_Reject from "pages/DataReview/Reject/index"; //管理信息
import ClinicaPathway_Subject from "pages/ClinicaPathway/Subject/index";//临床路径专业
import ClinicaPathway_CliniPath from "pages/ClinicaPathway/CliniPath/index";//临床路径
import ClinicaPathway_ChangePaths from "pages/ClinicaPathway/ChangePaths/index";//临床路径
import Institution from 'pages/Institution/index'; //机构管理
import Account_Users from 'pages/Account/Users/index'; //用户列表
import Account_ChangePassword from 'pages/Account/ChangePassword/index'; //修改密码
import Account_Contact from 'pages/Account/Contact/index'; //联系人
import Announcement from "pages/Announcement/index"; //公告管理
import Statistics_Hosp from 'pages/Statistics/Hosp/index'; //机构统计
import Statistics_Government from 'pages/Statistics/Government/index'; //部门统计
import Statistics_Assoc from 'pages/Statistics/Association/index';  //协会统计
import Statistics_TrendAnalysis from 'pages/Statistics/TrendAnalysis/index'; //趋势分析
import Statistics_AreaStatistics from 'pages/Statistics/AreaStatistics/index'; //区域统计
import Statistics_Newsletter from "pages/Statistics/Newsletter/index"; //简讯
import Test from 'pages/Test/index'; //测试页面

export default [
  {
    name: '主页',
    url: '/Layout/EmptyHome',
    ispage: true,
    ismenu: false,
    component: EmptyHome,
    icon: null,
    access: ["Hospital", 'Admin', 'Association', 'Government'],
  },
  {
    name: '首页',
    url: '/Layout/Home',
    ispage: true,
    ismenu: true,
    component: Home,
    icon: <LayoutOutlined />,
    access: ["Hospital"],
  },
  {
    name: "数据填报流程",
    url: '/Layout/ReportingPage',
    ispage: true,
    ismenu: false,
    component: DataReporting,
    icon: null,
    access: ["Hospital"],
  },
  {
    name: '临床路径专业及病种',
    url: '/Layout/ClinicaPathway',
    ispage: false,
    ismenu: true,
    component: null,
    icon: <OrderedListOutlined />,
    access: ["Hospital",'Association'],
    children: [
      {
        name: '临床路径专业',
        ispage: true,
        ismenu: true,
        icon: null,
        component: ClinicaPathway_Subject,
        url: '/Layout/ClinicaPathway/Subject',
        access: ['Association'],
      },
      {
        name: '临床路径病种',
        ispage: true,
        ismenu: true,
        icon: null,
        component: ClinicaPathway_CliniPath,
        url: '/Layout/ClinicaPathway/CliniPath',
        access: ['Association'],
      },
      {
        name: '临床路径开展',
        ispage: true,
        ismenu: true,
        icon: null,
        component: ClinicaPathway_ChangePaths,
        url: '/Layout/ClinicaPathway/ChangePaths',
        access: ['Hospital'],
      },
    ]
  },
  {
    name: '数据填报',
    url: '/Layout/DataReporting',
    ispage: false,
    ismenu: true,
    component: null,
    icon: <FormOutlined />,
    access: ['Hospital', 'Government', 'Association'],
    children: [
      {
        name: "在线填报",
        url: '/Layout/PathwayReport/Create',
        ispage: true,
        ismenu: true,
        icon: null,
        component: PathwayReport_Create,
        access: ["Hospital"],
      },
      {
        name: "上传报表",
        url: '/Layout/PathwayReport/Upload',
        ispage: true,
        ismenu: true,
        icon: null,
        component: PathwayReport_Upload,
        access: ["Hospital"],
      },
      {
        name: '管理信息列表',
        url: '/Layout/PathwayReport/ManageMent',
        ispage: true,
        ismenu: true,
        icon: null,
        component: PathwayReport_ManageMent,
        access: ['Hospital', 'Government'],
      },
      {
        name: "查看报表",
        url: '/Layout/PathwayReport/View',
        ispage: true,
        ismenu: false,
        icon: null,
        component: PathwayReport_View,
        access: ["Hospital", 'Government'],
      },
      {
        name: '修改报表',
        url: '/Layout/PathwayReport/Edit',
        ispage: true,
        ismenu: false,
        icon: null,
        component: PathwayReport_Edit,
        access: ["Hospital"],
      },
      {
        name: '拒绝任务',
        url: '/Layout/PathwayReport/Reject',
        ispage: true,
        ismenu: false,
        icon: null,
        component: PathwayReport_Reject,
        access: ['Government'],
      },
      {
        name: '查询历史批注',
        url: '/Layout/PathwayReport/History',
        ispage: true,
        ismenu: true,
        icon: null,
        component: PathwayReport_History,
        access: ['Government', 'Association'],
      }
    ]
  },
  {
    name: '数据审核',
    url: '/Layout/DataReview',
    ispage: false,
    ismenu: true,
    component: null,
    icon: <FileSearchOutlined />,
    access: ['Association', 'Government'],
    children: [
      {
        name: '数据提交管理列表',
        ispage: true,
        ismenu: true,
        component: DataReview_ManageMent,
        icon: null,
        url: '/Layout/DataReview/ManageMent',
        access: ['Association', 'Government'],
      },
      {
        name: '拒绝任务',
        ispage: true,
        ismenu: false,
        icon: null,
        component: DataReview_Reject,
        url: '/Layout/DataReview/Reject',
        access: ['Association'],
      },
      {
        name: '查看任务',
        ispage: true,
        ismenu: false,
        icon: null,
        component: DataReview_ReView,
        url: '/Layout/DataReview/Review',
        access: ['Association', 'Government'],
      },
     
    ]
  },
  {
    name: '统计报表',
    url: '/Layout/Statistics',
    ispage: false,
    ismenu: true,
    icon: <BarChartOutlined />,
    component: null,
    access: ['Hospital', 'Government', 'Association'],
    children: [
      {
        name: '医疗机构统计',
        ispage: true,
        ismenu: true,
        icon: null,
        component: Statistics_Hosp,
        url: '/Layout/Statistics/Hosp',
        access: ['Hospital', 'Government', 'Association'],
      },
      {
        name: '主管部门统计',
        ispage: true,
        ismenu: true,
        icon: null,
        component: Statistics_Government,
        url: '/Layout/Statistics/Government',
        access: ['Government', 'Association'],
      },
      {
        name: '医院协会统计',
        ispage: true,
        ismenu: true,
        icon: null,
        component: Statistics_Assoc,
        url: '/Layout/Statistics/Association',
        access: ['Association'],
      },
      {
        name: '机构趋势对比',
        ispage: true,
        ismenu: true,
        icon: null,
        component: Statistics_TrendAnalysis,
        url: '/Layout/Statistics/TrendAnalysis',
        access: ['Association', "Government"],
      },
      {
        name: "区域统计",
        ispage: true,
        ismenu: true,
        icon: null,
        component: Statistics_AreaStatistics,
        url: "/Layout/Statistics/AreaStatistics",
        access: ['Association'], 
      },
      {
        name: "简讯管理",
        ispage: true,
        ismenu: true,
        icon: null,
        component: Statistics_Newsletter,
        url: "/Layout/Statistics/Newsletter",
        access: ['Association']
      }
    ]
  },
  {
    name: '机构管理',
    ispage: true,
    ismenu: true,
    icon: <TeamOutlined />,
    url: '/Layout/Institution',
    component: Institution,
    access: ['Admin'],
  },
  {
    name: '账户管理',
    ispage: false,
    ismenu: true,
    icon: <UserSwitchOutlined />,
    component: null,
    url: '/Layout/Account',
    // access: ['Hospital', 'Government', 'Admin', 'Association'],
    children: [
      {
        name: '用户列表',
        ispage: true,
        ismenu: true,
        icon: null,
        component: Account_Users,
        url: '/Layout/Account/Users',
        access: ['Admin'],
      },
      {
        name: '修改密码',
        ispage: true,
        ismenu: true,
        icon: null,
        component: Account_ChangePassword,
        url: '/Layout/Account/ChangePassword',
        // access: ['Hospital', 'Government', 'Admin', 'Association'],
      },
      {
        name: '联系人管理',
        ispage: true,
        ismenu: true,
        icon: null,
        component: Account_Contact,
        url: '/Layout/Account/Contacts',
        access: ['Hospital', 'Government', 'Association'],
      },
    ]
  },
  {
    name: '公告管理',
    ispage: true,
    ismenu: true,
    icon: <UnorderedListOutlined />,
    component: Announcement,
    url: '/Layout/Announcement',
    access: ['Admin'],
  },
  {
    name: '测试页面',
    ispage: true,
    ismenu: false,
    icon: null,
    component: Test,
    url: '/Layout/Test',
    access: ['Hospital', 'Government', 'Admin', 'Association'],
  },
]