import React, { Fragment } from "react";
import { Form, Input, Select, Checkbox } from "antd";

const { Option } = Select;
const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
};
const EditInstitution = (props) => {
    return(
        <Fragment>
            <Form.Item label="机构名称" name="name" required={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="机构简称" name="simplifiedName">
                <Input />
            </Form.Item>
            {
                props.IsHosp ? (
                    <Form.Item label="医院等级" name="class" required={[{ required: true }]} >
                        <Select>
                            {
                                props.classes.map(i => {
                                    return (
                                    <Option value= {i.value} key={i.value}>{i.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                ) : null
            }
            {
                props.IsHosp ? (
                    <Form.Item {...tailLayout} name="isCenter" valuePropName="checked">
                        <Checkbox>是否为市精神卫生中心</Checkbox>
                    </Form.Item>
                ) : null
            }
        </Fragment>
    )
}

export default EditInstitution;