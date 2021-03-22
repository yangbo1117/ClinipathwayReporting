import React, { Component, Fragment } from "react";
import { Form, Input, Upload, Button, Tooltip, Tag } from "antd";
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';

const { TextArea } = Input;
class EditPage extends Component{
    state = {
        fileList: [],
        deletes: [],
    }

    componentDidMount(){
        this.props.onRef(this);
    }
    clearnFiles = () => {
        this.setState({
            fileList: [],
            deletes: [],
        });
    }
    handleClose = (id) => {
        let newArr = [...this.state.deletes];
        newArr.push(id);
        this.setState({ deletes: newArr });
    }
    render(){
        const { filesNode } = this.props;
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
            // fileList,
            progress: {
              strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
              },
              strokeWidth: 3,
              format: percent => `${parseFloat(percent.toFixed(2))}%`,
            },
        };
        let options = filesNode.map(i => {
            let str = i.fileName;
            let leng = i.fileName.length;
            if(leng > 10){
                str = i.fileName.split("").splice(0,11).join("") + "...";
            }
            return <Tooltip title={i.fileName} key={i.id}>
                <Tag closable icon={<FileTextOutlined />} color="orange" onClose={(e)=> { this.handleClose(i.id) }} className="space-margin">{str}</Tag>
            </Tooltip>
        });
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
                <Form.Item label="删除附件">
                    { options }
                </Form.Item>
                <Form.Item label="附件" name="files">
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>点击上传附件</Button>
                    </Upload>
                </Form.Item>
            </Fragment>
        )
    }
}
export default EditPage;