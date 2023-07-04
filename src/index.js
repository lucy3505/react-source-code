import React from "react";
import ReactDOM from "react-dom";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { num: 0 };

    console.log("counter1:constructor(初始化)");
  }

  componentWillMount() {
    console.log("Counter2:componentWillMount(组件挂载之前)");
  }

  componentDidMount() {
    //写axios
    console.log("Counter4:componentWillMount(组件挂载完毕)");
  }

  //组件是否需要更新 更新 =》true 更新 false 不更新组件 更新数据
  shouldComponentUpdate(nextProps, nextState) {
    console.log("Counter5:shouldComponentUpdate(组件是否要更新)");
    //nextProps:父组件上的属性 2 nextState: 内部的数据
    console.log(nextState);
    return nextState.num % 2 == 0; //更新页面
  }

  UNSAFE_componentWillUpdate() {
    console.log("Counter6:shouldComponentUpdate(组件是将要更新)");
  }
  componentDidUpdate() {
    console.log("Counter6:shouldComponentUpdate(组件是更新完毕)");
  }

  handlerClick = () => {
    this.setState({ num: this.state.num + 1 });
  };

  render() {
    console.log("Counter3:componentWillMount(组件render)");
    return (
      <div>
        <p>{this.state.num}</p>
        <button onClick={this.handlerClick}>+</button>
      </div>
    );
  }
}

ReactDOM.render(<Counter name="1" />, document.getElementById("root"));
