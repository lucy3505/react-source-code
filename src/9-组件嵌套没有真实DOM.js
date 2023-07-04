import { updateQueue } from "./component";
import React from "./react";
import ReactDOM from "./react-dom";

class Three extends React.Component {
  constructor(props) {
    super(props); //执行父类的构造函数
  }

  render() {
    return <div class="three">three:{this.props.num}</div>;
  }
}
class Two extends React.Component {
  constructor(props) {
    super(props); //执行父类的构造函数
  }

  render() {
    return <Three {...this.props}></Three>;
  }
}
class One extends React.Component {
  constructor(props) {
    super(props); //执行父类的构造函数
    this.state = { num: 1 };
    setTimeout(() => {
      this.setState({ num: 2 });
    }, 1000);
  }

  render() {
    return <Two num={this.state.num}></Two>;
  }
}

ReactDOM.render(<One name="1" />, document.getElementById("root"));
