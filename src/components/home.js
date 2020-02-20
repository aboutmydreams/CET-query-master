import React from 'react';

import logo from '../assets/logo.png';
import zkzIcon from '../assets/home-zkzh-icon.png';
import nameIcon from '../assets/home-name-icon.png';
import codeIcon from '../assets/home-code-icon.png'
import code from '../assets/code.png'

import { Score } from './score';

import axios from 'axios';

//antd
import { Modal, Drawer } from 'antd';

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
  console.log("=======================");
  console.log(res.user);
  console.log(res.user.token);
  console.log("学号:"+info.xh);
  console.log("姓名:"+info.xm);
})




export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isApp,
      noName: true,
      noZkzh: true,
      zkzh: '',
      noCode: true,
      useCode: true,
      hasCodeImg: false,
      showDrawer: true
    }

    this.handleFindzkzh = this.handleFindzkzh.bind(this);
    this.handleZkzChange = this.handleZkzChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.getCodeImgUrl = this.getCodeImgUrl.bind(this);
    this.isDrawback = this.isDrawback.bind(this);
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

  handleCodeChange(e) {
    const code = e.target.value;
    console.log(code);
    const noCode = code === '';
    this.setState({
      noCode,
      code
    })
  }


  //获取验证码图片
  async getCodeImgUrl() {
    if(this.state.noZkzh) {
      console.log('nozkzh');
      this.errorInfo('错误', '要先输入准考证号才能获取验证码哦')
    } else {
      const res = await axios({
        url:'api/code',
        method:"get",
        params:{
          zkzh: this.state.zkzh
        }
      });
      const status = res.data.status;
      if (status === 1) {
        const imgurl = res.data.img_url;
        const cookie = res.data.cookie;
        this.setState({
          imgurl,
          cookie
        })
      } else if (status === 2) {
        const cookie = res.data.cookie;
        this.setState({
          cookie,
          useCode: false
        });
        this.errorInfo('无需验证码','当前无需验证码, 直接查询吧')
      } else {
        this.errorInfo('未知错误','获取验证码失败, 重新加载页面试试吧')
      }
    }
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
      if(this.state.useCode) {
        this.unfilledInfo('验证码');
      } else {
        console.log('not use img');
        this.queryAndShow();
      }
    } else {
      this.queryAndShow();
      this.setState({ //测试功能! 上线后删去
        showDrawer: true
      })
    }
  }

  //查询成绩并展示
  async queryAndShow() {
    const res = await axios({
      url:'api/code',
      method:"post",
      params:{
        zkzh: this.state.zkzh,
        v: this.state.code,
        name: this.state.name,
        cookie: this.state.cookie
      }
    });
    
    this.setState({
      showDrawer: true
    })
  }

  //未填写项目时给出相应的提示
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

  isDrawback(isDrawback) {
    this.setState({
      showDrawer: !isDrawback
    })
  }

  //获取准考证号函数
  async getzkzh() {
    let token = JSON.stringify(Miracle.getData())!=='{}' ? Miracle.getData().user.token : '';
    const res = await axios({
      url:'/api/cet/zkzh',
      method:"get",
      headers: { Authorization: token }
    });
    if(res.data.staus === 1){
      const zkzh = res.data.data.zkzh
      const name = res.data.data.xm
      const examType = res.data.data.kslb.substring(2,4)
      Modal.info({
        centered: true,
        title: '你的'+examType+'准考证号为:',
        content: (
          <div>
            <p>{zkzh}</p>
          </div>
        ),
        onOk() {
        },
      });

    } else if(res.data.staus === 0) {
      this.errorInfo('查询失败', '数据库连接错误,请尝试重新加载app')
    } else {
      this.errorInfo('查询失败', '四六级数据库无此人信息')
    }
  }

  //查找准考证号按钮点击
  handleFindzkzh() {
    if(!this.state.isApp) {
      this.notInAppInfo();
    } else {
      this.getzkzh();
    }
  }


  errorInfo(tittle, info) {
    Modal.info({
      centered: true,
      title: tittle,
      content: (
        <div>
          <p>{info}</p>
        </div>
      ),
      onOk() {
      },
    });
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
        </div>
      ),
      onOk() {
      },
    });
  }

  //(临时)查找准考证号成功后的提示
  zkzhInfo() {
    Modal.info({
      icon: 'check',
      centered: true,
      title: '获取成功',
      content: (
        <div>
          <p>姓名: 张三 </p>
          <p>您的口语准考证号为: &nbsp;&nbsp;A37927487824</p>
          <p>您的笔试准考证号为: &nbsp;&nbsp;283975458948</p>
        </div>
      ),
      onOk() {
      },
    });
  }

  render() {
    const hasCode = this.state.hasCodeImg;
    let codeButton;
    if(hasCode) {
        codeButton = <button onClick = {this.getCodeImgUrl}>
                      <img className="input-code-img" src={this.state.imgurl}/>
                    </button>;
    } else {
      codeButton =  <button className="input-code-btn" onClick = {this.getCodeImgUrl}>点此获取</button>;
    }
    return (
      <div className="home-box" >
        <div className="logo">
          <img src={logo} />
        </div>
        <div className="home-input-box">
          <Input icon={zkzIcon} onInputChange={this.handleZkzChange} placeholder="输入准考证号" />
          <Input icon={nameIcon} placeholder="输入姓名" onInputChange={this.handleNameChange} />
          {/* <CodeInput icon={codeIcon} code={code} getCode={this.getCode} onInputChange={this.handleCodeChange} /> */}
          <div className="input-code-box">
            <div className="input-icon-box">
              <img src={codeIcon} />
            </div>
            <input placeholder='验证码' onChange={this.handleCodeChange} />
            {codeButton}
          </div>
        </div>
        <div className="home-btn-box">
          <button className='home-btn-query' onClick={this.handleQuery}>
            <span>查询成绩</span>
          </button>
          <button className='home-btn-toFind' onClick={this.handleFindzkzh} >
            <span>找回准考证号</span>
          </button>
        </div>
        <Drawer
          height='100%'
          placement='bottom'
          closable={false}
          visible={this.state.showDrawer}
          bodyStyle = {
            {
              backgroundColor: '#4b4b4b',
              padding: 0,
              width: "100%",
              height: "100%"
          }
          }
        >
          <div className="score">
            <Score  isDrawBack={this.isDrawback}
                    name={'张三'}
                    school={'南昌大学'}
                    WrittenExamID={3829483247278}
                    WrittenExamScore={432}
                    listening={92}
                    reading={87}
                    reading={89}
                    translate={98}
                    hasOral={true}
                    oralID={'L377247234736'}
                    oralLevel={'A+'} />
          </div>
        </Drawer>
      </div>
    )
  }
}