<template>
  <div ref="webgl">
    <!-- 首页加载期间的背景图片，加载完成隐藏 -->
    <!-- <img v-if="percentBool" ref="backimg" class="backimg" src="../../assets/首屏背景.jpg" alt="" width="100%" height="100%"> -->
    <!-- 半透明遮挡背景图片 -->
    <div ref="back" class="back" v-if="percentBool">
      <!-- 进度条 -->
      <el-progress class="percent" :text-inside="false" :stroke-width="6" :percentage="percent" />
    </div>
    <!-- v-if="model"：model初始值为空，gltf加载完成才赋值，才会调用control组件 -->
    <control v-if="model" v-bind:model="model"></control>

    <choose v-if="model" :model="model" :outlinePass="outlinePass" :camera="camera" :controls="controls"></choose>

    <shou-num v-if="model" :model="model"></shou-num>

    <!-- <car-tag v-if="carBool" :model="model" :car="car"></car-tag> -->
    <!-- <div v-if="carBool"> -->
    <car-tag :model="model" v-for="(obj,i) in carArr" :key="i" :car="obj"></car-tag>
    <!-- </div> -->
    <!-- <points-tag v-if="model" :model="model"></points-tag> -->


  </div>
</template>

<script>
// 引入Three.js
import * as THREE from 'three';
// 引入gltf模型加载库GLTFLoader.js
import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
// DRACOLoader解析Draco压缩过的gltf模型
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import './ThreeBase/RenderLoop.js';//调用渲染循环，threejs输出Canvas画布渲染动画

import { scene } from './ThreeBase/scene.js';
import { camera, controls } from './ThreeBase/Camera.js';
import { renderer } from './ThreeBase/Renderer.js';
import { outlinePass } from './ThreeBase/composer.js';
import control from './control.vue';
import choose from './choose.vue';
import ShouNum from "./ShouNum.vue"; //车道标注序号
import CarTag from "./CarTag.vue"; //车辆可视化
// import PointsTag from "./PointsTag.vue"; //档杆热点
export default {
  name: 'ThreeCanvas',

  data() {
    return {
      percent: 0,//三维场景模型加载进度百分比%
      percentBool: true,//进度条是否显示
      value1: true,
      model: null,
      outlinePass: null,
      camera: null,
      controls: null,
      carBool: false,//所有车模型加载成功，设置为true，调用CarTag组件
      carGltfArr: [],//数组元素：每一种车的gltf模型集合
      carArr: [],//场景中需要可视化的车辆，动态变化
      fileNum: 0//统计加载的车gltf文件数量
    };
  },
  created() {
  },
  components: {
    control,
    choose,
    ShouNum,
    CarTag,
    // PointsTag,
  },
  watch: {
    fileNum: function (val) {//判断车的所有gltf是否加载完成
      if (val == 6) this.carBool = true;
    },
    // ['大货车', '警车', '救护车', '客车', '消防车', '小货车']
    carBool: function (val) {
      // 随机生成几组需要可视化的车辆数据
      const _this = this;
      const carType = ['大货车', '警车', '救护车', '客车', '消防车', '小货车'];
      const numArr = ['豫N·55666', '京A·53466', '苏B·55556', '鲁C·51266', '苏D·33456', '鲁A·57826'];
      const nameArr = ['武大郎', '宋江', '武松', '林冲', '镇关西', '鲁智深'];
      let num = 1;
      setTimeout(function () {
        setInterval(function () {
          const carIndex = Math.floor(Math.random() * 6);//随机选择一辆车，并设置车的类型
          const car = _this.carGltfArr[carIndex].clone();
          // car.carType = carType[carIndex];//车辆的类型 
          car.carType = _this.carGltfArr[carIndex].name;//车辆的类型 
          num += 1;
          if (num == 8) num = 2;
          car.order = num;//所在车道
          car.num = numArr[Math.floor(Math.random() * 6)];//车牌号
          car.driverName = nameArr[Math.floor(Math.random() * 6)];//驾驶员姓名
          car.state = Math.random() > 0.5 ? '正常' : '异常';//状态
          _this.carArr.push(car);
        }, 2000)
      }, 6000)

      setTimeout(function () {
        const car = _this.carGltfArr[1].clone();
        car.order = 3;//所在车道
        car.num = '京A·53466';//车牌号
        car.driverName = '宋江';//驾驶员姓名
        car.carType = _this.carGltfArr[1].name;//车辆类型
        car.state = '异常';//状态
        _this.carArr.push(car);
      }, 1000)
      setTimeout(function () {
        const car = _this.carGltfArr[3].clone();
        car.order = 4;//所在车道
        car.num = '豫N·55666';//车牌号
        car.driverName = '武大郎';//驾驶员姓名
        car.carType = _this.carGltfArr[3].name;//车辆类型
        car.state = '正常';//状态
        _this.carArr.push(car);
      }, 200)
      setTimeout(function () {
        const car = _this.carGltfArr[2].clone();
        car.order = 5;//所在车道
        car.num = '苏B·55556';//车牌号
        car.driverName = '武松';//驾驶员姓名
        car.carType = _this.carGltfArr[2].name;//车辆类型
        car.state = '正常';//状态
        _this.carArr.push(car);
      }, 500)
      setTimeout(function () {
        const car = _this.carGltfArr[4].clone();
        car.order = 6;//所在车道
        car.num = '鲁C·51266';//车牌号
        car.driverName = '林冲';//驾驶员姓名
        car.carType = _this.carGltfArr[4].name;//车辆类型
        car.state = '异常';//状态
        _this.carArr.push(car);
      }, 1000)
    }
  },
  mounted() {
    // console.log(this.$refs.back)
    this.$refs.back.style.width = window.innerWidth + 'px';
    this.$refs.back.style.height = window.innerHeight + 'px';
    // this.$refs.backimg.style.width = window.innerWidth + 'px';
    // this.$refs.backimg.style.height = window.innerHeight + 'px';


    const model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景
    scene.add(model); //model添加到场景中


    // threejs渲染结果canvas画布布局
    // this.$refs.webgl.appendChild(renderer.domElement);
    // // Three.js渲染结果Canvas画布插入到body元素中
    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0px";
    renderer.domElement.style.left = "0px";
    renderer.domElement.style.zIndex = "-1"; //canvas全屏，不遮挡其它HTML元素
    // 加载环境贴图
    // var textureCube = new THREE.CubeTextureLoader()
    //   .setPath('./环境贴图/环境贴图1/')
    //   .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    // DRACOLoader解析Draco压缩过的gltf模型
    const dracoLoader = new DRACOLoader();
    // DRACOLoader依赖的多个js文件在public下的libs文件中
    dracoLoader.setDecoderPath('./libs/dracogltf/');
    const loader = new GLTFLoader(); //创建一个GLTF加载器
    loader.setDRACOLoader(dracoLoader);
    const _this = this;
    loader.load("./收费站Draco.glb", function (gltf) { //gltf加载成功后返回一个对象
      // console.log('控制台查看gltf对象结构', gltf);
      model.add(gltf.scene);//三维场景添加到model组对象中
      // 加载完成隐藏进度条
      _this.percentBool = false;
      _this.model = model;

      // const group = _this.model.getObjectByName('收费站主体');
      // console.log('收费站主体', group);
      // 递归遍历gltf.scene
      // group.traverse(function (object) {
      // if (object.type === 'Mesh') {
      // 批量更改所有Mesh的材质
      // object.material = new THREE.MeshLambertMaterial({
      //     map: object.material.map, //获取原来材质的颜色贴图属性值
      //     color: object.material.color, //读取原来材质的颜色
      // })
      // object.material.metalness = 1.0;
      // object.material.roughness = 0.5;
      // object.material.envMap = textureCube;
      // }
      // })

      // 所有车模型无顺序加载，声明一个变量fileNum计数，超过总文件数，就开始调用cartag.vue组件，即_this.carBool = true;
      // 
      const fileArr = ['大货车', '警车', '救护车', '客车', '消防车', '小货车'];
      for (let i = 0; i < fileArr.length; i++) {
        loader.load("./车/" + fileArr[i] + "Draco.glb", function (gltf2) {
          _this.fileNum += 1;
          _this.carGltfArr.push(gltf2.scene);
          gltf2.scene.name = fileArr[i];//文件名作为车name的属性值
        });
      }
    }, function (xhr) {
      // xhr.loaded / xhr.total的范围0~1 
      // _this.percent = Math.floor(xhr.loaded / xhr.total * 100);//换算为百分比
      _this.percent = Math.floor(xhr.loaded / 2616064 * 100);//2616064是该项目xhr.total的具体大小
      // console.log('_this.percent',_this.percent);
      // console.log('xhr.total',xhr.total);
      // console.log('xhr',xhr);
    })
    this.outlinePass = outlinePass;
    this.camera = camera;
    this.controls = controls;
  },

  methods: {

  },
};
</script>

<style scoped>
.percent {
  /* 居中 */
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -4px;
  margin-left: -200px;
  z-index: 11;
}

.back {
  position: absolute;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
}

/* .backimg {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 9;
} */
</style>