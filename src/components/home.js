import React from 'react';

import logo from '../assets/logo.png';
import zkzIcon from '../assets/zkzIcon.png'
import nameIcon from '../assets/nameIcon.png'

import { Input } from './input';
import './components.css';


export class Home extends React.Component {
  render() {
    return (
      <div>
        <div className="logo">
          <img src={logo} />
        </div>
        <div className="home-input-box">
          <Input icon={zkzIcon} placeholder="输入准考证号" />
          <Input icon={nameIcon} placeholder="输入姓名" />
        </div>
        <div className="home-btn-box">
          <button className='home-btn-query' >
            <span>查询成绩</span>
          </button>
          <button className='home-btn-toFind' >
            <span>找回准考证号</span>
          </button>
        </div>
      </div>
    )
  }
}