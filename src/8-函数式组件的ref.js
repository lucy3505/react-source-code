import { updateQueue } from "./component";
import React from "./react";
import ReactDOM from "./react-dom";

//实现组件的更新
//组件数据来源：1）一个是父组件属性 2）内部定义的
//更新数据，更新state状态，只有唯一的方法 setState()

function TextInput(props, ref) {
  return <input ref={ref}></input>;
}

let ForwardTextInput = React.forwardRef(TextInput);
console.log(ForwardTextInput);
console.log(<ForwardTextInput></ForwardTextInput>);

class Form extends React.Component {
  constructor(props) {
    super(props); //执行父类的构造函数
    this.classF = React.createRef(); //注意{current:类的实例}
    //定义属性
  }

  getFocus = () => {
    this.classF.current.focus();
  };
  render() {
    return (
      <div>
        <ForwardTextInput ref={this.classF}></ForwardTextInput>
        <button onClick={this.getFocus}>获取焦点</button>
      </div>
    );
  }
}

ReactDOM.render(<Form name="1" />, document.getElementById("root"));
