import React, { Axios } from 'react';
import { Form, Input, Button, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import Logo from "assets/img/50X50Logo.png";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './index.action';

const { TabPane } = Tabs;
var reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)(?![a-zA-Z0-9]+$)(?![a-zA-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9\\W_!@#$%^&*`~()-+=]+$)(?![0-9A-Z\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,16}$/;

function validatePassword(value) { //密码检测
    if(value === ""){
        return{
            validateStatus: null,
            errorMsg: null
        }
    }
    if(reg.test(value)){
        return {
            validateStatus: 'success',
            errorMsg: null,
        };
    }
    return {
      validateStatus: 'error',
      errorMsg: '密码长度8-16位，且含有大小写字母数字及特殊字符',
    };
}

class Login extends React.Component{
    formRef = React.createRef();
    state={
        loginLoading:false,
        regLoading: false,
        passwordVal: {values:'',validateStatus:null},
    }
    componentDidMount() {
        const loginparams = this.props.history.location.search;

        if(JSON.stringify(loginparams.indexOf("auth=undefine")) > -1){
            message.warn("身份信息不符合，请重新登录！");
        }
    }

    //账户密码登录
    onLogin = (values) => {
        this.setState({loginLoading:true});
        Axios.post({
            url: "/api/account/token",
            noToken: true,
            noTip: true,
            data: values,
            contentType: "application/json",
        }).then(res => {
            this.props.StoreTokenRole(res); //存储token
            setTimeout(()=>{
                message.success('登录成功!');
                this.props.GetMyProfile(); //获取用户名
                this.props.GetCurrent(); 
                this.props.history.push('/Layout');
                this.setState({loginLoading:false});
            },700)
        }).catch(err=>{
            this.setState({loginLoading:false});
            if(err.status === 401 || err.status === 403){
                message.warn('用户名密码错误！')
            }else if(err.status === 500){
                message.error('服务器异常！')
            }else{
                message.warn('登录失败！')
            }
        })
    }

    //注册
    onRegister = values => {
        this.setState({ regLoading: true });
        this.props.registerUser(values).then(res => {
            this.setState({ regLoading: false });
            message.success("注册成功！");
        }).catch(err => {
            message.error("注册失败！");
            this.setState({ regLoading: false });
        })
    }

    handlePassword = (e) =>{ //密码验证
        const values = e.target.value;
        this.setState({
            passwordVal: {...validatePassword(values),values}
        })
    }
  
    render(){
        const { loginLoading, regLoading ,passwordVal } = this.state;
        return (
            <div className='card-login-bg'>
                <section className="card-input-box">
                    <div className='card-title'>
                        <img src={Logo} alt='' className="logo-img" />&nbsp;&nbsp;<b className="title-login">临床路径上报系统</b>
                    </div>
                    <Tabs centered={true}>
                        <TabPane tab="账户密码登录" key="1">
                            <Form
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={this.onLogin}
                                >
                                <Form.Item
                                    name="userNameOrEmailAddress"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入用户名!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder='用户名或邮箱'/>
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入用户密码!',
                                        },
                                    ]}
                                >
                                    <Input.Password prefix={ <LockOutlined /> } placeholder='用户密码' />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block loading={loginLoading}>登 录</Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                        <TabPane tab="用户注册" key="2">
                            <Form
                                ref={ this.formRef }
                                onFinish={this.onRegister}
                            >
                                <Form.Item name="userName" rules={[{ required: true, message:"请填写用户名称" }]}>
                                    <Input prefix={<UserOutlined />} placeholder="请填写用户名称" />
                                </Form.Item>
                                <Form.Item name="emailAddress" rules={[{ type: "email" ,required: true, message: "请填写用户邮箱" }]}>
                                    <Input prefix={<MailOutlined />} placeholder="请填写用户邮箱" />
                                </Form.Item>
                                <Form.Item 
                                    name="password" 
                                    rules={[{ required: true, message: "请填写用户密码" }]}
                                    hasFeedback
                                    validateStatus={passwordVal.validateStatus}
                                    help={passwordVal.errorMsg}
                                >
                                    <Input.Password prefix={ <LockOutlined /> } placeholder="请填写用户密码" onChange={ this.handlePassword }/>
                                </Form.Item>
                                <Form.Item >
                                    <Button type="primary" htmlType="submit" block loading={regLoading}>注 册</Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>
                </section>
            </div>
        );
  }
}

export default connect(
    state=>({}),
    dispatch => bindActionCreators({...actions},dispatch)
)(Login);
  