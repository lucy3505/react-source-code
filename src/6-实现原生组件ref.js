import { updateQueue } from "./component";
import React from "./react";
import ReactDOM from "./react-dom";

//实现组件的更新
//组件数据来源：1）一个是父组件属性 2）内部定义的
//更新数据，更新state状态，只有唯一的方法 setState()

class TextInput extends React.Component {
  constructor(props) {
    super(props); //执行父类的构造函数
    this.state = { num: 0 };
    this.props = props;
    this.result = React.createRef();
    this.a = React.createRef();
    this.b = React.createRef();
    //定义属性
  }

  getFocus = () => {};
  render() {
    return <input ref={this.getFocus}></input>;
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props); //执行父类的构造函数
    this.classF = React.createRef(); //注意{current:类的实例}
    //定义属性
  }

  getFocus = () => {
    console.log(this.a);
    let a = this.a.current.value;
    let b = this.b.current.value;
    this.result.current.value = a + b;
  };
  render() {
    return (
      <div>
        <TextInput ref={this.classF}></TextInput>
        <button onClick={this.getFocus}>获取焦点</button>
      </div>
    );
  }
}

ReactDOM.render(<Form name="1" />, document.getElementById("root"));
