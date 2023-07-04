//jsx=>babel=>
// /*#__PURE__*/
// React.createElement("h1", {
//     className: "title",
//     style: {
//       color: "red"
//     }

import { REACT_ELEMENT, REACT_FORWARDREF } from "./stants";
import { toObject } from "./util";
import Component from "./component";
//   }, "hello");
function createElement(type, config, children) {
  const key = config?.key;
  const ref = config?.ref;
  delete config?.key;
  delete config?.ref;
  let props = { ...config };

  //没有children
  //2.有一个儿子 （1）文本 （2）元素
  //3.多个儿子
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(toObject);
  } else if (arguments.length === 3) {
    props.children = toObject(children);
  }

  return {
    //vnode => react元素
    $$typeof2: REACT_ELEMENT,
    key, //后面diff
    ref, //获取到真实dom
    props,
    type, //类型 div
  };
}

function createRef() {
  return { current: null };
}

function forwardRef(render) {
  return { $$typeofs: REACT_FORWARDREF, render };
}

const React = { createElement, Component, createRef, forwardRef };

export default React;
