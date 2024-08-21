import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
// 创建一个HTML标签对象
function tag(domID) {
  const dom = document.getElementById(domID);
  //dom元素包装为CSS2模型对象CSS2DObject
  const label = new CSS2DObject(dom);
  dom.style.pointerEvents = 'none';//避免HTML标签遮挡三维场景的鼠标事件
  // 设置HTML元素标签在three.js世界坐标中位置
  // label.position.set(x, y, z);
  return label;//返回CSS2模型标签      
}
export { tag }