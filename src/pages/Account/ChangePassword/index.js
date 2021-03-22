import React, { Fragment, useState } from "react";
import { Row, Col, Input, Form, Divider, Button, message } from "antd";
import { connect } from "react-redux";
import  { bindActionCreators } from "redux";
import * as actions from "./index.action";
import { CheckOutlined } from "@ant-design/icons";

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

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { sm: { offset: 6, span: 16 }, xs: { span: 24 } },
};

const ChangePassword = (props) => {
    const [form] = Form.useForm();
    const [passwordVal, setpasswordVal] = useState({values:'',validateStatus:null});
    const [loading, setloading] = useState(false);

    const handlePassword = (e) =>{ //密码验证
        const values = e.target.value;
        setpasswordVal( {...validatePassword(values),values})
    }
    const onFinish = (values) => {
        setloading(true);
        props.ChangePassword(values).then(res => {
            setloading(false);
            setpasswordVal({values:'',validateStatus:null});
            form.resetFields();
            props.LoginOut();
            setTimeout(()=>{
                message.warn("密码修改成功，请重新登录！");
                props.history.push('/Login');
                localStorage.removeItem("persist:root");
            },1000)
        }).catch(err => {
            setloading(false);
            message.error("密码修改失败！");
        })
    }

    return (
        <Fragment>
            <Row>
                <Col sm={{ span: 24 }} xs={{ span: 24 }} xl={{ span:16, offset: 4 }}>
                    <div className="content-card">
                        <Divider orientation="left"><span className="title-b">修改用户密码</span></Divider>
                        <Form {...layout} form={form} onFinish={onFinish}>
                            <Form.Item label="旧密码" name="currentPassword" rules={[{ required: true }]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item 
                                label= "新密码" 
                                name="newPassword" 
                                rules={[{ required: true }]}
                                hasFeedback
                                validateStatus={passwordVal.validateStatus}
                                help={passwordVal.errorMsg}
                            >
                                <Input.Password onChange={ handlePassword }/>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button type="primary" icon={<CheckOutlined />} loading={loading} block htmlType="submit">确认</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}

export default connect(
    state =>({}),
    dispatch => bindActionCreators( {...actions}, dispatch)
)(ChangePassword);