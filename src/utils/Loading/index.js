import React from "react";
import { Spin } from "antd";
import "./index.scss";

const Page = () => {
    return (
        <div className="page-loading"><Spin tip="Loading..." size='large'></Spin></div>
    )
}
export default Page;