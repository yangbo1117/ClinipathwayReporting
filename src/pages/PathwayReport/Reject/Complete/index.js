import React from 'react';
import { Result } from 'antd';

const Mark_Complete = (props) => {
    return (
        <div id='Mark_Complete'>
            {
                props.complete ? <Result
                    status="success"
                    title="已批注临床路径上报数据!"
                /> : <Result
                        status="error"
                        title="未批注临床路径上报数据!"
                    />
            }
        </div>
    )
}

export default Mark_Complete;