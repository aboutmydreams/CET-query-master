import React from 'react';

import logo from '../assets/logo.png';
import zkzIcon from '../assets/home-zkzh-icon.png';
import nameIcon from '../assets/home-name-icon.png';
import codeIcon from '../assets/home-code-icon.png'
import code from '../assets/code.png'

//antd
import { Modal} from 'antd';

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
      isApp,
      noName: true,
      noZkzh: true,
      noCode: true
    }

    this.handleFindzkzh = this.handleFindzkzh.bind(this);
    this.handleZkzChange = this.handleZkzChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this); 
    this.handleQuery = this.handleQuery.bind(this);
  }

  handleZkzChange(zkzh) {
    console.log(zkzh);
    const noZkzh = zkzh === '';
    console.log(noZkzh);
    this.setState({
      noZkzh,
      zkzh
    })
  }

  handleNameChange(name) {
    console.log(name);
    const noName = name === '';
    console.log(noName)
    this.setState({
      noName,
      name
    });
  }

  handleCodeChange(code) {
    console.log(code);
    const noCode = code === '';
    this.setState({
      noCode,
      code
    })
  }

  //查询成绩按钮点击
  handleQuery() {
    
    if(this.state.noZkzh) {
      console.log('no zkzh');
      this.unfilledInfo('准考证号');
    } else if(this.state.noName) {
      console.log('no name')
      this.unfilledInfo('姓名');
    } else if(this.state.noCode) {
      console.log('no code');
      this.unfilledInfo('验证码');
    } else {
      console.log('yes');
      window.location.href='/score';
    }
  }

  unfilledInfo(item) {
    Modal.info({
      centered: true,
      title: '错误',
      content: (
        <div>
          <p>请填写{item}哦</p>
        </div>
      ),
      onOk() {
      },
    });
  }


  //查找准考证号按钮点击
  handleFindzkzh() {
    if(!this.state.isApp) {
      this.zkzhInfo();
    } else {
      console.log('in App');
      this.zkzhInfo();
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
      },
    });
  }

  zkzhInfo() {
    Modal.info({
      icon: 'check',
      centered: true,
      title: '获取成功',
      content: (
        <div>
          <p>姓名: 张三 </p>
          <p>口语准考证号: &nbsp;&nbsp;A37927487824</p>
          <p>笔试准考证号: &nbsp;&nbsp;283975458948</p>
        </div>
      ),
      onOk() {
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
          <Input icon={zkzIcon} onInputChange={this.handleZkzChange} placeholder="输入准考证号" />
          <Input icon={nameIcon} placeholder="输入姓名" onInputChange={this.handleNameChange} />
          <CodeInput icon={codeIcon} code={code} onInputChange={this.handleCodeChange} />
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