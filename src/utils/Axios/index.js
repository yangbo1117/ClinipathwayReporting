
import React from 'react'
import axios from 'axios';
import { notification } from 'antd';
import { store } from "src/store";
import { baseurl } from "src/urls";
let baseApi = process.env.NODE_ENV === 'production' ? baseurl : "";

//请求拦截
axios.interceptors.request.use(
    config => {
        // 每次发送请求之前判断是否存在token        
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
        // const token = store.state.token;  
        if(config.noToken){
            console.log('登录'); //登录不携带token
        }else{
            const token = store.getState().Login.Auth.accessToken;
            token && (config.headers.Authorization = `Bearer ${token}`);
        }
        return config;
    },
    error => {
        return Promise.error(error);
    }
)

// 响应拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status) {
            const isShowTip = error.response.config.noTip; 
            //true 不展示 // false展示
            if(!isShowTip){
                switch (error.response.status) {
                    case 400:
                        break;
                    // 401: 未登录
                    // 未登录则跳转登录页面，并携带当前页面的路径
                    // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                    case 401:
                        window.location.href="/Login?auth=undefine";
                        break;
                    // 403 token过期
                    // 登录过期对用户进行提示
                    // 清除本地token和清空vuex中token对象
                    // 跳转登录页面                
                    case 403:
                        notification.warn({
                            message: '提示信息：',
                            description: "暂无权限访问！",
                        });
                        // window.location.href="/Login";
                        // localStorage.removeItem("persist:root");
                        // 清除token
                        // localStorage.removeItem('access_token');
                        // store.commit('loginSuccess', null);
                        // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
                        // setTimeout(() => {                        
                        //     router.replace({                            
                        //         path: '/login',                            
                        //         query: { 
                        //             redirect: router.currentRoute.fullPath 
                        //         }                        
                        //     });                    
                        // }, 1000);                    
                        break;
    
                    // 404请求不存在
                    case 404:
                        notification.warn({
                            message: '提示：',
                            description: '数据请求不存在！',
                            placement: 'bottomRight',
                        })
                        break;
                    // 其他错误，直接抛出错误提示
                    case 504:
                        notification.error({
                            message: '提示：',
                            description: '请求超时！',
                            placement: 'bottomRight',
                        })
                        break;
                    default:
                    // message.warn(`${ error.response.data.message }`)
                }
            }
            return Promise.reject(error.response);
        }
    }
);

class Axios {
    static get(options) {
        return new Promise(function (resolve, reject) {
            axios({
                url: options.url,
                method: 'GET',
                baseURL: options.baseApi || baseApi,
                timeout: 60000,
                params: (options.params) || '',
                withCredentials: options.withCredentials || false,
                crossDomain: true,
                responseType: options.responseType ? options.responseType : "json",
                xhrFields: {
                    withCredentials: true
                },
            }).then((response) => {
                if (response.status === 200) {
                    let res = response.data;
                    resolve(res, response)
                }
                if(response.status === 204){
                    let res = '204'
                    reject(res);
                }
            }).catch(function (error) {
                reject(error)
            });
        })
    }

    static put(options) {
        return new Promise(function (resolve, reject) {
            axios({
                url: options.url,
                method: 'PUT',
                baseURL: options.baseApi || baseApi,
                timeout: 60000,
                noTip: options.noTip || false,
                headers: {
                    'Content-Type': options.contentType || 'application/x-www-form-urlencoded',
                },
                data: (options.data) || '',
                params: (options.params) || '',
                withCredentials: options.withCredentials || false
            }).then((response) => {
                console.log("aa")
                if (response.status === 200) {
                    let res = response.data;
                    resolve(res)
                }
                if (response.status === 204) {
                    let res = response.data;
                    resolve(res)
                }
            }).catch(function (error) {
                reject(error)
            });
        })
    }

    static patch(options) {
        return new Promise(function (resolve, reject) {
            axios({
                url: options.url,
                method: 'PATCH',
                baseURL: options.baseApi || baseApi,
                timeout: 60000,
                headers: {
                    'Content-Type': options.contentType || 'application/x-www-form-urlencoded'
                },
                data: (options.data) || '',
                withCredentials: options.withCredentials || false
            }).then((response) => {
                if (response.status === 200) {
                    let res = response.data;
                    resolve(res)
                }
            }).catch(function (error) {
                reject(error)
            });
        })
    }

    static delete(options) {
        return new Promise(function (resolve, reject) {
            let obj = {
                url: options.url,
                method: 'DELETE',
                baseURL: options.baseApi || baseApi,
                timeout: 60000,
                headers: {
                    'Content-Type': options.contentType || 'application/x-www-form-urlencoded'
                },
                withCredentials: options.withCredentials || false
            }
            if(options.isbody){
                obj['data']= (options.data) || '';
            }else{
                obj['params']= (options.data) || '';
            }
            axios(obj).then((response) => {
                if (response.status === 200) {
                    let res = response.data;
                    resolve(res)
                }
                if (response.status === 204) {
                    resolve(response)
                }
            }).catch(function (error) {
                reject(error)
            });
        })
    }

    static post(options) {
        return new Promise(function (resolve, reject) {
            axios({
                url: options.url,
                method: 'POST',
                timeout: 60000,
                noToken: options.noToken || false,
                noTip: options.noTip || false,
                // headers: {
                //     'Content-Type': options.contentType || 'application/x-www-form-urlencoded'
                // },
                baseURL: options.baseApi || baseApi, //`baseURL` 会被加到`url`前面，除非`url`已经写全了。它可以方便的为axios实例设置`baseURL`，然后传递相关联的URLs给实例对应的方法
                withCredentials: options.withCredentials || false, // `withCredentials` 跨站点访问是否适用证书
                // crossDomain: true,  //crossDomain要设置为true / post的数据要首先转换成JSON格式
                xhrFields: { //通过将withCredentials属性设置为true，可以指定某个请求应该发送凭据
                    withCredentials: true
                },
                data: options.data,
                params: options.params,
            }).then((response) => {
                if (response.status === 200 || response.status === 201 || response.status === 204) {
                    let res = response.data;
                    resolve(res)
                }
            }).catch(function (error) {
                reject(error)
            });
        })
    }
}

React.Axios = Axios;//实例属性

export default Axios;