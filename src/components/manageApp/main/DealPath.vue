<template>
    <div class="pathBoxContainer">
      <config-box 
        :tabs="tabs"
        :width="80"
        :height="600"
        :hideStore = false
        @saveConfig="saveConfig" 
        @closeConfig="closeBox">
        <div slot="dealPath" class="dealPathBox" id="dealPathBox" @click="clearTip">
          <div class="dealPathBox-one">
            <span>交易类型</span>
            <select ref="configBox" name="" id="dealType" @mouseover="checkName" @mouseout="selectErr = false" v-model="choosePathType" :class="{'errorSelect': selectErr}" @change="selectErr = false">
              <option v-for="(i, index) in JSON.parse(pathData).transaction_type" :key="index">{{i}}</option>
            </select>
            <button class="add-ip-btn" @click="addTypePath">+</button>
            <!-- <button class="dealPath-store not-store" @click="storePath">保存</button> -->
            <button class="dealPath-store" :class="{'not-store': !isStoreFlag}" @click="storePath">保存</button>
          </div>
          <ScrollBar class="scroll-area ">
            <div class="dealPathBox-two" @scroll="scrollHideBox">
            <p class="path-title"><span>交易路径</span><span>路径绑定设置</span></p>
            
            <!-- 单个类型路径 -->
            <div class="path-configBox" v-for="(path, key, index) in pathShowInPage" :key="index">
              <div class="path-type-name">
                <div class="path-type-one" :ref="`oneNodeKey${index}`" @mouseover="inNode(key, index)"
                    @mouseout="outNode">
                  <div class="path-type-close" @click="deleteOnePath(key)">×</div>
                  <div class="path-type-title"
                  >{{key}}</div>
                  <div class="path-type-add" title="添加平行路径" @click="addMorePath(key)">＋</div>
                </div>
              </div>
              <div class="path-binding-setting">
                <div :ref="`${key}outContainer`" class="path-binding-outContainer" v-for="(item, itemIndex) in path" 
                :key="itemIndex"
                :class="{errorStore: item.errorStore}"
                >
                  <span class="prevBtn changeNodePosition" 
                    v-if="!item.prev"
                    @click="goPrev(key, itemIndex)"></span>
                  <span class="nextBtn changeNodePosition"
                    v-if="!item.next" 
                    @click="goNext(key, itemIndex)"></span>
                    <!-- 单条绑定路径 -->
                  <div class="path-binding-container" :style="{left: item.left}"  :ref="`oneNodeList${key}${itemIndex}`">
                    <div class="path-binding-remove" @click="deleteOnePathSetting(path, itemIndex, key)">×</div>
                    <div class="path-binding-show"  
                      v-for="(one, oneIndex) in item"
                      :key="oneIndex"
                      ref="oneNodeAll">
                      <!-- 单个路径 -->
                      <div class="path-oneItem" 
                        :class="{'userApply': one.status === 'apply'}"
                        @click="userSetNode(one)"
                        :ref="`oneNode${index}${itemIndex}${oneIndex}`"
                        @mouseover="inNode(one.disp_name, index, oneIndex, itemIndex)"
                        @mouseout="outNode">
                        <img class="path-oneItem-img" src="../../../assets/manageApp/icon-1-2.png" alt="">
                       <!-- 显示的节点名称 -->
                        <span class="path-one-name">{{intfToLevelName(one.level)}}</span>
                        <img class="path-oneItem-img" 
                          src="../../../assets/manageApp/icon.png" 
                          alt="" 
                          title="选择分支路径"
                          v-if="one.sub && one.sub.length > 1"
                          @click.stop="changeNodeItem(one.sub, item, key, itemIndex, oneIndex, index)">
                          <div style="position:absolute; z-index:5; color:#fff;right:0;top:1px;line-height:10px;">
                            <!-- 平行节点 -->
                            <p v-for="(ref, index) in one.sub" 
                            v-if="false"
                            :key="index" 
                            @click="changeNode(ref, item, key, itemIndex, oneIndex, index)"
                            >{{ref}}</p>
                          </div>
                      </div>
                      <div class="path-arrow" v-if="oneIndex < (item.length - 1)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </ScrollBar>
          <p class="dealPathBox-tips">
              交易路径的设置即为每种交易类型增加路径绑定，用于故障根源定位以及定位告警的产生</p>
        </div>
      </config-box>
      <div class="namePops" ref="nameBox">{{showTipsName}}</div>
        <ul class="intf-list" ref="ulBox" @mouseover="overUlBox" @mouseout="outUlBox">
          <li v-for="(li, liIndex) in nodeUlList" :key="liIndex"
            :class="{chooseThis: liIndex === commonIndex}"
            @click="changeOtherNode(li, liIndex)"
          >{{showName(li)}}</li>
        </ul>
    </div>
</template>
<script>
import configBox from '@/components/common/ConfigBox';
import ScrollBar from '@/components/common/ScrollBar';
// import { checkError } from '@/helpers/configValidate';
import * as api from '@/pages/manageApp/service';
import ShowNameBox from '@/components/manageApp/main/ShowNameBox';


export default {
  components: { configBox, ScrollBar, ShowNameBox },
  props: {
    appName: {
      type: String,
      default: '',
    },
  },
  watch: {
    showFlag() {},
    pathShowInPage: {
      handler() { this.isStoreFlag = true; },
      deep: true,
    },
  },
  data() {
    return {
      tabs: [
        { id: 'dealPath', text: '交易路径' },
      ],
      settings: {
        maxScrollbarLength: 60,
      },
      dealType: [],
      defaultPath: [], // 添加默认路径
      pathData: JSON.stringify({}),
      clientNode: [],
      choosePathType: '', // 当前的类型
      pathShowInPage: {}, // 页面上显示的数据
      showTipsName: '',
      nodeUlList: [], // 全局节点切换显示框
      clickNodeInfo: '', // 点击的信息
      commonIndex: 0,
      selectErr: false, // 交易类型存在
      isStoreFlag: false, // 保存按钮
      intervalFlag: true,
      clickKey: '', // 当前点击的key
      clickItem: 0, // 当前点击的某条路径
      showNameFlag: false,
    };
  },
  created() {
    this.getPathInfo();
  },
  methods: {
    overUlBox() {
      this.$refs.ulBox.style.display = 'block';
    },
    outUlBox() {
      this.$refs.ulBox.style.display = 'none';
    },
    inNode(name, index, oneIndex, itemIndex) {
      this.showTipsName = name;
      let nowNode = '';
      if (oneIndex !== undefined) {
        nowNode = this.$refs[`oneNode${index}${itemIndex}${oneIndex}`][0];
        const nameBoxTop = nowNode.getBoundingClientRect().top - nowNode.clientHeight * 3 - 10;
        this.$refs.nameBox.style.top = `${nameBoxTop}px`;
      } else {
        nowNode = this.$refs[`oneNodeKey${index}`][0];
        const nameBoxTop = nowNode.getBoundingClientRect().top - nowNode.clientHeight * 3 - 10;
        this.$refs.nameBox.style.top = `${nameBoxTop}px`;
      }
      const nameBoxLeft = nowNode.getBoundingClientRect().left;
      this.$refs.nameBox.style.left = `${nameBoxLeft}px`;
      if (nowNode.childNodes[2].scrollWidth !== nowNode.childNodes[2].clientWidth) {
        this.$refs.nameBox.style.display = 'block';
      } else {
        this.$refs.nameBox.style.display = 'none';
      }
    },
    outNode() {
      this.$refs.nameBox.style.display = 'none';
    },
    changeNodeItem(sub, item, key, itemIndex, oneIndex, index) { // 点击切换节点出现框
      sub.forEach((el, elIndex) => {
        if (item[oneIndex].level === el) {
          this.commonIndex = elIndex;
        }
      });
      this.$refs.ulBox.style.display = 'block';
      this.nodeUlList = sub;
      const nowNode = this.$refs[`oneNode${index}${itemIndex}${oneIndex}`][0];
      const nowNodeLeft = nowNode.getBoundingClientRect().left;
      const nowNodeTop = nowNode.getBoundingClientRect().top - nowNode.clientHeight * 2 + 18;
      this.$refs.ulBox.style.left = `${nowNodeLeft}px`;
      this.$refs.ulBox.style.top = `${nowNodeTop}px`;
      this.clickNodeInfo = { // 存放点击的节点信息
        key,
        itemIndex,
        oneIndex,
      };
    },
    changeOtherNode(ref) { // 节点切换框点击后切换节点
      this.$refs.ulBox.style.display = 'none';
      const nowItemName = this.clickNodeInfo.key;
      this.changeNode(ref, this.pathShowInPage[nowItemName][this.clickNodeInfo.itemIndex], this.clickNodeInfo.key, this.clickNodeInfo.itemIndex, this.clickNodeInfo.oneIndex);
      setTimeout(() => {
        this.arrowJudgy();
      }, 100);
    },
    scrollHideBox() { // 滚动事件时隐藏提示框
      this.$refs.nameBox.style.display = 'none';
      this.$refs.ulBox.style.display = 'none';
    },
    intfToLevelName(intf) { // 显示intf名称
      let flag = false;
      let show = '';
      const paths = JSON.parse(this.pathData);
      Object.keys(paths.relationship).forEach((el) => {
        if (paths.relationship[el] === intf) {
          flag = true;
          show = this.showName(el);
        }
      });
      if (!flag) {
        show = this.showName(intf);
      }
      return show;
    },
    intfToLevel(intf) { // intf转化成level
      let level = intf;
      const path = JSON.parse(this.pathData);
      Object.keys(path.relationship).forEach((el) => {
        if (path.relationship[el] === intf) {
          level = el;
        }
      });
      return level;
    },
    showName(level) { // level显示名称
      const path = JSON.parse(this.pathData);
      if (!path.datajson[level]) {
        return 'yousongxi';
      }
      return path.datajson[level].disp_name;
    },
    levelToIntf(level) { // level转成intf
      let intf = '';
      Object.keys(JSON.parse(this.pathData).relationship).forEach((el) => {
        if (el === level) {
          intf = JSON.parse(this.pathData).relationship[el];
        }
      });
      return intf;
    },
    userSetNode(node) { // 用户选择节点
      let nodeStatus = node.status;
      if (nodeStatus === 'apply') {
        nodeStatus = 'none';
      } else {
        nodeStatus = 'apply';
      }
      this.$set(node, 'status', nodeStatus);
      const repNode = this.pathShowInPage;
      this.pathShowInPage = Object.assign({}, repNode);
      // }
    },
    saveConfig() {
      console.log('save');
    },
    closeBox() {
      this.$emit('closeBox');
    },
    // 增加一个类型的交易路径
    addTypePath() {
      if (this.choosePathType === undefined || this.pathShowInPage[this.choosePathType]) {
        this.selectErr = true;
      } else {
        this.pathShowInPage[this.choosePathType] = [];
        this.pathShowInPage[this.choosePathType].unshift(JSON.parse(this.defaultPath));
        this.clickKey = this.choosePathType;
        this.clickItem = this.pathShowInPage[this.choosePathType].length - 1;
        const oneAdd = {};
        oneAdd[this.choosePathType] = this.pathShowInPage[this.choosePathType];
        this.pathShowInPage = Object.assign({}, oneAdd, this.pathShowInPage);
        // this.arrowJudgy();
        setTimeout(() => {
          this.arrowJudgy();
        }, 100);
      }
    },
    // 增加一个类型下的一条交易路径
    addMorePath(key) {
      this.clickKey = key;
      this.pathShowInPage[key].push(JSON.parse(this.defaultPath));
      this.clickItem = this.pathShowInPage[key].length - 1;
      setTimeout(() => {
        this.arrowJudgy();
      }, 100);
    },
    async getPathInfo() { // 获取交易路径初始化信息
      try {
        let res = await api.getPathInfo(this.appName);
        res = res.data;
        this.pathData = JSON.stringify(res.data);
        Object.keys(res.data.datajson).forEach((el) => { // 客户端起点
          if (res.data.datajson[el].type === 'client') {
            this.clientNode.push(el);
          }
        });
        this.choosePathType = res.data.transaction_type[0]; // 默认类型
        // 默认路径拼接参数
        res.data.default_path.forEach((el, index) => {
          res.data.datajson[el].status = 'none';
          res.data.datajson[el].color = 'none';
          res.data.datajson[el].level = el;
          this.defaultPath.push(res.data.datajson[el]);
          if (res.data.datajson[el].type !== 'client') { // sub存放当前可替换的节点信息
            this.defaultPath[index].sub = this.defaultPath[index - 1].ref;
          } else {
            this.defaultPath[index].sub = this.clientNode;
          }
        });
        this.defaultPath[0].sub = this.clientNode;
        this.defaultPath = JSON.stringify(this.defaultPath);

        // 用户选择回显数据
        if (res.data.transaction_path !== {}) {
          this.pathShowInPage = res.data.transaction_path;
          Object.keys(this.pathShowInPage).forEach((el) => {
            this.pathShowInPage[el].forEach((oneItem) => {
              oneItem.forEach((one, index) => {
                if (one.type === 'server') {
                  this.$set(one, 'level', this.intfToLevel(one.level));
                }
                this.$set(one, 'ref', res.data.datajson[one.level].ref);
                this.$set(one, 'disp_name', res.data.datajson[one.level].disp_name);
                if (index > 0) {
                  this.$set(one, 'sub', oneItem[index - 1].ref);
                } else {
                  this.$set(one, 'sub', this.clientNode);
                }
              });
              this.$set(oneItem, 'prev', true);
            });
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    deleteOnePath(key) { // 删除一个类型的交易路径
      delete this.pathShowInPage[key];
      const newObj = this.pathShowInPage;
      this.outNode();
      this.pathShowInPage = Object.assign({}, newObj);
    },
    // 删除一个类型下的一条交易路径
    deleteOnePathSetting(path, itemIndex, key) {
      if (path.length === 1) {
        delete this.pathShowInPage[key];
        const newObj = this.pathShowInPage;
        this.pathShowInPage = Object.assign({}, newObj);
      }
      path.splice(itemIndex, 1);
      const newObjs = this.pathShowInPage;
      this.pathShowInPage = Object.assign({}, newObjs);
    },
    // 改变当前节点
    changeNode(ref, item, key, itemIndex, oneIndex) {
      this.clickKey = key;
      this.clickItem = itemIndex;
      const left = this.pathShowInPage[key][itemIndex].left;
      const dataFront = this.pathShowInPage[key][itemIndex].slice(0, oneIndex); // 不被替换的节点
      const obj = [];
      let replaceNode = {};
      if (oneIndex === 0) {
        replaceNode = this.nextNode(ref, obj, item[oneIndex]);
      } else {
        replaceNode = this.nextNode(ref, obj, item[oneIndex - 1], oneIndex); // 被替换的节点
      }
      this.pathShowInPage[key][itemIndex] = dataFront.concat(replaceNode);
      this.pathShowInPage[key][itemIndex].left = left;
      const newObjs = this.pathShowInPage;
      this.pathShowInPage = Object.assign({}, newObjs);
    },
    arrowJudgy() { // 判断箭头是否存在
      if (typeof this.pathShowInPage[this.clickKey][this.clickItem].left === 'undefined') {
        this.$set(this.pathShowInPage[this.clickKey][this.clickItem], 'left', 0);
      }
      if (this.pathShowInPage[this.clickKey][this.clickItem].left >= 0) {
        this.$set(this.pathShowInPage[this.clickKey][this.clickItem], 'left', 0);
        this.$set(this.pathShowInPage[this.clickKey][this.clickItem], 'prev', true);
      } else {
        this.$set(this.pathShowInPage[this.clickKey][this.clickItem], 'prev', false);
      }
      const thisScrollWidth = this.$refs[`oneNodeList${this.clickKey}${this.clickItem}`][0].scrollWidth;
      const thisoffsetWidth = this.$refs[`oneNodeList${this.clickKey}${this.clickItem}`][0].offsetWidth;
      if (thisScrollWidth + this.pathShowInPage[this.clickKey][this.clickItem].left <= thisoffsetWidth) {
        this.$set(this.pathShowInPage[this.clickKey][this.clickItem], 'next', true);
      } else {
        this.$set(this.pathShowInPage[this.clickKey][this.clickItem], 'next', false);
      }
      const newObjs = this.pathShowInPage;
      this.pathShowInPage = Object.assign({}, newObjs);
    },
    // 查找下一节点
    nextNode(node, obj, one, oneIndex) {
      const show = JSON.parse(this.pathData).datajson[node];
      show.level = node;
      show.status = 'none';
      if (one.type === 'client') {
        show.sub = one.sub;
        if (oneIndex === 1) {
          show.sub = one.ref;
        }
      } else {
        show.sub = one.ref;
      }
      obj.push(show);
      if (show.ref.length > 0) {
        this.nextNode(show.ref[0], obj, show, 1);
      }
      return obj;
    },
    goPrev(key, itemIndex) {
      this.$refs.ulBox.style.display = 'none';
      if (typeof this.pathShowInPage[key][itemIndex].left === 'undefined' || this.pathShowInPage[key][itemIndex].left >= 0) {
        this.$set(this.pathShowInPage[key][itemIndex], 'left', 0);
      } else {
        if (this.intervalFlag) {
          this.speed(key, itemIndex, 'flag');
        }
      }
      const repNode = this.pathShowInPage;
      this.pathShowInPage = Object.assign({}, repNode);
    },
    speed(key, itemIndex, flag) {
      let count = 1;
      const allWidth = this.$refs.oneNodeAll[0].offsetWidth;
      const pathChildNum = this.$refs[`${key}outContainer`][itemIndex].lastChild.childNodes.length - 2;
      const speeds = (timestamp) => {
        console.log(timestamp);
        count += 1;
        this.intervalFlag = false;
        if (flag) {
          let golDis = this.pathShowInPage[key][itemIndex].left;
          if (typeof (golDis) === 'string') golDis = parseInt(golDis.substring(0, golDis.length - 2), 10);
          this.pathShowInPage[key][itemIndex].left = `${golDis + allWidth / 10}px`;
          if (Math.abs(parseInt(this.pathShowInPage[key][itemIndex].left, 10)) <= 20) {
            this.pathShowInPage[key][itemIndex].left = 0;
            this.pathShowInPage[key][itemIndex].prev = true;
            this.intervalFlag = true;
            return;
          }
        } else {
          let goDis = this.pathShowInPage[key][itemIndex].left;
          if (typeof (goDis) === 'string') goDis = parseInt(goDis.substring(0, goDis.length - 2), 10);
          this.pathShowInPage[key][itemIndex].left = `${goDis - allWidth / 10}px`;
          if (Math.abs(parseInt(this.pathShowInPage[key][itemIndex].left, 10)) >= Math.abs(allWidth * (pathChildNum - 1))) {
            this.pathShowInPage[key][itemIndex].next = true;
            this.intervalFlag = true;
            return;
          }
        }
        const repNode = this.pathShowInPage;
        this.pathShowInPage = Object.assign({}, repNode);
        if (count <= 10) {
          this.clickKey = key; // 当前点击的key
          this.clickItem = itemIndex;
          this.arrowJudgy();
          if (this.pathShowInPage[key][itemIndex].left >= 0) {
            this.$set(this.pathShowInPage[key][itemIndex], 'left', 0);
          }
          requestAnimationFrame(speeds);
        } else {
          this.intervalFlag = true;
          this.clickKey = key; // 当前点击的key
          this.clickItem = itemIndex;
          this.arrowJudgy();
        }
      };
      requestAnimationFrame(speeds);
    },
    goNext(key, itemIndex) {
      this.$refs.ulBox.style.display = 'none';
      if (typeof this.pathShowInPage[key][itemIndex].left === 'undefined') {
        this.$set(this.pathShowInPage[key][itemIndex], 'left', 0);
      }
      if (this.intervalFlag) {
        this.speed(key, itemIndex);
      }
      const repNode = this.pathShowInPage;
      this.pathShowInPage = Object.assign({}, repNode);
    },
    storePath() {
      const obj = {};
      let oneNode = [];
      let oneNodeList = [];
      let storeFlag = true;
      Object.keys(this.pathShowInPage).forEach((el) => {
        oneNodeList = [];
        this.pathShowInPage[el].forEach((oneList) => {
          const checkOneNode = [];
          oneNode = [];
          oneList.forEach((one, index) => {
            const oneItem = {};
            if (one.type === 'server') {
              oneItem.level = this.levelToIntf(one.level);
            } else {
              oneItem.level = one.level;
            }

            if (one.status === 'apply') {
              checkOneNode.unshift(index);
            }
            oneItem.type = one.type;
            oneItem.status = one.status;
            oneItem.color = one.color;
            oneNode.push(oneItem);
          });
          oneNodeList.push(oneNode);
          this.$set(oneList, 'errorStore', false);
          if (checkOneNode.length < 2) {
            storeFlag = false;
            this.$set(oneList, 'errorStore', true);
          } else {
            checkOneNode.forEach((one, index) => {
              if (index < checkOneNode.length - 1) {
                if (checkOneNode[index] - checkOneNode[index + 1] > 1) {
                  this.$set(oneList, 'errorStore', true);
                  storeFlag = false;
                }
              }
            });
          }
        });
        const repObj = this.pathShowInPage;
        this.pathShowInPage = Object.assign({}, repObj);
        obj[el] = oneNodeList;
      });
      if (storeFlag) {
        const objData = {
          transaction_path: JSON.stringify(obj),
        };
        this.storePathInfo(objData);
      }
    },
    async storePathInfo(data) {
      try {
        const res = await api.storePathInfo(this.appName, data);
        if (res.data.code === 0) {
          this.isStoreFlag = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    checkName() {
      if (!this.selectErr) window.show_msgs(window.d3.select(this.$refs.configBox), '存在重复的交易类型', 'right', true);
    },
    clearTip() {
      this.$refs.ulBox.style.display = 'none';
    },
  },
  mounted() {
    const _this = this;
    const containerBox = this.$el.querySelector('.config-container');
    window.addEventListener('resize', () => {
      _this.$refs.ulBox.style.display = 'none';
    });
    containerBox.addEventListener('scroll', () => {
      _this.$refs.ulBox.style.display = 'none';
    });
  },
};
</script>
<style>
.intf-list{
    position: absolute;
    background: #10202d;
    z-index: 200;
    width: 90px;
    overflow-x: hidden;
    overflow-y: auto;
    /* height: auto; */
    border: 1px solid #14cff5;
    max-height: 190px;
    display: none;
  /* overflow: hidden; */
}
.intf-list li{
    cursor: pointer;
    width: 90px;
    background:  #19354a;
    border-bottom: 1px solid #19354a;
     color: #11bee6;
    height: 28px;
    line-height: 28px;
    padding: 0 10px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #9EBFC6;
    font-size:12px;
}
.intf-list li.chooseThis  {
    background: #20699e;
}
.intf-list li:hover{
    background: #20699e;
}
.app-bottom-xx:hover .hideDiv{
    display: block;
}
.intf-list:hover .hideDiv{
    display: block;
}
.intf-list:hover .glhideDiv {
    display: block;
} 
.intf-list li:first-child{
    margin-top: 0;
}
.intf-list li:last-child{
    margin-bottom: 0;
}
.scroll-area {
  width: 100%;
  height: calc(100% - 110px);
  margin-top: 20px;
  border: 1px solid #2e4c61;
  background: #061521;
  overflow-y: auto;
  height: calc(100% - 110px);
}
</style>

<style lang="scss" scoped>
@media screen and (min-height: 1000px) {
  .scroll-area {
    height: 400px;
  }
}
@media screen and (max-height: 1000px) {
  .scroll-area {
    height: 400px;
  }
}
@keyframes trangleAnimation {
  from {
    border-right:16px solid rgba(3, 179, 251, 1);
    // height: 10px;
  }
  to {
    // opacity: 0;
    border-right:16px solid rgba(3, 179, 251, .1);
    // height: 20px;
  }
}
@keyframes trangleAnimationNext {
  from {
    border-left:16px solid rgba(3, 179, 251, 1);
    // height: 10px;
  }
  to {
    // opacity: 0;
    border-left:16px solid rgba(3, 179, 251, .1);
    // height: 20px;
  }
}

@keyframes boxshadow {
  from {
    box-shadow: 0 0 5px 0 #ff0000 inset;
  }
  to {
    box-shadow: 0 0 35px 3px #ff0000 inset;
  }
}
.namePops {
  position: absolute;
  display: none;
  word-wrap: break-word;
  word-break: break-all;
  // left: 50px;
  // top: 50px;
  z-index: 300;
      padding: 3px;
      border: 1px solid rgb(68, 110, 134);
      border-radius: 2px;
      background: rgb(24, 65, 95);
      box-sizing: content-box;
      font-size: 12px;
}
  @mixin overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  @mixin close {
     position: absolute;
      width: 16px;
      height: 16px;
      background-color: #c63f41;
      color:#fff;
      border-radius: 50%;
      top: calc(50% - 8px);
      left: -8px;
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      line-height: 12px;
      text-align: center;
  }
  .dealPathBox {
    position: relative;
    margin: 20px 30px 0;
  }
  .dealPathBox-one {
    border: 1px solid #0c3755;
    border-radius: 3px;
    height: 56px;
    line-height: 56px;
    padding: 0 70px;
  }
  #dealType {
    &.errorSelect {
      border: 1px solid red;
    }
    color: #00FBD2;
    height: 26px;
    text-indent: 2em;
    width: calc(45% - 10px);
    border: 1px solid #2b4055;
    margin: 0 10px 0 20px;
    font-size: 12px;
    >option {
      background: #0b3b50 !important;
      color:#bbd6d6!important;
    }
  }

  .add-ip-btn {
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    border: none!important;
    border-radius: 4px;
    height: 26px;
    width: 25px;
    line-height: 16px;
    background: #3dd9c4;
    outline: none;
    color: #081928;
    &:hover {
      color: #fff;
    }
  }
  .dealPath-store {
    height: 30px;
    margin-top: 15px;
    line-height: 10px;
    border-radius: 5px;
    cursor: pointer;
    padding: 10px;
    background: #1ecdb5;
    border: none;
    outline: none;
    color: #192d40;
    float: right;
    &.not-store {
      pointer-events: none;
      border: 1px solid #2e4c61;
      color: #2e4c61;
      background: #0A283B;
    }
  }

  .dealPathBox-two{
    height: calc(100% - 110px);
    // width: 100%;
  }
  .dealPathBox-tips{
    color: #6C7071;
    padding: 20px 0 0 50px;
  }
  .path-configBox {
    margin-bottom: 10px;
  }
  .path-title {
    font-size: 14px;
    color: #6c705a;
    display: flex;
    >span {
      text-align: center;
      line-height: 50px;
      &:nth-child(1) {
        flex: 1;
      }
      &:nth-child(2) {
        flex: 2;
      }
    }
  }
  .path-type-name {
    display: inline-block;
    width: 20%;
  }
  .path-binding-setting {
    display: inline-block;
    position: relative;
    overflow: hidden;
    border: 1px solid #0c3755;
    width: calc(80% - 70px);
    min-height: 75px;
    margin: 0 20px 0 40px;
    vertical-align: top;
    >.path-binding-outContainer {
        &.errorStore {
          // border:1px solid red;
          animation: boxshadow 2s ease-in-out infinite alternate;
        }
        &:hover {
          background-color: rgb(19, 33, 44);
          >.changeNodePosition {
              display: block;
            }
          >.path-binding-container{
            >.path-binding-remove {
              display: block;
            }
          }
        }
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        // margin-top: 10px;
        width:100%;
        padding:10px 10px 10px 30px;
        margin-top: 4px;
       >.changeNodePosition {
         display: none;
         height: 75px;
         width: 30px;
          position: absolute;
          top: 0;
          &:hover {
            background-color: #061521;
          }
          z-index: 200;
          line-height: 75px;
          cursor: pointer;
          &.prevBtn {
            left: 0;
            &:after {
              content: '';
              border: 16px solid transparent;
              border-right: 16px solid #03B3D7;
              height: 0;
              right: 6;
              top: 15px;
              position: absolute;
              animation: trangleAnimation 1s linear infinite alternate;
            }
          }
          &.nextBtn {
            right: 0;
            // display: inline-block;
            height: 100%;
            &:after {
              content: '';
              border: 16px solid transparent;
              border-left: 16px solid #03B3D7;
              height: 0;
              left: 10;
              top: 15px;
              position: absolute;
              animation: trangleAnimationNext 1s linear infinite alternate;
            }
          }
        }
        >.path-binding-container {
          position: relative;
          padding-left: 20px;
          // margin-left: 20px;
          left: 0;
          >.path-binding-remove {
            display: none;
          }
        &:hover {
          background-color: rgb(19, 33, 44);
          
        }
        >.path-binding-remove {
          @include close;
          left: 0;
        }

        >.path-binding-show {
          display: inline-block;
          >.path-oneItem{
            &.userApply {
              border: 2px solid #03B3D7 !important;
              background: #0B6880;
              color: #00CAF2;
            }
            &:hover {
              background: rgba(11, 104, 128, 0.5);
            }
            position: relative;
            cursor: pointer;
            display: inline-block;
            border: 2px solid #9EBFC6 !important;
            background: #071522;
            height: 47px;
            // width: 10%;
            line-height: 42px;
            min-width: 100px;
            text-align: center;
            vertical-align: middle;
            border-radius: 0 15px;
            padding: 0 10px;
            >.path-oneItem-img {
              vertical-align: middle;
              &:nth-child(1) {
                width: 35px;
              }
              &:nth-child(3) {
                // display: inline-block;
                // margin-top: 20px;
                width: 12px;
                padding: 1px;
                position: absolute;
                bottom: 0;
                right: 3px;
                border: 1px solid #9EBFC6 !important;
                border-radius: 5px 0px;
                cursor: pointer;
              }
            }
            >.path-one-name {
              display: inline-block;
              width: 54px;
              margin-left: -5px;
              vertical-align: middle;
              @include overflow;
            }
          }
          >.path-arrow {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 2px;
            background-color: #fff;
            left: -4px;
            top: -4px;
            &::after {
              content: '';
              position: absolute;
              right: -6px;
              top:-5px;
              width: 0;
              height: 0;
              border: 6px solid transparent;
              border-left: 6px solid #fff;
            }
          }
        }
      }
    }
  }
  .path-type-one {
    position: relative;
    border: 2px solid #9EBFC6 !important;
    background: #071522;
    margin-left: 40px;
    height: 46px;
    line-height: 42px;
    width: 80%;
    border-radius: 2px;
    vertical-align: middle;
    margin-top: 12px;
    // margin-left: 20%;
    >.path-type-close {
      @include close;
    }
    >.path-type-title {
      width: 85%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-left: 10px;
      float: left;
      text-align: center;
    }
    >.path-type-add {
      float: right;
      width: 12px;
      text-align: center;
      background: #037C99;
      height: 100%;
      cursor: pointer;
    }
  }

</style>
 