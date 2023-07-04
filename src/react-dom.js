//初始化react元素

import addEvent from "./event";
import { REACT_FORWARDREF, REACT_TEXT } from "./stants";

function render(vdom, container) {
  mount(vdom, container);
}

function mount(vdom, container) {
  //1.vdom=>真实dom

  let newDom = createDom(vdom);
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
  //   let classVnode = classInstance.render();
  //   return createDom(classVnode);
  if (ref) ref.current = classInstance;
  let classVDom = classInstance.render();
  vdom.oldRenderVnode = classInstance.oldRenderVnode = classVDom;
  return createDom(classVDom);
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
export function twoVnode(parentDom, oldVnode, newVnode) {
  //获取到新的真实dom
  let newDom = createDom(newVnode);
  let oldDom = findDOM(oldVnode);
  parentDom.replaceChild(newDom, oldDom);
  //更新
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
