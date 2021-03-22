import React from 'react';
import 'core-js/es';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable'; // 兼容IE9及以上版本
import ReactDOM from 'react-dom';
import 'utils/Axios';
import RootRoute from './router/Erouter';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import 'assets/css/styles.scss';
import Loading from "utils/Loading";
import {  baseurl, websockUrl } from "./urls";
let baseApi = process.env.NODE_ENV === 'production' ? baseurl : "";
React.baseurl = baseApi;
React.websockUrl = websockUrl;

ReactDOM.render(
  (<Provider store={ store }>
    <PersistGate loading={ <Loading /> } persistor={persistor}>
      <BrowserRouter>
        <RootRoute />
      </BrowserRouter>
    </PersistGate>
  </Provider>),
  document.getElementById('root')
);
