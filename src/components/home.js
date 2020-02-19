import React from 'react';

import logo from '../assets/logo.png';
import zkzIcon from '../assets/home-zkzh-icon.png';
import nameIcon from '../assets/home-name-icon.png';
import codeIcon from '../assets/home-code-icon.png'
import code from '../assets/code.png'

//antd
import { Modal, Button } from 'antd';

import Miracle from 'incu-webview'

import { Input, CodeInput } from './input';
import './components.css';

//incu-webview
const isApp = Miracle.isApp();
console.log(isApp);

// get info of student
Miracle.onAppReady(() => {
  const res = Miracle.getData();
  const info = res.user.profile.entireProfile.base_info;
  console.log("=======================")
  console.log("学号:"+info.xh)
  console.log("姓名:"+info.xm)
})



export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isApp
    }

    this.handleFindzkzh = this.handleFindzkzh.bind(this);
  }

  //查询成绩按钮点击
  handleQuery() {
    window.location.href='/score';
  }


  //查找准考证号按钮点击
  handleFindzkzh() {
    if(!this.state.isApp) {
      this. notInAppInfo();
    } else {
      console.log('in App');
      window.location.href='/zkzh';
    }
  }

  //不在app时点击找回准考证号按钮后的提示框
  notInAppInfo() {
    Modal.info({
      centered: true,
      title: '无法获取token',
      content: (
        <div>
          <p>请在南大家园APP中使用此功能</p>
          <p>或前往四六级考试官网找回</p>
          <p>测试中: 点击ok键进入准考证号页面</p>
        </div>
      ),
      onOk() {
        window.location.href='/zkzh';//测试中使用的功能,上线后删去
      },
    });
  }

  render() {
    return (
      <div className="home-box" >
        <div className="logo">
          <img src={logo} />
        </div>
        <div className="home-input-box">
          <Input icon={zkzIcon} placeholder="输入准考证号" />
          <Input icon={nameIcon} placeholder="输入姓名" />
          <CodeInput icon={codeIcon} code={code} />
        </div>
        <div className="home-btn-box">
          <button className='home-btn-query' onClick={this.handleQuery}>
            <span>查询成绩</span>
          </button>
          <button className='home-btn-toFind' onClick={this.handleFindzkzh} >
            <span>找回准考证号</span>
          </button>
        </div>
      </div>
    )
  }
}