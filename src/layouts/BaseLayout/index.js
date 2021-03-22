import React, { Fragment } from 'react';
import { Layout, Menu, ConfigProvider, Badge, Tabs, Card, Dropdown, Avatar, Tooltip, Comment, Empty, Button } from 'antd';
// import { menus } from '../menulist';
// import { routerlist } from '../routerlist';
import { Link, Switch, Redirect, Route } from 'react-router-dom';
import logo from 'assets/img/50X50Logo.png';
import { UserOutlined, SettingOutlined, ImportOutlined, BellOutlined, AlertTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import zh_CN from 'antd/es/locale/zh_CN'; //汉化
import './index.scss';
import CustomCard from '../CustomCard';
import NotFound from 'pages/NotFound/index';
import moment from 'moment';
import * as actions from './index.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { PubSub } from 'pubsub-js';
import rootroutes from "layouts/rootRoute";

var socket;
const { Header, Footer, Sider } = Layout
const { SubMenu } = Menu;
const { TabPane } = Tabs
// let rootSubmenuKeys= menus.map(k=>k.url) //menu菜单栏


class BaseLayout extends React.Component {
    constructor(props) {
        super(props)
        this.toggleContainer = React.createRef();
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
    }
    state = {
        isOpen: false, //消息通知栏
        timeOutId: null,
        openKeys: [], //menu展开keys
        // routerArr:[],
        bellbottom: '通知', //消息推送底部文案
        onmessage: [],
    }

    showGuidance1 = () => {
        let target = document.querySelector(".firstguidance")
        target.style.display = "block";
    }
    hideGuidance1 = () => {
        let target = document.querySelector(".firstguidance")
        target.style.display = "none";
        this.showGuidance2();
    }
    showGuidance2 = () => {
        let target = document.querySelector(".nextguidance")
        target.style.display = "block";
    }
    hideGuidance2 = () => {
        let target = document.querySelector(".nextguidance")
        target.style.display = "none";
        this.props.ChangeGuidanceStatus(false)
    }


    componentDidMount() {
        const { token } = this.props;
        socket = new WebSocket('wss://' + React.websockUrl + '/notifications?token=' + token);
        socket.addEventListener('open', function () {
            console.log('websocket连接成功')
        })
        socket.addEventListener('message', function (event) {
            let obj = JSON.parse(event.data);
            PubSub.publish('message', obj);
        })
        const _this = this;
        PubSub.subscribe('message', function (topic, message) {
            //message 为接收到的消息  这里进行业务处理
            _this.handleMessage(message)
        })
        window.addEventListener('click', this.onClickOutsideHandler);
    }

    handleMessage = (msg) => { //消息通知
        const newarr = this.state.onmessage;
        newarr.push(msg)
        this.setState({ onmessage: newarr })
    }

    componentWillUnmount() {
        socket.close();
        window.removeEventListener('click', this.onClickOutsideHandler);
    }

    TabsChange = key => { //更改通知底部文案
        this.setState({ bellbottom: key })
    }
    handleClear = () => { //清空消息
        const { bellbottom } = this.state;
        if (bellbottom === '通知') { this.setState({ onmessage: [] }) }
    }

    //用户窗口
    onClickHandler() {
        this.setState(currentState => ({
            isOpen: !currentState.isOpen
        }));
    }
    onClickOutsideHandler(event) {
        if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
            this.setState({ isOpen: false });
        }
    }

    // // 菜单手风琴模式
    // onOpenChange = openKeys => {
    //     const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    //     if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    //       this.setState({ openKeys });
    //     } else {
    //       this.setState({
    //         openKeys: latestOpenKey ? [latestOpenKey] : [],
    //       });
    //     }
    // };


    // 递归生成菜单
    _getMenus(menus) {
        const { roles } = this.props;
        return menus.map(item => {
            // let sum = _.indexOf(item.access,roles[0]);
            let isAccess = false;
            if(_.isEmpty(item.access)){
                isAccess = true;
            }else {
                isAccess = !_.isEmpty(_.intersection(item.access, roles)); //一个用户可能含有多种权限
            } 
            if (item.ismenu) {
                if (isAccess && item.children) {
                    return (
                        <SubMenu
                            key={item.url}
                            className={_.last(item.url.split("/"))}
                            title={
                                <div>
                                    {item.icon}
                                    <span>{item.name}</span>
                                </div>
                            }
                        >
                            {this._getMenus(item.children)}
                        </SubMenu>
                    )
                }
                return (isAccess ?
                    <Menu.Item
                        key={item.url}
                        className={_.last(item.url.split("/"))}
                    >
                        <Link to={item.url}>
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    </Menu.Item> : null
                )
            } else {
                return null;
            }
        })
    }

    //生成路由
    _getAuth(routerlist, routerArr) {
        routerlist.forEach(item => {
            if (item.children) {
                this._getAuth(item.children, routerArr)
            }
            if (item.ispage) {
                routerArr.push(<CustomCard path={`${item.url}`} component={item.component} key={item.url} data={item} access={item.access} />)
            }
        })
        return routerArr;
    }

    // componentWillMount(){
    //     this._getAuth(routerlist);
    // }

    //登出
    loginOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.props.LoginOut();
        setTimeout(() => {
            this.props.history.push('/Login');
            localStorage.removeItem("persist:root");
            // localStorage.removeItem("access_roles");
            // localStorage.removeItem("access_token");
        }, 200)
    }

    render() {
        const { isOpen, bellbottom, onmessage } = this.state;
        const { username, roles, institutionName } = this.props;
        const menuuser = (
            <Menu>
                <Menu.Item key="0">
                    <p style={{ padding: '0 10px' }}><UserOutlined /><span> 个人中心</span></p>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                    <p style={{ padding: '0 10px' }}><Link to='/Layout/Account/ChangePassword'><SettingOutlined /><span> 修改密码</span></Link></p>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">
                    <p style={{ padding: '0 10px' }} onClick={this.loginOut}><ImportOutlined /><span> 退出登录</span></p>
                </Menu.Item>
            </Menu>
        );
        const overlayStyle = {
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 2px 6px 0 rgba(29,201,183,.5)',
        }

        return (
            <Fragment>
                <div className="firstguidance guidancebox" style={{ display: "none" }} >
                    <div className="firstbox">
                        上传临床路径报表: 1.临床路径专业及病种-临床路径开展，开展临床路径   <span className="guidance_btn" onClick={this.hideGuidance1}>点击下一步</span>
                    </div>
                </div>
                <div className="nextguidance guidancebox" style={{ display: "none" }}>
                    <div className="nextbox" >
                        2.点击在线填报, 填写报表 <span className="guidance_btn" onClick={this.hideGuidance2}>确 认</span>
                    </div>
                </div>
                <div id='baseLayout'>
                    <ConfigProvider locale={zh_CN}>
                        <Layout style={{ minHeight: '100vh' }}>
                            <div id='custommenu'>
                                <Sider
                                    style={{ minHeight: '100vh', position: 'fixed', left: '0', top: '0', }}
                                    breakpoint="lg"
                                    collapsedWidth="0"
                                    width={250}
                                >
                                    <div className="custommenu_logo title-b" >
                                        <img src={logo} alt=''></img>
                                        &nbsp;&nbsp;&nbsp;
                                        <span>临床路径上报系统</span>
                                    </div>
                                    <Menu
                                        theme="dark"
                                        subMenuOpenDelay={0.1} //用户鼠标进入子菜单后开启延时，单位：秒
                                        mode="inline"
                                        defaultSelectedKeys={['/Layout/DataReporting/Index']} //默认选中
                                        defaultOpenKeys={['/Layout/DataReporting']}
                                        selectedKeys={[this.props.location.pathname]}
                                    >
                                        {_.compact(this._getMenus(rootroutes))}
                                    </Menu>
                                </Sider>
                            </div>
                            <Layout>
                                <div className="site-layout-sub-header-background">
                                    <Header style={{ padding: '0 24px', background: '#fff', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                                        <div className='baselayout_header_box' ref={this.toggleContainer} >
                                            {
                                                _.includes(roles, 'Hospital') ? <Tooltip title="上传报表引导" placement="bottom" color={"#87d068"}>
                                                    <InfoCircleOutlined className="span-cursor space-padding12" onClick={this.showGuidance1} />
                                                </Tooltip> : null
                                            }
                                            <section>{institutionName}</section>
                                            <section className='baselayout_header_bell'>
                                                <span className='baselayout_header_icon' onClick={this.onClickHandler}><Badge count={onmessage.length} offset={[4, -1]}><BellOutlined style={{ fontSize: '16px' }} /></Badge></span>
                                                {
                                                    isOpen ? <div className='baselayout_header_card'>
                                                        <Card style={{ width: 300 }} size='small' bodyStyle={{ padding: ' 0 24px   ' }} actions={[
                                                            <Button onClick={this.handleClear} type='link'>清空 {bellbottom}</Button>,
                                                            <Button disabled type='link'>查看所有</Button>
                                                        ]}>
                                                            <Tabs defaultActiveKey="通知" tabBarStyle={{ textAlign: 'center' }} onChange={this.TabsChange}>
                                                                <TabPane tab={<span>通知({onmessage.length})</span>} key="通知">
                                                                    {
                                                                        onmessage.length > 0 ? onmessage.map((item, index) => {
                                                                            return (<Comment
                                                                                // actions={actions}
                                                                                key={index}
                                                                                author={<span>消息{index}</span>}
                                                                                avatar={
                                                                                    <Avatar icon={<AlertTwoTone />} />
                                                                                }
                                                                                content={
                                                                                    <p>{item.Message}</p>
                                                                                }
                                                                                datetime={
                                                                                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                                                                        <span>{item.TimeStamp.split('.')[0]}</span>
                                                                                    </Tooltip>
                                                                                }
                                                                            />)
                                                                        }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`暂无消息`} />
                                                                    }
                                                                </TabPane>
                                                                <TabPane tab="消息" key='消息'>
                                                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`暂无消息`} />
                                                                </TabPane>
                                                            </Tabs>
                                                        </Card>
                                                    </div> : null
                                                }
                                            </section>
                                            <section className='baselayout_header_user'>
                                                <Dropdown overlay={menuuser} overlayStyle={overlayStyle} trigger={['click']}>
                                                    <div className='baselayout_header_userpic' >
                                                        <UserOutlined onClick={this.onUser} style={{ fontSize: '20px' }} />
                                                        <span>{username}</span>
                                                    </div>
                                                </Dropdown>
                                            </section>
                                        </div>
                                    </Header>
                                </div>
                                <Switch>
                                    {this._getAuth(rootroutes, [])}
                                    {/* {_.includes(roles, 'Admin') ? <Redirect exact from='/Layout' to='/Layout/EmptyHome'></Redirect> : null} */}
                                    {_.includes(roles, 'Hospital') ? <Redirect exact from='/Layout' to='/Layout/Home'></Redirect> : null}
                                    {_.includes(roles, 'Government') ? <Redirect exact from='/Layout' to='/Layout/PathwayReport/ManageMent'></Redirect> : null}
                                    {_.includes(roles, 'Association') ? <Redirect exact from='/Layout' to='/Layout/DataReview/ManageMent'></Redirect> : null}
                                    <Redirect exact from='/Layout' to='/Layout/EmptyHome'></Redirect>
                                    <Route component={NotFound}></Route>
                                </Switch>
                                <Footer style={{ textAlign: 'center' }}>©Copyright 上海联众网络信息有限公司版本号:1.1.0 技术支持</Footer>
                            </Layout>
                        </Layout>
                    </ConfigProvider>
                </div>
            </Fragment>
        )
    }
}


export default connect(
    state => ({
        username: state.Login.Message.name,
        roles: state.Login.Auth.roles,
        institutionName: state.Login.institutionName,
        token: state.Login.Auth.accessToken,
        guidance: state.baseLayout.guidance
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(BaseLayout);