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
  render() {
    return (
      <div className="input-code-box">
        <input placeholder='验证码'/>
      </div>
    )
  }
}