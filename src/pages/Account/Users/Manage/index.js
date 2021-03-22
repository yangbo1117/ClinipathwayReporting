import React, { Fragment } from "react";
import { Form, TreeSelect } from "antd";

const UserManage  = (props) => {
    return (
        <Fragment>
            <Form.Item label="机构名称" name="parentId" className="distribution_agency" >
                <TreeSelect
                    getPopupContainer={() => document.querySelector('.distribution_agency')}
                    treeData={ props.data }
                    treeIcon= {true}
                ></TreeSelect>
            </Form.Item>
        </Fragment>
    )
}

export default UserManage;