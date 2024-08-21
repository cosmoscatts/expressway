<template>

    <div class="con">

        <div style="padding: 8px 12px;margin-top: -10px;">
            <div class="out">
                <span class="in">全开</span>
                <el-switch v-model="allBool" />
            </div>
            <div class="out" v-for="(danggan,i) in dangganArr" :key="i">
                <span class="in">0{{i+1}}</span>
                <!-- v-model直接绑定val会报错 -->
                <el-switch v-model="openBoolArr[i]" @click="openClose(i,danggan)" />
            </div>
        </div>

    </div>
</template>

<script>
import * as THREE from 'three'
import {
    CreatePointsTag
} from './ThreeBase/PointsTag.js';
import { camera, controls } from './ThreeBase/Camera.js';
import { raychoose } from './ThreeBase/raychoose.js';
import { createGanTween } from './createTween';
// import {
//     createCameraTween
// } from './createTween.js';

export default {
    name: 'Control',
    props: ['model'],
    data() {
        return {
            allBool: false,//是否全部打开档杆
            dangganArr: [],//所有档杆对象
            openBoolArr: [],//所有档杆对象开关状态对应布尔值,控制按钮状态显示
        };
    },
    watch: {
        // 开关全部档杆
        allBool: function (val) {
            if (val) {//如果是true，说明，点击按钮之前是false，即关闭状态，需要打开
                for (let i = 0; i < 8; i++) {
                    const gz = this.model.getObjectByName('GZ00' + (i + 1));
                    gz.open.start();
                    gz.openBool = true;//同步其他档杆状态值
                    this.openBoolArr[i] = true;//同步其他档杆对应控制按钮
                }
            } else {
                for (let i = 0; i < 8; i++) {
                    const gz = this.model.getObjectByName('GZ00' + (i + 1));
                    gz.close.start();
                    gz.openBool = false;
                    this.openBoolArr[i] = false;
                }
            }
        }
    },
    created() {
        // // 批量给每一个档杆设置一个相机动画
        // for (let i = 0; i < 8; i++) {
        //     const gan = this.model.getObjectByName('GZ00' + (i + 1));
        //     const target = new THREE.Vector3();
        //     gan.getWorldPosition(target);
        //     target.y -= 1;
        //     const pos = new THREE.Vector3();
        //     pos.set(target.x - 3, target.y + 6, target.z + 20,)
        //     createCameraTween(gan, camera, controls, pos, target);
        // }

        // 批量给每一个档杆设置一段开关动画
        for (let i = 0; i < 8; i++) {
            const gz = this.model.getObjectByName('GZ00' + (i + 1));
            createGanTween(gz);
            this.dangganArr.push(gz);
            this.openBoolArr.push(false);
        }

        const spriteArr = [];//所有热点模型集合
        // 给每个档杆添加一个模型热点
        for (let i = 0; i < 8; i++) {
            const gz = this.model.getObjectByName('GZ00' + (i + 1));
            const sprite = CreatePointsTag(gz);
            // const pos = new THREE.Vector3();
            // sprite.getWorldPosition(gz);//obj模型坐标原点对应的世界坐标
            // sprite.position.copy(pos); //光点位置设置

            // 计算档杆包围盒，通过包围盒计算出来档杆包围盒集中中心坐标
            const box3 = new THREE.Box3();
            box3.expandByObject(gz);
            const size = new THREE.Vector3();
            box3.getSize(size);
            sprite.position.x += size.x * 0.7;// 根据包围盒尺寸移动热点模型
            // sprite.position.y += 0.4;//稍微向上偏移：根据热点模型尺寸写
            sprite.position.z += 0.5;//在档杆前方适当偏移，避免旋转的时候被挡杆遮挡部分：根据热点模型尺寸写
            gz.add(sprite);
            sprite.i = i;//给热点模型编序号
            spriteArr.push(sprite);
            gz.openBool = false;//自定义一个属性用来判断档杆的状态
        }


        const _this = this;
        // 鼠标点击档杆热点，开关档杆
        addEventListener('click', function (event) {
            const chooseObj = raychoose(event, spriteArr, camera);
            if (chooseObj) {
                const gz = _this.model.getObjectByName('GZ00' + (chooseObj.i + 1));
                if (_this.openBoolArr[chooseObj.i]) {
                    gz.close.start();// 判断档杆打开状态，关闭档杆
                    gz.close.onStart(function () {
                        gz.openBool = false;
                        _this.openBoolArr[chooseObj.i] = false;
                        // _this.closeTween(gz);
                
                    })
                } else {
                    gz.open.start();// 判断档杆关闭状态，打开档杆
                    gz.open.onStart(function () {
                        gz.openBool = true;
                        _this.openBoolArr[chooseObj.i] = true;
                        // _this.openTween(gz);
                    })
                }

            }
        })
    },
    mounted() {

    },

    methods: {
        openClose: function (i, gz) {
            const _this = this;
            if (gz.openBool) {
                gz.close.start();
                gz.close.onStart(function () {
                    gz.openBool = false;
                    _this.openBoolArr[i] = false;
                })
                // this.closeTween(gz);
            } else {
                gz.open.start();
                gz.open.onStart(function () {
                    gz.openBool = true;
                    _this.openBoolArr[i] = true;
                })
                // this.openTween(gz);
            }
            
        },
        // 档杆开关应对的相机动画
        // openTween: function (chooseObj) {
        //     // 相机动画
        //     chooseObj.in.start();
        //     chooseObj.in.onStart(function () {
        //         // _this.clickBool = true;//相机动画执行期间，不进行射线拾取
        //     })
        // },
        // closeTween: function (chooseObj) {
        //     chooseObj.out.start();
        //     chooseObj.out.onComplete(function () {
        //         // _this.clickBool = false;
        //     })
        // },
    },
};
</script>

<style scoped>
.con {
    position: absolute;
    top: 250px;
    left: 20px;

}

.out {
    background: rgba(0, 0, 0, 0.4);
    width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    margin-top: 20px;
}

.in {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.3);
    display: inline-block;
    line-height: 40px;
    color: #fff;
    text-align: center;
    /* vertical-align:; */
}
</style>



  
