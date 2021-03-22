import React, { Fragment, useState, useImperativeHandle } from "react";
import { Input, Form } from "antd";

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

let phoneReg = new RegExp("^[1][3-8][0-9]{9}$");

const UserCreate = ({childRef}) => {
    const [passwordVal, setpasswordVal] = useState({values:'',validateStatus:null});
    
    const handlePassword = (e) =>{ //密码验证
        const values = e.target.value;
        setpasswordVal( {...validatePassword(values),values})
    }
    useImperativeHandle(childRef, () => ({
        clearnCheckPassword: () => {
            setpasswordVal({values:'',validateStatus:null});
        }
    }));

    return (
        <Fragment>
            <Form.Item label= "用户名" name="userName" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item 
                label= "密码" 
                name="password" 
                rules={[{ required: true }]}
                hasFeedback
                validateStatus={passwordVal.validateStatus}
                help={passwordVal.errorMsg}
            >
                <Input.Password onChange={ handlePassword }/>
            </Form.Item>
            <Form.Item label= "昵称" name="name">
                <Input />
            </Form.Item>
            <Form.Item label= "联系方式" name="phoneNumber" rules={[{ pattern: phoneReg, message: "无效联系方式" }]}>
                <Input />
            </Form.Item>
            <Form.Item label= "邮箱" name="email" rules={[{ required: true, type: "email", message: "邮箱无效" }]}>
                <Input />
            </Form.Item>
        </Fragment>
    )
}

export default UserCreate;