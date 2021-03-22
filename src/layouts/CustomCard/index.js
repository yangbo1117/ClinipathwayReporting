import React, { Fragment } from 'react';
import { PageHeader, Layout, Breadcrumb, Button, } from 'antd';
import { Route, Link, withRouter } from 'react-router-dom';
import rootroutes from "layouts/rootRoute";
import { connect } from 'react-redux';
import NoPermission from "pages/NoPermission/index";
import { ArrowLeftOutlined, } from "@ant-design/icons";
import _ from "lodash";
import './index.scss';


const { Content } = Layout;
class Auth extends React.Component {

    //生成面包屑
    _getPath = () => {
        //对路径进行切分 
        let pathSnippets = this.props.location.pathname.split('/').filter(i => i);
        function GetSubJson(jsonData, destID, json) {
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData[i].url === destID) {
                    json.push(
                        <Breadcrumb.Item key={jsonData[i].url}>
                            {jsonData[i].ispage ? <Link to={jsonData[i].url}>{jsonData[i].name}</Link> : <span>{jsonData[i].name}</span>}
                        </Breadcrumb.Item>
                    )
                } else if (jsonData[i].hasOwnProperty("children")) {
                    GetSubJson(jsonData[i].children, destID, json);
                }
            }
        }
        pathSnippets.pop(); //删除最后一个携带参数的路径
        let extraBreadcrumbItems = pathSnippets.map((_, index) => {
            let url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            let bread = []
            GetSubJson(rootroutes, url, bread)
            return bread
        });
        extraBreadcrumbItems.push( //添加最后路径，携带参数 //可link可span
            <Breadcrumb.Item key={this.props.location.pathname}>
                <span>{this.props.data.name}</span>
            </Breadcrumb.Item>
        )
        return extraBreadcrumbItems.flat(Infinity);
    }

 

    render() {
        let { component: Component, data, access: Access, roles, ...rest } = this.props;
        let isAccess = !_.isEmpty(_.intersection(Access, roles));
        return <Route render={(routeProps) => {
            return <Fragment>
                <div className='baselayout_title' style={{ backgroundColor: '#fff', marginTop: '64px', padding: '10px 24px 0 24px' }}>
                    {this._getPath()}
                </div>
                <PageHeader
                    title={data.name}
                    // subTitle={}
                    className="layout_header_pageheader"
                    onBack={() => { this.props.history.goBack() }}
                    backIcon={
                        <span className="layout_header_backicon">
                            <ArrowLeftOutlined />
                        </span>
                    }
                ></PageHeader>
                <div className='auth_content_box'>
                    <Content>
                        {/* { isAccess ? <Component { ...rest } {...routeProps } /> : <NoPermission /> } */}
                        <Component {...rest} {...routeProps} />
                    </Content>
                </div>
               
            </Fragment>
        }}
        />
    }
}
export default withRouter(connect(
    state => ({
        roles: state.Login.Auth.roles,
    }),
)(Auth));