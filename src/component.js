import { findDOM, twoVnode } from "./react-dom";

export const updateQueue = {
  isBatchData: false,
  updaters: [],
  batchUpdate() {
    updateQueue.updaters.forEach((updater) => updater.updateComponent());
    updateQueue.isBatchData = false;
    updateQueue.updaters.length = 0;
  },
};

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance; //保存类的实例
    this.peddingState = []; //保存数据
  }

  //添加数据
  addState(partialState) {
    this.peddingState.push(partialState);
    //更新
    this.emitUpdate();
  }
  //更新
  emitUpdate() {
    //判断一下你是 异步，还是同步
    if (updateQueue.isBatchData) {
      //异步
      //需要搜集setState()->updater->this
      updateQueue.updaters.push(this);
    } else {
      //更新组件
      this.updateComponent();
    }
  }
  updateComponent() {
    console.log("update");
    //获取数据->更新组件
    if (this.peddingState.length > 0) {
      shouldUpdate(this.classInstance, this.getState());
    }
  }
  //获取到最新的状态
  getState() {
    //获取到最新的数据 =>vnode
    let { peddingState, classInstance } = this;
    let { state } = classInstance; //获取到旧的数据
    peddingState.forEach((nextState) => {
      state = { ...state, ...nextState };
    });
    //清空数据
    peddingState.length = 0;
    return state;
  }
}
//实现React 组件更新原理
//1 初始化的使用 =》h1
//2 更新的时候 获取到新状态，把这个新的状态变成 vnode(render方法) 。再把这个vnode变成真实dom
//3 用新的真实dom 替换老的
function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState;
  //实现组件更新
  classInstance.forceUpdate();
}

class Component {
  //子类可以继承 父类的 实例方法 静态方法 原型方法

  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    console.log("this.state>>>>", this.state);
    //创建更新期
    this.updater = new Updater(this);
  }

  setState(partialState) {
    //写一个更新器
    this.updater.addState(partialState);
  }

  forceUpdate() {
    //1的vnode
    let newVDom = this.render();
    let oldVDom = this.oldRenderVnode; //初始化的时候有旧的vnode
    let oldDom = findDOM(oldVDom);
    //实现组件更新
    twoVnode(oldDom.parentNode, oldVDom, newVDom); //1 旧的真正元素 2 旧的vnode 3新的vnode
    this.oldRenderVnode = newVDom;
  }
}

export default Component;
