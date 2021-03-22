import React, { Fragment, } from 'react';
import { Steps, Row, Col, message, Button } from "antd";
import styles from "./index.module.scss";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import ChangePath from "src/pages/ClinicaPathway/ChangePaths/index";
import CreateReport from "src/pages/PathwayReport/Create/index";

const { Step } = Steps;

const ReportingPage = () => {
    const [current, setCurrent] = React.useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const onChange = value => {
        setCurrent(value)
    };

    const steps = [
        {
            title: '开展临床路径',
            subTitle: "",
            description: "开展专业下的临床路径",
            content: <ChangePath noStyle={true} />,
        },
        {
            title: '填写报表',
            subTitle: "",
            description: "填写已开展临床路径的数据报表",
            content: <CreateReport noStyle={true} />,
        },
        // {
        //     title: '完成',
        //     subTitle: "",
        //     description: "完成数据上传",
        //     content: '完成数据上传',
        // },
    ];

    //上传是否按照老模板
    return (
        <Fragment>
            <Row>
                <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} xl={{ span: 24, offset: 0 }}>
                    <div className={styles.card}>
                        <div className={styles.steps}>
                            <Steps
                                type="navigation"
                                size="small"
                                current={current}
                                onChange={onChange}
                                className="site-navigation-steps"
                            >
                                {steps.map(item => (
                                    <Step key={item.title} description={item.description}  subTitle={item.subTitle} title={<span className={styles.title}>{item.title}</span>} />
                                ))}
                            </Steps>
                        </div>
                        <div className={styles.actionbtn}>
                            {current >= 0 && (
                                <Button size="large" style={{ margin: '0 8px' }} disabled={current === 0} onClick={() => prev()}>
                                  <CaretLeftOutlined /> 上一步
                                </Button>
                            )}
                            {current < steps.length && (
                                <Button size="large" type="primary" disabled={current === steps.length - 1} onClick={() => next()}>
                                    下一步 <CaretRightOutlined />
                                </Button>
                            )}
                            {/* {current === steps.length - 1 && (
                                <Button size="large" type="primary" onClick={() => message.success('Processing complete!')}>
                                    完成 <CaretRightOutlined />
                                </Button>
                            )} */}
                        </div>
                        <div className={styles.content}>{steps[current].content}</div>
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}

export default ReportingPage