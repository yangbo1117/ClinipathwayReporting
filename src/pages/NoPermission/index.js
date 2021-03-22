import React from 'react';
import { Result, Button } from 'antd';
import { withRouter } from "react-router-dom"; 

function Page( props ){
    return(
      <Result
        style={{marginTop:'64px'}}
        status="warning"
        title= "对不起！暂无权限访问。"
        subTitle= "当前用户无权限"
        extra={<Button type="primary" onClick={()=>{ props.history.go(-1)}}>回到上一页</Button>}
      />
    )
}
export default withRouter(Page);