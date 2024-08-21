// 场景总文件
// 引入Three.js
import * as THREE from 'three';


/**
 * 创建场景对象Scene
 */
const scene = new THREE.Scene();


/**
 * 光源设置
 */
// 平行光1
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(400, 200, 300);
scene.add(directionalLight);
// 平行光2
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.9);
directionalLight2.position.set(-400, -200, -300);
scene.add(directionalLight2);
//环境光
const ambient = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambient);

// Three.js三维坐标轴 三个坐标轴颜色RGB分别对应xyz轴
const axesHelper = new THREE.AxesHelper(2500);
// scene.add(axesHelper);

// import {
//     EXRLoader
// } from 'three/examples/jsm/loaders/EXRLoader.js';
// new EXRLoader().load('./环境全景图.exr', function (texture) {
//     // scene.background = texture;
//     // 全景图作为球体Mesh颜色纹理贴图
//     var geometry = new THREE.SphereGeometry(500, 50, 50);
//     // const geometry = new THREE.CylinderGeometry( 200, 200, 200, 32 );
//     var material = new THREE.MeshBasicMaterial({
//         map: texture,
//         side: THREE.BackSide, //默认前面可见，设置为背面可见即可
//     });
//     var mesh = new THREE.Mesh(geometry, material);
//     mesh.position.y+=20;
//     mesh.rotateY(Math.PI);
//     scene.add(mesh);
// })
// 全景图作为球体Mesh颜色纹理贴图
const texture = new THREE.TextureLoader().load("./全景2048.jpg");
var geometry = new THREE.SphereGeometry(500, 50, 50);
// const geometry = new THREE.CylinderGeometry( 200, 200, 200, 32 );
var material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide, //默认前面可见，设置为背面可见即可
});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.y += 20;
mesh.rotateY(Math.PI);
scene.add(mesh);

//设置纹理贴图编码方式和WebGL渲染器或composer后期伽马修正一致
material.map.encoding = THREE.sRGBEncoding;

// 设置雾化效果，雾的颜色和背景颜色相近，这样远处网格线和背景颜色融为一体
scene.fog = new THREE.Fog(0xffffff, -100, 2000);

export {
    scene
};