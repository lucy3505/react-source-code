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
    this.result = React.createRef();
    this.a = React.createRef();
    this.b = React.createRef();
    //定义属性
  }

  addSum = () => {
    console.log(this.a);
    let a = this.a.current.value;
    let b = this.b.current.value;
    this.result.current.value = a + b;
  };
  render() {
    return (
      <div>
        <input ref={this.a}></input>+<input ref={this.b}></input>
        <button onClick={this.addSum}>求和</button>
        <input ref={this.result}></input>
      </div>
    );
  }
}

//使用
//babel=>js React.createElement(ClassComponent)
let element = <ClassComponent name="1"></ClassComponent>; //webpack babel
console.log(element);

ReactDOM.render(<ClassComponent name="1" />, document.getElementById("root"));
