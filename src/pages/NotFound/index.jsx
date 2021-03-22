import React from 'react';
import { Result, Button } from 'antd';

export default function NotFound( props ){
    return(
      <Result
        style={{marginTop:'64px'}}
        status="404"
        title="404"
        subTitle="对不起！你访问的页面不存在。"
        extra={<Button type="primary" onClick={()=>{ props.history.go(-1)}}>回到上一页</Button>}
      />
    )
}