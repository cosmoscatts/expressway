// 引入Three.js
import * as THREE from 'three';


// width和height用来设置Three.js输出Canvas画布尺寸，同时用来辅助设置相机渲染范围
const width = window.innerWidth; //窗口文档显示区的宽度
const height = window.innerHeight; //窗口文档显示区的高度
/**
* 相机设置
*/
//  透视投影
const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 30000);
// 60度fov
// camera.position.set(1.61, 8.47, 28.02);//通过相机控件OrbitControls旋转相机，选择一个合适场景渲染角度
// const x =-0.39 ,y=2.9,z=-0.48;
// 45度fov
camera.position.set(-0.68, 7.33, 36.90);//通过相机控件OrbitControls旋转相机，选择一个合适场景渲染角度
const x =-0.29 ,y=2.38,z=-0.39;
camera.lookAt(x,y , z);


// 引入Three.js扩展库
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//创建控件对象  控件可以监听鼠标的变化，改变相机对象的属性
// 旋转：拖动鼠标左键
// 缩放：滚动鼠标中键
// 平移：拖动鼠标右键
import { renderer } from './Renderer';
const controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(x,y , z);
controls.update();//update()函数内会执行camera.lookAt(controls.targe)

export { camera,controls };