import React from "./react";
import ReactDOM from "./react-dom";

//新的生命周期=》getSnapshotBeforeUpdate 真正的dom更新获取到老的快照
class ScrollList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { list: [] };
    this.container = React.createRef();

    console.log("counter1:constructor(初始化)");
  }
  addMessage = () => {
    this.setState((state) => ({
      list: [`${state.list.length}`, ...state.list],
    }));
  };

  componentDidMount = () => {
    debugger;
    this.tiner = window.setInterval(() => {
      this.addMessage();
    }, 500);
  };
  getSnapshotBeforeUpdate() {
    return {
      prevScrollTop: this.container.current.scrollTop, //上一个滚动的距离
      prevScrollHeight: this.container.current.scrollHeight, // 上一个dom内容高度
    };
  }

  //getSnapshotBeforeUpdate 返回值-> componentDidUpdate参数
  componentDidUpdate(
    nextProps,
    nextState,
    { prevScrollTop, prevScrollHeight }
  ) {
    //重新计算
    this.container.current.scrollTop =
      prevScrollTop + (this.container.current.scrollHeight - prevScrollHeight);
  }

  render() {
    let type = {
      height: "100px",
      width: "200px",
      border: "1px solid red",
      overflow: "auto",
      scroll: "auto",
    };
    return (
      <div style={type} ref={this.container}>
        {this.state.list.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    );
  }
}

ReactDOM.render(<ScrollList name="1" />, document.getElementById("root"));
