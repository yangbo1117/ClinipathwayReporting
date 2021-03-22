import React from 'react';
import { Result } from 'antd';

const Mark_Complete = (props) => {
    return (
        <div id='Mark_Complete'>
            {
                props.complete ? <Result
                    status="success"
                    title="信息提交成功"
                /> : <Result
                        status="error"
                        title="信息提交失败"
                    />
            }
        </div>
    )
}

export default Mark_Complete;