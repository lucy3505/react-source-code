//初始化react元素

import { updateElementAccess } from "typescript";
import addEvent from "./event";
import { REACT_FORWARDREF, REACT_TEXT } from "./stants";

function render(vdom, container) {
  mount(vdom, container);
}

function mount(vdom, container) {
  //1.vdom=>真实dom
  //   if (!vdom) return;

  let newDom = createDom(vdom);
  if (newDom.componentDidMount) {
    newDom.componentDidMount();
  }
  //2.真实dom放到对应位置
  container.appendChild(newDom);
}

function createDom(vdom) {
  if (typeof vdom == "string" || typeof vdom == "number") {
    vdom = { type: REACT_TEXT, content: vdom };
  }
  //vdom=>真实dom vue3 {type:props}
  let { type, props, ref } = vdom;
  let dom; //真实的dom
  if (type && type.$$typeofs === REACT_FORWARDREF) {
    return mountForwardRef(vdom);
  }
  //1.判断type =>文本 或者元素 div

  if (type == REACT_TEXT) {
    dom = document.createTextNode(vdom.content);
  } else if (typeof type === "function") {
    //区分 1函数式组件 2 。类组件
    if (type.isReactComponent) {
      //类组件
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    dom = document.createElement(type);
  }

  //2,处理属性 <div></div> 注意 children  style:{color:red,fontsize:20}
  if (props) {
    //{}
    //问题更新
    updateProps(dom, {}, props); //1.真实dom, 2.旧的属性 3.新的属性

    //3.children
    let children = props.children;
    if (children || children === 0) {
      changeChildren(children, dom);
    }
  }

  vdom.dom = dom;
  if (ref) {
    ref.current = dom;
  }
  return dom;
}

//处理forwardRef
function mountForwardRef(vdom) {
  let { type, props, ref } = vdom;
  let refVnode = type.render(props, ref);
  return createDom(refVnode);
}
//处理类组件
function mountClassComponent(vdom) {
  //React.createElement()
  let { type, props, ref } = vdom;
  //注意 type是一个类 =》render返回值
  let classInstance = new type(props);
  vdom.classInstance = classInstance;
  //   let classVnode = classInstance.render();
  //   return createDom(classVnode);
  if (ref) ref.current = classInstance;

  //组件将要挂载
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
  }
  let classVDom = classInstance.render(); //获取到vnode
  vdom.oldRenderVnode = classInstance.oldRenderVnode = classVDom;
  let dom = createDom(classVDom);
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount;
  }
  return dom;
}

//处理函数组件
function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let functionVdom = type(props);
  vdom.oldRenderVnode = functionVdom;

  return createDom(functionVdom);
}
//处理children
function changeChildren(children, dom) {
  //1.有一个儿子{content:,typeof}
  if (typeof children == "string" || typeof children == "number") {
    children = { type: REACT_TEXT, content: children };
    mount(children, dom);
  } else if (typeof children == "object" && children.type) {
    mount(children, dom);
  } else if (Array.isArray(children)) {
    //2，多个儿子
    children.forEach((item) => mount(item, dom));
  }
}

//更新属性
function updateProps(dom, oldProps, newProps) {
  //
  for (let key in newProps) {
    //处理属性 <div></div> 注意 children  style:{color:red,fontsize:20}
    if (key == "children") {
      continue;
    } else if (key === "style") {
      //style 可能是对象，又要便利
      // {color:red,fontsize:20}
      let styleObject = newProps[key];
      for (let arr in styleObject) {
        dom.style[arr] = styleObject[arr];
      }
    } else if (key.startsWith("on")) {
      //   dom[key.toLocaleLowerCase()] = newProps[key];
      // 以后我不再把事件绑定在dom,而是通过事件委托，全部放到document
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      //其他属性

      dom[key] = newProps[key];
    }
  }
  //更新
  if (oldProps) {
    // 旧的属性在新的属性中没有=>删除
    for (let key in oldProps) {
      if (!newProps[key]) {
        dom[key] = null;
      }
    }
  }
}

//实现更新
export function twoVnode(parentDom, oldVnode, newVnode, nextDOM) {
  //获取到新的真实dom
  //   let newDom = createDom(newVnode);
  //   let oldDom = findDOM(oldVnode);
  //   parentDom.replaceChild(newDom, oldDom);
  //更新

  if (!oldVnode && !newVnode) {
    return;
  } else if (oldVnode && !newVnode) {
    //1 旧的有 新的没有
    unmountVnode(oldVnode);
  } else if (!oldVnode && newVnode) {
    //2就的没有新的有 =》插入新
    // mountVnode(parentDom, newVnode, nextDOM);
    let newDom = createDom(newVnode);
    if (nextDOM) {
      parentDom.insertBefore(newDom, nextDOM);
    } else {
      parentDom.appendChild(newDom);
    }
    //挂载完毕
    if (newDom.componentDidMount) {
      newDom.componentDidMount();
    }
  } else if (oldVnode && newVnode && oldVnode.type !== newVnode.type) {
    //3 两个都有 =》1类型 原生 函数  class
    //删除老的 添加新的 div h
    unmountVnode(oldVnode);
    mountVnode(parentDom, newVnode, nextDOM);
  } else {
    //4 类型相同 =》更新缘故
    updateElement(oldVnode, newVnode);
  }
}

//class
function updateClassComponent(oldVnode, newVnode) {
  let classInstance = (newVnode.classInstance = oldVnode.classInstance);
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVnode.props);
  }
  //更新 -》 component.js
  classInstance.updater.emitUpdate(newVnode.props);
}

//function
function updateFunctionComponent(oldVnode, newVnode) {
  let parentDom = findDOM(oldVnode).parentNode;
  let { type, props } = newVnode;
  let newRenderVdom = type(props); //获取到新的组件的vnode
  twoVnode(parentDom, oldVnode.oldRenderVnode, newRenderVdom);
  //会面会新的变旧的
  oldVnode.oldRenderVnode = newRenderVdom;
}

function updateElement(oldVnode, newVnode) {
  //1文本 2div 3function
  //节点  注意：react=》不同的类型不能复用
  if (oldVnode.type == REACT_TEXT && newVnode.type == REACT_TEXT) {
    //复用
    let currentDOM = (newVnode.dom = findDOM(oldVnode));
    currentDOM.textContent = newVnode.content;
  } else if (typeof oldVnode.type == "string") {
    let currentDOM = (newVnode.dom = findDOM(oldVnode));
    //更新属性
    updateProps(currentDOM, oldVnode.props, newVnode.props);
    //处理children
    updatechildren(
      currentDOM,
      oldVnode.props.children,
      newVnode.props.children
    );
  } else if (typeof oldVnode.type === "function") {
    if (oldVnode.type.isReactComponent) {
      //class
      //复用实例
      newVnode.classInstance = oldVnode.classInstance;
      //更新class组件
      updateClassComponent(oldVnode, newVnode);
    } else {
      //函数组件
      updateFunctionComponent(oldVnode, newVnode);
    }
  }
}

function updatechildren(currentDOM, oldChildren, newChildren) {
  oldChildren = Array.isArray(oldChildren) ? oldChildren : [oldChildren];
  newChildren = Array.isArray(newChildren) ? newChildren : [newChildren];

  let maxLength = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < maxLength; i++) {
    //更新组件
    //注意一下
    let nextVDOM = oldChildren.find(
      (item, index) => index > i && item && findDOM(item)
    );
    twoVnode(
      currentDOM,
      oldChildren[i],
      newChildren[i],
      nextVDOM && findDOM(nextVDOM)
    );
  }
}

//添加新的
function mountVnode(parentDom, newVnode, nextDOM) {
  let newDom = findDOM(newVnode);
  if (nextDOM) {
    parentDom.insertBefore(newDom, nextDOM);
  } else {
    parentDom.appendChild(newDom);
  }
  //生命周期
  if (newDom.componentDidMount) {
    newDom.componentDidMount();
  }
}

//删除老的
function unmountVnode(vdom) {
  let { type, props, ref } = vdom;
  let currentDOM = findDOM(vdom);
  if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
    vdom.classInstance.componentWillUnmount();
  }
  if (ref) {
    ref.current = null;
  }
  if (props.children) {
    //children=>1 {},[]
    let children = Array.isArray(props.children)
      ? props.children
      : [props.children];
    //递归
    children.forEach(unmountVnode);
  }
  //删除元素
  if (currentDOM) {
    currentDOM.parentNode.removeChild(currentDOM);
  }
}

// 获取真实dom
export function findDOM(vdom) {
  //获取到真实dom
  if (!vdom) {
    return null;
  }
  if (vdom.dom) {
    return vdom.dom;
  } else {
    //没有真实dom
    return findDOM(vdom.oldRenderVnode);
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
