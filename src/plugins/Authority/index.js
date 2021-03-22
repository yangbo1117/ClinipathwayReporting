import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
// import Loading from "utils/Loading";
import { connect } from 'react-redux';
import _ from 'lodash';
import { message } from 'antd';

class Authority extends React.Component {
    render() {
        let { component: Component, token, userinfo, ...rest } = this.props;
        let IsToken = false;
        if(!_.isEmpty(userinfo) && !_.isEmpty(userinfo.accessToken)){
            const now = new Date()
            .getTime()
            .toString()
            .substr(0, 10); // 秒
          if (parseInt(now) - parseInt(userinfo.timeStamp) > 86400){
            message.warn("登录信息过期！",6);
            IsToken = false;
          }else {
              IsToken = true
          }
        }else{
            IsToken = false;
        };

        return <Route render={(routeProps) => {
            return IsToken ?  <Component {...rest} {...routeProps} /> : <Redirect to="/Login" />
        }}
        />
    }
}

export default withRouter(connect(
    state => ({
        userinfo: state.Login.Auth,
        token: state.Login.Auth.accessToken,
    }),
)(Authority));