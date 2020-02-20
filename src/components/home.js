import React from 'react';

import logo from '../assets/logo.png';
import zkzIcon from '../assets/home-zkzh-icon.png';
import nameIcon from '../assets/home-name-icon.png';
import codeIcon from '../assets/home-code-icon.png'
import code from '../assets/code.png'

import { Score } from './score';

import axios from 'axios';

//antd
import { Modal, Drawer, Icon } from 'antd';

import Miracle from 'incu-webview'

import { Input, CodeInput } from './input';
import './components.css';
import { findAllByAltText } from '@testing-library/react';

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
      useCode: true,//上线后改为true
      hasCodeImg: false,
      showDrawer: false,
      hasOral: true,//上线后改为false
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
      if(this.state.useCode) {
        const res = await axios({
          url:'api/cet/result',
          method:"get",
          params:{
            zkzh: this.state.zkzh
          }
        });
        console.log(res);
        const status = res.data.status;
        console.log(status);
        if (status === 1) {
          const data = res.data.data;
          console.log(data);
          const imgurl = data.img_url;
          const cookie = data.cookie;
          this.setState({
            hasCodeImg: true,
            imgurl,
            cookie
          })
        } else if (status === 2) {
          const cookie = res.data.cookie;
          this.setState({
            cookie,
            useCode: false
          });
          this.tipInfo('无需验证码','当前无需验证码, 直接查询吧')
        } else {
          this.errorInfo('未知错误','获取验证码失败, 重新加载页面试试吧')
        }
      } else {
        this.errorInfo('无需验证码','当前无需验证码, 直接查询吧!')
      }
    }
  }

  //查询成绩按钮点击
  handleQuery() {
    if(this.state.noZkzh) {
      this.warningInfo('未填写准考证号','请填写准考证号哦')
    } else if(this.state.noName) {
      this.warningInfo('未填写姓名', '请填写姓名哦');
    } else if(this.state.noCode) {
      if(this.state.useCode) {
        this.errorInfo('未填写验证码', '请填写验证码哦');
      } else {
        this.queryAndShow();
      }
    } else {
      console.log('search')
      this.queryAndShow();
    }
  }

  //查询成绩并展示
  async queryAndShow() {
    const res = await axios({
      url:'api/cet/result',
      method:"post",
      data: {
          zkzh: this.state.zkzh,
          v: this.state.code,
          name: this.state.name,
          cookie: this.state.cookie
        }
      /* data:{
        zkzh: this.state.zkzh,
        v: this.state.code,
        name: this.state.name,
        cookie: this.state.cookie
      } */
    });
    console.log(res);
    const status = res.data.status;
    const data = res.data.data;
    if(status === 2) {
      this.setState({
        hasOral:true,
        ID: data.ID,
        name: data.name,
        school: data.school,
        score: data.score,
        listening: data.listening,
        reading: data.rading,
        translate: data.translate,
        oralID: data.oralId,
        orallevel: data.oralLevel,
        examType: data.examType
      });
      this.setState({
        showDrawer: true
      })
    } else if(status === 1) {
      this.setState({
        hasOral: false,
        ID: data.ID,
        name: data.name,
        school: data.school,
        score: data.score,
        listening: data.listening,
        reading: data.reading,
        translate: data.translate,
        oralID: data.oralid,
        orallevel: data.orallevel,
        examType: data.examType
      });
      this.setState({
        showDrawer: true
      })
    } else {
      this.errorInfo('查询失败', '请检查准考证号、姓名及验证码是否填写正确');
    }
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
    const res =await axios({
      url:'/api/cet/zkzh',
      method:"get",
      headers: { Authorization: token }
    }); 
    if(res.data.status === 1){
      const zkzh = res.data.data[0].zkzh
      const name = res.data.data[0].xm
      const examType = res.data.data[0].kslb;
      this.setState({
        nameValue: name,
        zkzhValue: zkzh
      })
      /* Modal.success({
        centered: true,
        title: '查询成功!',
        content: (
          <div>
            <p>{name} :</p>
            <p>你的{examType}准考证号为:{zkzh}</p>
          </div>
        ),
        onOk() {
        },
      }); */
      Modal.confirm({
        okText: '谢谢啦~',
        cancelText: '不要帮我填写!',
        icon:<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
        title: '查询成功!',
        content:  <div>
                    <p>{name} :</p>
                    <p>你的{examType}准考证号为:{zkzh}</p>
                    <p>你的姓名和{examType}准考证号都已经帮你填好啦, 快去查询吧!</p>
                  </div> ,
        onOk() {
        },
        onCancel() {
          this.setState({
            nameValue: '',
            zkzhValue: ''
          })
        },
      });
    } else if(res.data.status === 2 ) {
      const writtenExamzkzh = res.data.data[0].zkzh;
      const oralExamzkzh = res.data.data[1].zkzh;
      const name = res.data.data[0].xm;
      const writtenExamType = res.data.data[0].kslb;
      const oralExamType = res.data.data[1].kslb;
      this.setState({
        nameValue: name,
        zkzhValue: writtenExamzkzh
      })
      Modal.confirm({
        centered: true,
        okText: '谢谢啦~',
        cancelText: '不要帮我填写!',
        icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
        title: '查询成功!',
        content: (
          <div>
            <p>{name} :</p>
            <p>你的{writtenExamType}准考证号为:<br/>{writtenExamzkzh}</p>
            <p>你的{oralExamType}准考证号为:<br/>{oralExamzkzh}</p>
            <p>你的姓名和{writtenExamType}准考证号已经帮你填写啦, 快去查询吧!</p>
          </div>
        ),
        onOk() {
        },
        onCancel() {
          this.setState({
            nameValue: '',
            zkzhValue: ''
          })
        },
      });
    }
    else if(res.data.status === 0) {
      this.errorInfo('查询失败', '数据库连接错误,请尝试重新加载app')
    } else {
      this.errorInfo('查询失败', '四六级数据库无此人信息')
    }
      console.log('获取结束')
  }

  hideModal() {
    this.setState({
      zkzhVisible: false
    })
  }


  //查找准考证号按钮点击
  handleFindzkzh() {
    if(!this.state.isApp) {
      this.notInAppInfo();
      console.log('in App');//测试功能
      this.getzkzh();
    } else {
      console.log('in App');
      this.getzkzh();
    }
  }

  tipInfo(tittle, info) {
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

  warningInfo(tittle, info) {
    Modal.warning({
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

  errorInfo(tittle, info) {
    Modal.error({
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
        codeButton =  <button onClick = {this.getCodeImgUrl}>
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
          <Input icon={zkzIcon} onInputChange={this.handleZkzChange} placeholder="输入准考证号" value={this.state.zkzhValue} />
          <Input icon={nameIcon} placeholder="输入姓名" onInputChange={this.handleNameChange} value={this.state.nameValue} />
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
                    name={this.state.name}
                    school={this.state.school}
                    WrittenExamID={this.state.ID}
                    WrittenExamScore={this.state.score}
                    listening={this.state.listening}
                    reading={this.state.reading}
                    translate={this.state.translate}
                    hasOral={this.state.hasOral}
                    oralID={this.state.oralID}
                    oralLevel={this.state.orallevel} />
          </div>
        </Drawer>
      </div>
    )
  }
}