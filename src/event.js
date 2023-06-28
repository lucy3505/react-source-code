import { updateQueue } from "./component";

/**
 *
 * @param {*} dom //真实dom div span
 * @param {*} eventType //事件类型 onclick
 * @param {*} handler //事件的处理函数
 */
export default function addEvent(dom, eventType, handler) {
  //1 document store
  let store = dom.store || (dom.store = {}); //button.store={}

  //2 创建映射表
  store[eventType] = handler;
  if (store[eventType]) {
    //dom=>document
    document[eventType] = dispatchEvent; //就是将dom上的事件 放到 =》document -》handler
  }
}

//合成事件
function dispatchEvent(event) {
  let { target, type } = event; //event事件对象 1 。target=>真实元素 2 事件类型
  let eventType = `on${type}`; //onclick

  let { store } = target;

  let handler = store && store[eventType];
  updateQueue.isBatchData = true;
  handler && handler(event);
  updateQueue.isBatchData = false;
  updateQueue.batchUpdate();
}
