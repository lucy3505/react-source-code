import React from "./react";
import ReactDOM from "./react-dom";

// let element = (
//   <div className="title" style={{ color: "red" }}>
//     22
//   </div>
// );
//babel=>js方法 React.createElement()=>vnod
//实现jsx
/*通过babel转化成了=》*/
const ele2 = React.createElement(
  "div",
  {
    className: "title",
    style: {
      color: "red",
    },
  },
  "@2",

  React.createElement("span", null, "600")
);

console.log(ele2);
// console.log(element);

//把vnode=>真实dom 放到指定位置
ReactDOM.render(ele2, document.getElementById("root"));
