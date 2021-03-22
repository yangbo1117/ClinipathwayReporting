import React from 'react';
import './index.scss';
import bg from './img/bg.jpg';
import { Row, Col, Typography, Card, ConfigProvider, Tabs, Button, Tag, List } from 'antd';
import { ArrowRightOutlined, DoubleRightOutlined, FileTextOutlined } from '@ant-design/icons';
import zh_CN from 'antd/es/locale/zh_CN'; //汉化
import { connect } from "react-redux";
import  { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { baseurl } from  "src/urls";
const { Title,  Paragraph } = Typography;
const { TabPane } = Tabs;

class Welcomepage extends React.Component {
    constructor(props) {
        super(props);
        this.resize.bind(this);
    }
    state = {
        tabPosition: 'left',
    }
    componentDidMount() {
        this.props.GetAnnouncement();
        this.screenChange();
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this.resize);
    }
    screenChange() {
        window.addEventListener('resize', this.resize);
    }
    resize = () =>{
        let width = document.documentElement.clientWidth;
        if(width<576){
            this.setState({tabPosition:'top'})
        }else{
            this.setState({tabPosition:'left'})
        }
    }
    handleIn = () => {
        this.props.history.push('/Layout')
    }

    DownLoadFile = (fileName,id) => {
        window.location.href= `${baseurl}/api/download/${id}`; 
        window.open(`${baseurl}/api/download/${id}`)
    }

    handleChange = (page, pageSize) => {
        this.props.GetAnnouncement({
            "SkipCount": (page - 1) * pageSize,
            "MaxResultCount": pageSize,
        });
    }

    render() {
        const { tabPosition } = this.state;
        const { announcements, total } = this.props;
        return (
            <ConfigProvider locale={ zh_CN }>
            <div id='welcomepage' >
                <div className='welcome_bg'>
                    <img src={bg} alt=''></img>
                </div>
                <div className='welcome_content'>
                    <Row>
                        <Col sm={{ span: 24 }} xs={{ span: 24 }} xl={{ span: 14, offset: 6 }} md={{ span: 18, offset: 4 }}>
                            <Card title={<div className='welcome_title'>
                                <Row align='middle' gutter={[16,16]}>
                                    <Col sm={{ span: 18 }} xs={{ span: 24 }} md={{ span: 18 }} lg={{ span: 18 }} xl={{ span: 18 }}><h4 className='title_text'>上海医院协会“医疗机构临床路径”上报平台</h4></Col>
                                    <Col sm={{ span: 6 }} xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}><Button size='large' onClick={() => { this.handleIn() }} icon={<ArrowRightOutlined />} block type="primary">进入平台</Button></Col>
                                </Row>
                            </div>} style={{ width: '100%' }} bordered={false}>
                                <div className='welcome_list'>
                                    <Tabs tabPosition={tabPosition} defaultActiveKey={1}>
                                        <TabPane tab="培训信息" key="1">
                                            <List
                                                grid={{ 
                                                    gutter: 16,
                                                    xs: 1,
                                                    sm: 1,
                                                    md: 1,
                                                    lg: 1,
                                                    xl: 2,
                                                    xxl: 2, 
                                                 }}
                                                pagination = {{
                                                    pageSize: 4,
                                                    responsive: true,
                                                    onChange: this.handleChange,
                                                    total: total,
                                                }}
                                                dataSource={announcements}
                                                renderItem={item => (
                                                <List.Item>
                                                    <Card title={item.header} extra={<DoubleRightOutlined />} style={{ width: '100%'}}>
                                                        <Paragraph ellipsis={{ rows: 3, expandable: true }} style={{ overflow: "hidden" }}>
                                                            { item.content }
                                                            {
                                                                item.files.map((i, index) => {
                                                                    return <Tag className="span-cursor" onClick={()=>{ this.DownLoadFile(i.fileName, i.id) }} key={index} icon={<FileTextOutlined />} color="orange">{i.fileName}</Tag>
                                                                })
                                                            }
                                                        </Paragraph>
                                                    </Card>
                                                </List.Item>
                                                )}
                                            />
                                        </TabPane>
                                        <TabPane tab="系统概述" key="2">
                                            <Title level={4}>临床路径上报平台系统概述</Title>
                                            <Paragraph>
                                            为了上海市各医疗机构能够在线填报临床路径，及上海医院协会可进行统筹管理，需开发一个专用的数据上报平台，系统能划分填报的组织层级及功能权限，并满足数据填写、导入、审核、修改、提交等功能，最终为主管部门及医院协会提供周期性的，统一的数据归并展示。
                                            </Paragraph>
                                        </TabPane>
                                    </Tabs>

                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            </ConfigProvider>
        )
    }
}
export default connect(
    state => ({
        announcements: state.Welcome.announcements,
        total: state.Welcome.total,
    }),
    dispatch => bindActionCreators({ ...actions }, dispatch)
)(Welcomepage)