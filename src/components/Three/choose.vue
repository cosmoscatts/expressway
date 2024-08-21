<template>
  <div id="messageTag">
    <div v-if="chooseObj" style="width:500px;height:400px;position: absolute;color: #fff;z-index: 12;font-size: 16px;">

      <!-- top:-80px;left: 20px;相对原来位置偏移5标注 -->
      <!-- top:-280px;left: -230px; -->
      <div style="position:relative;top:-280px;left: -230px;">
        <!-- 收费站标签信息背景图片 -->
        <div style="position: absolute;left: 0px;top: 0px;">
          <img src="../../assets/信息背景.png" alt="" style="width:400px;opacity: 1.0;">
        </div>
        <!-- 收费站名称 -->
        <div id="shoufeizhan"
          style="color: linear-gradient(red, blue);position:absolute;left:25px;top:40px;font-size:16px">
          {{shoufeizhan}}
        </div>

        <!-- 当天已经通车的次数 -->
        <div style="position:absolute;left:155px;top:80px;font-size:60px;color:#00ffff;vertical-align:middle">
          <span id="CarNum">{{CarNum}}</span><span style="font-size: 14px;">
            车次
          </span>
        </div>
        <div style="position:absolute;left:85px;top:163px;padding:8px 25px;">
          <span id="shouName">{{shouName}}</span>
        </div>
        <div style="position:absolute;left:200px;top:165px;padding:8px 25px;">
          工号：<span id="shouNameId">{{shouNameId}}</span>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
// 引入three.js
import * as THREE from 'three';
import { tag } from './ThreeBase/messageTag.js';//HTML标签相关代码
import messageData from './messageData.js'//收费站数据模拟
import { raychoose } from './ThreeBase/raygroupchoose.js'


import {
  createCameraTween
} from './createTween.js';

import { camera } from './ThreeBase/Camera';
export default {
  name: 'choose',
  props: ['model', 'outlinePass', 'camera', 'controls'],
  data() {
    return {
      chooseObj: null,
      shoufeizhan: "收费窗口SF001",
      CarNum: 6559,
      shouName: '潘金莲',
      shouNameId: "00012",
      clickBool: false,//动画期间鼠标事件不进行射线拾取
    };
  },
  created() {
    // 批量给每一个收费站窗口设置一个相机动画
    for (let i = 0; i < 7; i++) {
      const shoufei = this.model.getObjectByName('SF00' + (i + 1));
      const target = new THREE.Vector3();
      shoufei.getWorldPosition(target);
      target.y -= 1;
      const pos = new THREE.Vector3();
      pos.set(target.x - 5, target.y + 3, target.z + 10,)
      // pos.copy(target);
      // pos.addScalar(5);
      createCameraTween(shoufei, this.camera, this.controls, pos, target);
    }
  },
  mounted() {

    let chooseObj = null
    const _this = this;
    // click mousemove
    addEventListener('click', function (event) {
      if (_this.clickBool) return;//相机动画执行期间，不进行射线拾取
      //射线拾取模型对象
      if (chooseObj) {
        chooseObj = null
        _this.outlinePass.selectedObjects = [];
      }
      const chuangkou = _this.model.getObjectByName('收费窗口');
      chooseObj = raychoose(event, chuangkou.children, camera);// 判计算拾取到的对象
      _this.chooseObj = chooseObj;
      if (chooseObj) {
        _this.outlinePass.selectedObjects = [chooseObj];
      } else {
        _this.chooseObj = null;
      }

      // 选中不同收费站窗口，HTML标签信息跟着改变
      if (chooseObj) {
        // 相机动画
        chooseObj.in.start();
        chooseObj.in.onStart(function () {
          _this.clickBool = true;//相机动画执行期间，不进行射线拾取
        })
        chooseObj.in.onComplete(function () {
          chooseObj.out.delay(3000);//延迟
          chooseObj.out.start();
          chooseObj.out.onComplete(function () {
            _this.clickBool = false;
          })
        })
        // 选中收费站窗口对应的数据
        const message = messageData[chooseObj.name];
        // 更新vue data属性
        _this.shoufeizhan = message.shoufeizhan;
        _this.CarNum = message.CarNum;
        _this.shouName = message.shouName;
        _this.shouNameId = message.shouNameId;


        //id"messageTag"对应的HTML元素作为three.js标签
        const messageTag = tag("messageTag")
        _this.model.add(messageTag);

        const pos = new THREE.Vector3();
        chooseObj.getWorldPosition(pos); //收费窗口世界坐标    
        messageTag.position.copy(pos);//设置标签的位置

        // 数字滚动动画
        const CarNumMax = _this.CarNum
        _this.CarNum = 0;
        const interval = setInterval(function () {
          if (_this.CarNum < CarNumMax) {
            _this.CarNum += Math.floor(CarNumMax / 50);
          } else {
            clearInterval(interval);//一旦达到当日通车数量，取消周期性函数interval
          }
        }, 5);

      }
    });



  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>