import React from 'react';



export class Input extends React.Component {
  render() {
    return (
      <div className="input-box">
        <div className="input-icon-box">
          <img src={this.props.icon} />
        </div>
        <input placeholder={this.props.placeholder}/>
      </div>
    )
  }
}

export class CodeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCode: false
    };

    this.getCode =this.getCode.bind(this);
  }

  getCode() {
    console.log('get code')
    this.setState({
      hasCode: true
    })
  }

  changeCode() {
    console.log('change code')
  }

  render() {
    const hasCode = this.state.hasCode;
    let codeButton;
    if(hasCode) {
        codeButton = <button onClick = {this.changeCode}>
                      <img className="input-code-img" src={this.props.code}/>
                    </button>;
    } else {
      codeButton =  <button className="input-code-btn" onClick = {this.getCode}>点此获取</button>;
    }

    return (
      <div className="input-code-box">
        <div className="input-icon-box">
          <img src={this.props.icon} />
        </div>
        <input placeholder='验证码'/>
        {codeButton}
      </div>
    )
  }
}