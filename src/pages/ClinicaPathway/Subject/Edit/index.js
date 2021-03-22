import React, { Fragment } from "react";
import { Form, Input } from "antd";

const SubjectEdit = (props) => {
    return (
        <Fragment>
            <Form.Item name="name" label="专业名称" rules={[{ required: true, }]}>
                <Input />
            </Form.Item>
        </Fragment>
    )
}

export default SubjectEdit