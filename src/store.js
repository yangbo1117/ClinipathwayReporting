import { createStore, applyMiddleware } from "redux"
import reducers from './rootReducers'
import { persistStore, persistReducer } from 'redux-persist';/*数据持久化 将其保存到本地*/
import storage from 'redux-persist/lib/storage';
import thunk from "redux-thunk";

//添加中间件
// let EnhancerMiddleware = applyMiddleware(thunk);

//配置持久化数据
const persistConfig = {
    key: 'root',
    storage,
    blacklist: [ //// reducer 里不持久化的数据
    //  'possRs','fillStoreRs'
    ]
};
const persistedReducer = persistReducer(persistConfig, reducers);//处理reducer

let store=createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);//处理store

export {
    store,
    persistor
}

// import { createStore,applyMiddleware } from "redux"
// import reducer from './rootReducers'
// import think from "redux-thunk"

// let store=createStore(reducer,applyMiddleware(think))

// export default store
