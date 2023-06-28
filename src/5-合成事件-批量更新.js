import { updateQueue } from "./component";
import React from "./react";
import ReactDOM from "./react-dom";

//实现组件的更新
//组件数据来源：1）一个是父组件属性 2）内部定义的
//更新数据，更新state状态，只有唯一的方法 setState()

class ClassComponent extends React.Component {
  constructor(props) {
    super(props); //执行父类的构造函数
    this.state = { num: 0 };
    this.props = props;
    //定义属性
  }

  //接受方法
  handleClick = () => {
    //宏任务  标识->true
    //异步：事件函数和React 内部方法（生命周期）
    //同步：其他就是同步
    // updateQueue.isBatchData = true;
    this.setState({ num: this.state.num + 1 }); //更新器updater
    this.setState({ num: this.state.num + 1 }); //更新器updater
    //执行列队
    // updateQueue.isBatchData = false;
    // updateQueue.batchUpdate();
    // setTimeout(() => {
    //   //同步
    //   this.setState({ num: this.state.num + 1 });
    // }, 1000);
  };
  render() {
    return (
      <div>
        <h1>{this.state.num}</h1>
        <button onClick={this.handleClick}> + </button>
      </div>
    );
  }
}

//使用
//babel=>js React.createElement(ClassComponent)
let element = <ClassComponent name="1"></ClassComponent>; //webpack babel
console.log(element);

ReactDOM.render(<ClassComponent name="1" />, document.getElementById("root"));
