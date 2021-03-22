import React from 'react';
import { Row, Col, Card, Button, Tooltip, Avatar, Steps, Popconfirm, Typography } from "antd";
import { FileExcelTwoTone, ProfileTwoTone, EditTwoTone, DesktopOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import reportingImg from "./img/icon-01.png";
import uploadingImg from "./img/icon-02.png";

const { Meta } = Card;
const { Step } = Steps;
const { Text } = Typography;
class Home extends React.Component {

    dataReporting = () => {
        this.props.history.push("/Layout/ReportingPage");
    };

    dataUploading = () => {
        this.props.history.push("/Layout/PathwayReport/Upload");
    }

    render() {
        const publicStyles = { borderRadius: 8, overflow: "hidden", border: "1px solid #e8e8e8" };
        return (
            <div className={styles.card}>
                {/* 水平距离，垂直距离 */}
                <Row gutter={[{ xs: 24, sm: 32, xl: 32, xxl: 48 }, { xs: 24, sm: 32, xl: 32 }]}> 
                    <Col xs={24} sm={24} lg={24} xl={12}>
                        <Card
                            title = {<span className={styles.card_title}>临床路径上报方式一</span>}
                            style={publicStyles}
                            className={styles.shadow}
                            bodyStyle={{ height: 400 }}
                        >
                            <Meta
                                description={
                                    <div className={styles.cardbody}>
                                        <section style={{textAlign: "center"}}>
                                            <img src={reportingImg} alt="" onClick={this.dataReporting} className={styles.img}></img>
                                            <p className={styles.title}>数据填报</p>
                                        </section>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} lg={24} xl={12}>
                        <Card
                            title = {<span className={styles.card_title}>临床路径上报方式二</span>}
                            style={publicStyles}
                            className={styles.shadow}
                            bodyStyle={{ height: 400 }}
                        >
                            <Meta
                                // title={<span className={styles.title}>文件上传</span>}
                                description={
                                    <div className={styles.cardbody} >
                                        <section style={{textAlign: "center"}}>
                                            <img src={uploadingImg} className={styles.img} onClick={this.dataUploading} alt=""></img>
                                            <p className={styles.title}>上传报表</p>
                                        </section>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Home;