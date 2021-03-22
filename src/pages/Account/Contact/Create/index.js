import React, { Fragment } from "react";
import { Form ,Input } from "antd";

let phoneReg = new RegExp("^[1][3-8][0-9]{9}$");

const CreateContactPage = (props) => {
    return(
        <Fragment>
            <Form.Item name="name" label="联系人姓名" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="position" label="联系人职位" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="department" label="联系人部门" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="phone" label="联系方式" rules={[{  required:true, pattern: phoneReg, message: "无效联系方式" }]}>
                <Input />
            </Form.Item>
        </Fragment>
    )
}
export default CreateContactPage;