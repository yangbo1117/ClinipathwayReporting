import React, { Axios } from 'react';
import { Steps, Button, Row, Col, Space, Divider } from 'antd';
import MarkComment from './Comment/index';
import MarkItem from './MarkItem/index';
import MarkComplete from './Complete/index';
import _ from 'lodash';
import { ClockCircleOutlined } from "@ant-design/icons";

const { Step } = Steps;
var summarytime;
class RejectPage extends React.Component {
    state={
        current: 0,
        summary:'',
        details: [],
        complete: false,
        loading: false,
    }
    
    onCommentChange = (e) =>{ //总体评论
        const val = e.target.value;
        clearTimeout(summarytime);
        summarytime = setTimeout(()=>{
            this.setState({summary: val})
        },300)
    }

    onDetails = (obj)=>{
        let newDetails = [...this.state.details];
        this.setState({
            details: _.uniq(_.concat(newDetails, [obj])),
        });
    }

    next = ()=>{
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev = ()=>{
        const current = this.state.current - 1;
        this.setState({ current });
    }

    StepSubmit = () =>{
        const id = this.props.location.search.split('=')[1];
        const { summary, details  } = this.state;
        const detailsCp = details.filter(i => i.value);
        this.setState({ loading: true });
        Axios.post({
            url:`/api/PathwayReport/${id}/Reject`,
            data:{
                'summary': summary,
                'details': detailsCp,
            },
            contentType:"application/json",
        }).then(res=>{
            this.setState({complete:true, loading: false});
            this.next();
        }).catch(err=>{
            this.setState({complete:false, loading: false});
            this.next();
        })
    }

    callBack = () =>{
        this.props.history.push('/Layout/PathwayReport/ManageMent');
    }

    render() {
        const { current, complete, loading } = this.state;
        const taskId = this.props.location.search.split('=')[1];
        const  steps = [
            {
                title: '填写拒绝任务信息',
                content: <MarkComment onCommentChange={ this.onCommentChange }></MarkComment>,
                icon: <ClockCircleOutlined />
            },
            {
                title: '标记表格项',
                content: <MarkItem  id={ taskId } onDetails={ this.onDetails }></MarkItem>,
                icon: <ClockCircleOutlined />
            },
            {
                title: '完成',
                content: <MarkComplete complete={ complete }></MarkComplete>,
                icon: <ClockCircleOutlined />
            },
        ]
        return (
            <div className="content-card">
                <Row>
                    <Col md={{span:12,offset:6}} sm={{span:24}} xs={{sapn:24}}>
                        <Steps current={current} percent={99}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title}/>
                            ))}
                        </Steps>
                    </Col>
                </Row>
                <div>{steps[current].content ? steps[current].content : "" }</div>
                <div className="steps-action flex-center">
                    <Space>
                        {current === 0 && (
                            <Button type="primary" onClick={() => this.next()}>
                                下一步
                            </Button>
                        )}
                        {current === 1 && (
                            <Button type="primary" loading={loading} onClick={ this.StepSubmit }>
                                提交
                            </Button>
                        )}
                        {current > 0 && current < steps.length - 1 ? (
                            <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
                                上一步
                            </Button> 
                        ) : null }
                        {current === steps.length -1 && (
                            <Space>
                                <Button type='primary' onClick={ this.callBack } >返回列表页</Button>
                                {/* <Button type='primary' onClick={ ()=>{ this.setState({current:0})} } >再次填写</Button> */}
                            </Space>
                        )}
                    </Space>
                </div>
                <Divider />
            </div>
        );
    }
}
export default RejectPage;