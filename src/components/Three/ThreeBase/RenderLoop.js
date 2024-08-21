import {
  scene
} from './scene.js' //Three.js三维场景
import {
  camera
} from './Camera.js' //相机对象
// import {
//   renderer
// } from './Renderer.js' //渲染器对象
import {
  composer
} from './composer.js'//composer取代renderer渲染器对象渲染场景
import {
  CSS2LabelRenderer
} from './CSS2DRenderer.js';
import {
  CSS3LabelRenderer
} from './CSS3DRenderer.js';

import TWEEN from '@tweenjs/tween.js'


// 渲染循环
function render() {
  TWEEN.update(); //tween更新(渲染时间相关,便于动画计算)
  CSS2LabelRenderer.render(scene, camera); //渲染HTML标签对象
  CSS3LabelRenderer.render(scene, camera);
  // renderer.render(scene, camera); //执行渲染操作
  composer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  // console.log(camera.position);//通过相机控件OrbitControls旋转相机，选择一个合适场景渲染角度
  // console.log(controls.target);
}
render();

