import React from 'react';
import { Input, Row, Col } from 'antd';

const { TextArea } = Input;

const Mark_Comment = (props) =>{
    return(
        <div style={{padding:'1rem 0'}}>
            <Row>
                <Col md={{span:12,offset:6}} xs={{span:24}} sm={{span:24}}>
                    <TextArea rows={7}  onChange={ props.onCommentChange } placeholder={'请填写批注内容...'}/>
                </Col>
            </Row>
        </div>
    )
}
export default Mark_Comment;