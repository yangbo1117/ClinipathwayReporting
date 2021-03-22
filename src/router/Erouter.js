import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Welcome from 'pages/Welcome/index';
import Logincpt from 'pages/Login/index';
import Layout from 'layouts/BaseLayout/index';
import Authority from 'plugins/Authority/index'
export default class Erouter extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Switch>
                    <Route path='/Login' component={ Logincpt }></Route>
                    <Authority path='/Layout' component={ Layout }></Authority>
                    <Route path='/' component={Welcome}></Route>
                </Switch>
            </React.Fragment>
        )
    }
}