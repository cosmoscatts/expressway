// 引入Three.js
import * as THREE from 'three';
import {
    camera
} from './Camera.js'
import {
  renderer
} from './Renderer.js' //渲染器对象
import {
    scene
} from './scene.js'

import {
    EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
    RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
    ShaderPass
} from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { CopyShader } from 'three/examples/jsm/postprocessing/CopyShader.js';
import {
    OutlinePass
} from 'three/examples/jsm/postprocessing/OutlinePass.js';
// 伽马校正
import {
    GammaCorrectionShader
} from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

import config from './config';



// 创建一个渲染器通道，场景和相机作为参数
var renderPass = new RenderPass(scene, camera);
// 创建OutlinePass通道,显示外轮廓边框
var outlinePass = new OutlinePass(new THREE.Vector2(config.cWidth, config.cHeight), scene,
    camera);
// 后处理完成，设置renderToScreen为true，后处理结果在Canvas画布上显示
outlinePass.renderToScreen = true;

//设置要显示边框的网格模型
//交互的时候可以设置一个鼠标事件，点击选中了某个模型，就直接把某个模型作为值的元素
outlinePass.selectedObjects = [];


//outlinePass相关属性设置
outlinePass.visibleEdgeColor.set(0x00ffff); //模型描边颜色，默认白色          
outlinePass.edgeThickness = 4.0; //轮廓边缘描边厚度
outlinePass.edgeStrength = 6.0; //边缘发光强度,数值大，更亮一些
outlinePass.pulsePeriod = 2;//模型闪烁频率控制，默认0不闪烁
// outlinePass.hiddenEdgeColor.set(0x220101);//模型被遮挡部分描边颜色控制        
// outlinePass.edgeGlow = 0.0;//边缘发光，默认0.0
// outlinePass.downSampleRatio = 2;//下采样比,默认2
// outlinePass.usePatternTexture = false;//纹理,默认false

// 创建后处理对象EffectComposer，WebGL渲染器作为参数
var composer = new EffectComposer(renderer);
// 设置renderPass通道
composer.addPass(renderPass);
// 设置OutlinePass通道
composer.addPass(outlinePass);


// 景深
// import {
//     BokehPass
// } from 'three/examples/jsm/postprocessing/BokehPass.js';

// const bokehPass = new BokehPass( scene, camera, {
//     focus: 1000.0,
//     aperture: 0.025,
//     maxblur: 1000.01,

//     width: window.innerWidth,
//     height: window.innerHeight
// } );
// composer.addPass( bokehPass );



// FXAA锯齿
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
const FXAA = new ShaderPass( FXAAShader );
FXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
composer.addPass( FXAA );

// SSAA锯齿  没成功
// import {
//     SSAARenderPass
// } from 'three/examples/jsm/postprocessing/SSAARenderPass.js';
// const SSAA =  new SSAARenderPass( scene, camera );
// composer.addPass(SSAA);
// SMAA锯齿
// import {
//     SMAAPass
// } from 'three/examples/jsm/postprocessing/SMAAPass.js';
// const SMAA = new SMAAPass(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio());
// composer.addPass(SMAA);

const gammaCorrection = new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaCorrection);




export {
    composer,
    outlinePass
}