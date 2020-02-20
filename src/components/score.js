import React from 'react';
import WrittenExamLogo from '../assets/score-written-exam.png';
import drawbackIcon from '../assets/score-drawback.png';

export class Score extends React.Component {
  constructor(props) {
    super(props);
    this.drawback = this.drawback.bind(this);
  }

  drawback() {
    this.props.isDrawBack(true)
  }

  render() {
    return (
      <div className="score-box" >
        <div className="score-drawback-box" onClick={this.drawback} >
          <img src={drawbackIcon} />
        </div>
        <div className="logo">
          <img src={WrittenExamLogo} />
        </div>
        <div className="score-info-container" >
          <div className="score-line-container" >
            <div className="score-line" />
          </div>
          <div className="score-info" >
            <p>姓名:  张三</p>
            <p>学校:  南昌大学</p>
            <p>准考证号:  8978778998</p>
            <p>总分:  270分</p>
            <p>听力:  90分</p>
            <p>阅读:  90分</p>
            <p>写作和翻译:  90分</p>
          </div>
        </div>
      </div>
    )
  }

}