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