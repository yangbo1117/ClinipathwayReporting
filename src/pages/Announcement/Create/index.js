import React, { Component, Fragment } from "react";
import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
class CreatePage extends Component{
    state = {
        fileList: [],
    }

    componentDidMount(){
        this.props.onRef(this);
    }
    clearnFiles = () => {
        this.setState({
            fileList: []
        });
    }
    render(){
        // const { fileList } = this.state;
        const uploadProps = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            progress: {
              strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
              },
              strokeWidth: 3,
              format: percent => `${parseFloat(percent.toFixed(2))}%`,
            },
        };
        return(
            <Fragment>
                <Form.Item label="标题" name="header" rules={[{ required: true, }]}>
                    <Input placeholder="公告标题" />
                </Form.Item>
                <Form.Item label="内容" name="content" rules={[{ required: true }]}>
                    <TextArea
                        placeholder="公告信息内容..."
                        autoSize={{ minRows: 4 }}
                    />
                </Form.Item>
                <Form.Item label="上传" name="upload">
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>点击上传附件</Button>
                    </Upload>
                </Form.Item>
            </Fragment>
        )
    }
}
export default CreatePage;