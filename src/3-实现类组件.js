import React from "./react";
import ReactDOM from "./react-dom";

//实现class组件

//定义一个class组件

class ClassComponent extends React.Component {
  //   constructor(props) {
  //     super()//执行父类的构造函数
  //     //定义属性

  //   }
  render() {
    return <h1>hello{this.props.name}</h1>;
  }
}

//使用
//babel=>js React.createElement(ClassComponent)
let element = <ClassComponent name="222"></ClassComponent>; //webpack babel
console.log(element);

ReactDOM.render(element, document.getElementById("root"));
