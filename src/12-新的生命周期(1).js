import React from "./react";
import ReactDOM from "./react-dom";

//getDerivedStateFromProps(nextProps,nextState) 更新数据得到props 映射到state,返回值是直接修改state(合并修改)
// 新的生命周期=》getSnapshotBeforeUpdate 真正的dom更新获取到老的快照
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { num: 1 };

    console.log("counter1:constructor(初始化)");
  }

  handlerClick = () => {
    this.setState({ num: this.state.num + 1 });
  };

  render() {
    console.log("Counter3:render(组件render)");
    return (
      <div>
        <p>{this.state.num}</p>
        {/* {this.state.num === 4 ? ( */}
        <CounterChildren count={this.state.num}></CounterChildren>
        {/* // ) : null} */}
        <button onClick={this.handlerClick}>+</button>
      </div>
    );
  }
}

class CounterChildren extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: 10, num: props.count };
  }
  static getDerivedStateFromProps(nextProps, nextState) {
    //返回值就是state 并且合并state
    const { count } = nextProps;

    if (count % 2 == 0) {
      return {
        num: count * 2,
      };
    } else {
      return {
        num: count * 3,
      };
    }
  }

  //自组件更新
  render() {
    console.log("CounterChildren2:render(子组件render)");
    return <div>children:{this.state.num}</div>;
  }
}

ReactDOM.render(<Counter name="1" />, document.getElementById("root"));
