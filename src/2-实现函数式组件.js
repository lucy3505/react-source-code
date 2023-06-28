import React from "./react";
import ReactDOM from "./react-dom";

//函数是组件？他就是一个函数

//特点：
//1.函数组件的名称首字母大写  react原声组件 div span 自定组件  大写
//2，函数式组件的返回值 =》 一个react元素 -》jsx
//3. jsx是一个父子结构
//4 还有个属性props

//定义函数组件
function FunctionComponent(props) {
  return <h1>hello {props.name}</h1>;
  //   return React.createElement(
  //     "h1",
  //     {
  //       name: "100",
  //     },
  //     66
  //   );
}

//函数是组件使用
// const element = <FunctionComponent name={"100"}></FunctionComponent>;
const element = React.createElement(FunctionComponent, {
  name: "100",
});

//babel => /*#__PURE__*/React.createElement(FunctionComponent, {
//   name: "100"
// });
console.log(element);
ReactDOM.render(element, document.getElementById("root"));
