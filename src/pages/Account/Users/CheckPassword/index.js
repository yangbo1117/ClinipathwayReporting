import React, { Fragment, useState } from "react";
import { Form, Input } from "antd";

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

const Page = (props) => {
    const [passwordVal, setpasswordVal] = useState({values:'',validateStatus:null});

    const handlePassword = (e) =>{ //密码验证
        const values = e.target.value;
        setpasswordVal( {...validatePassword(values),values})
    }

    return (
        <Fragment>
            <Form.Item label="用户名" name="userName" rules={[{ required: true }]}>
                <Input disabled/>
            </Form.Item>
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
        </Fragment>
    )
}
export default Page;