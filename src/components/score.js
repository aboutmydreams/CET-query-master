import React from 'react';
import WrittenExamLogo from '../assets/score-written-exam.png';
import oralIcon from '../assets/score-oral.png'
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
    const hasOral = this.props.hasOral;
    let oralScore;
    if(hasOral) {
      oralScore = <div>
                    <div className="score-logo-oral">
                      <img src={oralIcon} />
                    </div>
                    <div className="score-info-container" >
                      <div className="score-line-container" >
                        <div className="score-line" />
                      </div>
                      <div className="score-info" >
                        <p>准考证号:  {this.props.oralID}</p>
                        <p>考试等级:  {this.props.oralLevel}</p>
                      </div>
                    </div>
                  </div>
    }
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
            <p>姓名:  {this.props.name}</p>
            <p>学校:  {this.props.school}</p>
            <p>准考证号:  {this.props.WrittenExamID}</p>
            <p>总分:  {this.props.WrittenExamScore}分</p>
            <p>听力:  {this.props.listening}分</p>
            <p>阅读:  {this.props.reading}分</p>
            <p>写作和翻译:  {this.props.translate}分</p>
          </div>
        </div>
        {oralScore}
      </div>
    )
  }

}