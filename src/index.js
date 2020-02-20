import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import axios from 'axios'

//antd css
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'moment/locale/zh-cn';

axios.defaults.baseURL = 'http://47.103.220.76:80'

// 全局axios拦截器设置
axios.defaults.timeout = 5000;
axios.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  }
)



ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
