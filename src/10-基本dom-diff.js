import React from "./react";
import ReactDOM from "./react-dom";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { num: 1 };

    console.log("counter1:constructor(初始化)");
  }

  componentWillMount() {
    console.log("Counter2:componentWillMount(组件挂载之前)");
  }

  componentDidMount() {
    //写axios
    console.log("Counter4:componentDidMount(组件挂载完毕)");
  }

  //组件是否需要更新 更新 =》true 更新 false 不更新组件 更新数据
  shouldComponentUpdate(nextProps, nextState) {
    console.log("Counter5:shouldComponentUpdate(组件是否要更新)");
    //nextProps:父组件上的属性 2 nextState: 内部的数据
    console.log(nextState);
    // return nextState.num % 2 == 0; //更新页面
    return true; //更新页面
  }

  UNSAFE_componentWillUpdate() {
    console.log("Counter6:UNSAFE_componentWillUpdate(组件是将要更新)");
  }
  componentDidUpdate() {
    console.log("Counter7:shouldComponentUpdate(组件是更新完毕)");
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
  }
  componentWillMount() {
    console.log("CounterChildren1:componentWillMount(子组件挂载之前)");
  }
  componentDidMount() {
    console.log("CounterChildren3:componentDidMount(子组件是更新完毕)");
  }

  componentWillReceiveProps(nextProps, nextState) {
    //! shouldComponentUpdate和componentWillReceiveProps一样，要更新的时候才调用
    console.log(
      "CounterChildren4:componentWillReceiveProps(子组件是否接收数据...)"
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("CounterChildren5:shouldComponentUpdate(子组件是否更新)");
    // return true;
    console.log("nextProps:", nextProps);
    return true;
  }
  UNSAFE_componentWillUpdate() {
    console.log(
      "CounterChildren6:UNSAFE_componentWillUpdate(子组件是将要更新)"
    );
  }
  componentDidUpdate() {
    console.log("CounterChildren7:componentDidUpdate(子组件是更新完毕)");
  }

  componentWillUnmount() {
    console.log("CounterChildren8:componentWillUnmount(组件卸载)");
  }
  //自组件更新
  render() {
    console.log("CounterChildren2:render(子组件render)");
    return <div>children:{this.props.count}</div>;
  }
}

ReactDOM.render(<Counter name="1" />, document.getElementById("root"));
