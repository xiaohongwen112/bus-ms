<template>
	<div>
		<div>
			<div class="operate-buttons">
        <ul class="operate-icons">
          <li v-if="VisitTopov" class="operate-item" @click="createNewFlag = true">
            <i class="icon-bms-add"></i>
            <img src="../../../assets/manageApp/addTopoH.svg" alt="">
            <span class="operate-title">新建拓扑图</span>
          </li>
          <li v-if="VisittopovImport" class="operate-item" @click="importMap">
            <i class="icon-bms-import"></i>
            <img src="../../../assets/manageApp/importTopoH.svg" alt="">
            <span class="operate-title">导入拓扑图</span>
          </li>
          <li class="operate-item" @click="showTimeFlag = !showTimeFlag">
            <i class="icon-bms-timeaxis"></i>
            <img src="../../../assets/manageApp/timeaxisH.svg" alt="">
            <span class="operate-title">{{showTimeFlag ? '隐藏时间轴':'显示时间轴'}}</span>
          </li>
        </ul>
			</div>
      <div id="cardContainer" ref="cardBox">
        <ManageCard 
          v-for="(i, index) in cardList" 
          :key="index" v-show="showCard(index)" 
          :data="i"
          :showTime = "showTimeFlag"
          @reLoadCard="reLoadCard"
        ></ManageCard>
        <div class="noCreatNode" v-if="notCrate">
          <div class="noCreatImg"><button   @click="createNewFlag = true">添加</button></div>
        </div>
      </div>
      <Pagination :total="totalNum" :current="nowPage" @to-page="goTo" v-show="this.cardList.length!==0"></Pagination>
		</div>
    <create-card :showFlag="createNewFlag" 
      @createNew='createNew'
      @cancel="createNewFlag = false"></create-card>
      <Cmtip :tipContent="tipMessage" v-show="showTips" :showFooter="showFooter" @on-confirm="applyApp" @on-cancel="reFlashPage" :closeFn="cancleApply">
      </Cmtip>
      <DialogModal
        :show="showApply"
        :percent="percent"
        :msg="msg"
        :finish="finish"
        :showApplyOk="showApplyOk"
        @clickOk="onApplyOk"
      />
      <form class="import-app-form" action="/zh-cn/importapp/" id="import_form" enctype="multipart/form-data">
        <div><input type="hidden" class="file-form" name="csrfmiddlewaretoken" :value="token"></div>
        <input type="file" accept=".json" name="datapath_file" class="datapath_file" id="datapath_file" @change="chooseFile">
      </form>
  </div>
</template>
<script>
import Operate from '@/components/manageApp/main/OperateButton';
import ManageCard from '@/components/manageApp/main/ManageCard';
import CreateCard from '@/components/manageApp/main/CreateNewCard';
import { Pagination } from '@/components/common';
import configBox from '@/components/common/ConfigBox';
import { genV4 as uuidV4 } from 'uuidjs';
import Cmtip from '@/components/common/CmTip';
import DialogModal from '@/components/editTopo/DialogModal';
import ScrollBar from '@/components/common/ScrollBar';

import * as d3 from 'd3';
import jsCookie from 'js-cookie';
import * as api from '../service';
import BaselineItem from './BaselineItem';


export default {
  components: { ScrollBar, Operate, ManageCard, Pagination, CreateCard, configBox, Cmtip, DialogModal, BaselineItem },
  data() {
    return {
      VisitTopov: true,
      VisittopovImport: true,
      dataPath: {},
      appName: '',
      token: jsCookie.get('csrftoken'),
      showTimeFlag: false, // 显示隐藏时间轴
      createNewFlag: false,
      tipMessage: '',
      showTips: false,
      showFooter: false,
      showApply: false,
      percent: 0,
      msg: [],
      finish: '',
      notCrate: false, // 无数据展示
      showApplyOk: false,
      tabList: [{
        icon: 'icon-bms-health',
        name: '健康度配置',
      }],
      operateList: [{
        icon: 'icon-bms-add',
        title: '新建业务系统',
        color: '#1dcee2',
        styleClass: 'operate',
      }, {
        icon: 'icon-bms-import',
        title: '导入可视化服务图',
        color: '#1dcee2',
        styleClass: 'operate',
      }, {
        icon: 'icon-bms-timeaxis',
        title: '显示时间轴',
        color: '#1dcee2',
        styleClass: 'operate',
      }],
      cardList: [],
      pageCol: 0,
      pageRow: 0,
      nowPage: 1,
    };
  },
  computed: {
    totalNum() {
      return Math.ceil(this.cardList.length / (this.pageCol * this.pageRow));
    },
  },
  created() {
    window.onresize = () => {
      this.getPage();
      if (this.nowPage > this.totalNum) {
        this.nowPage = 1;
      }
    };
  },
  mounted() {
    this.VisitTopov = this.session$.newpermissions.topov_edit;
    this.VisittopovImport = this.session$.newpermissions.topov_import;
    this.getCardList();
    this.getPage();
    window.setInterval(this.getCardList, 60000);
  },
  methods: {
    cancleApply() {
      this.showFooter = false;
      this.showTips = false;
    },
    importMap() {
      d3.select('.datapath_file')._groups[0][0].click();
    },
    chooseFile() {
      const self = this;
      window.$('.import-app-form').ajaxSubmit({
        dataType: 'json',
        success(result) {
          if (result.status === 200) {
            self.showTips = true;
            self.tipMessage = '导入成功，是否直接应用？';
            self.showFooter = true;
            self.dataPath = result.datapath;
            self.appName = result.name;
          } else {
            self.showTips = true;
            self.showFooter = false;
            self.tipMessage = result.message;
          }
          d3.select('.datapath_file')._groups[0][0].value = '';
        },
      });
    },
    reFlashPage() {
      this.getCardList();
    },
    applyApp() {
      this.showTips = false;
      let count = 0;
      const all = 28;
      const taskId = uuidV4().hexString;
      const event = new EventSource(`/zh-cn/events/task/${taskId}/`);
      this.finish = '正在应用您做的修改，请稍候。可能会需要几分钟...';
      this.showApply = true;

      const _this = this;
      event.addEventListener('ack', () => {
        _this.applyDataPath(_this.appName, _this.dataPath, taskId);
      }, false);
      event.addEventListener('event', (e) => {
        count += 1;
        const time = window.getServerTime();
        _this.percent = Number((count / all).toFixed(2));
        _this.msg.push(`${time}  ${JSON.parse(e.data).msg}`);
      }, false);
      event.addEventListener('eof', () => {
        event.close();
        _this.showApplyOk = true;
        _this.percent = 1;
      }, false);
    },
    async applyDataPath(appName, datapath, taskId) {
      try {
        const res = await api.applyDataPath(appName, datapath, taskId);
        const time = window.getServerTime();
        if (res.data.error && res.data.error === 1) {
          this.finish = res.data.error_msg;
        } else {
          this.finish = `${time} 应用已经完成！可关闭窗口`;
        }
      } catch (e) {
        console.log('error', e);
      }
    },
    reload() {
      window.location.reload();
    },
    onApplyOk() {
      this.showApply = false;
      this.getCardList();
      this.getPage();
      this.reload();
    },
    goTo(val) {
      this.nowPage = val;
    },
    getPage() { // 判断页面显示几张卡片
      const oneCardWidth = 646;
      const oneCardHeight = 190;
      const widthWidth = window.innerWidth;
      this.pageCol = '';
      this.pageRow = '';
      this.pageCol = Math.floor(this.$refs.cardBox.clientWidth / (oneCardWidth + 100));
      this.pageRow = Math.floor((this.$refs.cardBox.clientHeight - 140) / oneCardHeight);
      this.$refs.cardBox.style.paddingLeft = `${(widthWidth - (this.pageCol * oneCardWidth)) / 2}px`;
      this.$refs.cardBox.style.paddingTop = `${(this.$refs.cardBox.clientHeight - this.pageRow * oneCardHeight) / 3}px`;
    },
    reLoadCard() {
      this.nowPage = 1;
      this.getCardList();
    },
    createNew() {
      this.createNewFlag = false;
      this.showTips = true;
      this.tipMessage = '业务创建成功，点击可视化服务图设计按钮设计业务拓扑图';
      this.nowPage = 1;
      this.getCardList();
    },
    async getCardList() {
      const self = this;
      try {
        const res = await api.getCardPath();
        this.cardList = res.data;
        self.notCrate = this.cardList.length <= 0;
      } catch (e) {
        console.log('error', e);
      }
    },
    showCard(index) {
      const startNum = this.nowPage - 1;
      const start = startNum * (this.pageCol * this.pageRow);
      const end = this.nowPage * (this.pageCol * this.pageRow);
      if (index + 1 > start && (index + 1) <= end) {
        return true;
      }
      return false;
    },
  },
};
</script>
<style lang="scss">
.config-container .content .nav-content{
  height: 100% !important;
  padding: 0 !important;
}
.baseline-name1, .baseline-name2, .baseline-name3{
  display: inline-block;
}
.baseline-name1{
  width: 50px;
}
.baseline-name2{
  width: 115px;
  color: #00C3E7;
}
.baseline-name3{
  width: 32px;
}
.baseline-select{
  padding: 0 8px;
  border: 1px solid #0e3a5a;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  background: none;
  font-size: 16px;
  text-align: center;
  width: 70px;
  color: #eee;
}
.healthDefault {
  float: right;
  margin: 20px 50px 0 50px !important;
}
</style>

<style lang="scss" scoped>
.operate-buttons {
  padding: 15px 30px;
  overflow: hidden;
}
#cardContainer {
  position: absolute;
  left: 0;
  right: 0;
  top: 70px;
  bottom: 80px;
  .noCreatNode {
    position: absolute;
    width: 50%;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;
    .noCreatImg {
      position: absolute;
      width: 50%;
      height: 70%;
      top: 200px;
      left: 0;
      right: 0;
      margin: auto;
      background: url(../../../assets/sys-icon/noDataCreate.svg);
      background-size: cover;
      width: 216px;
      height: 116px;
      >button{
        position: absolute;
        height: 28px;
        line-height: 28px;
        text-align: center;
        padding: 0 18px;
        border: 1px solid #00C3E7;
        color: #00C3E7;
        font-size: 16px;
        display: inline-block;
        border-radius: 15px;
        margin-right: 10px;
        cursor: pointer;
        background: #08111a;
        top: 120px;
        left: 70px;
      }
    }
    
  }
}
.operate-icons {
  float: left;
  >li {
    float: left;
    margin-right: 15px;
    color:#00C3E7;
    cursor: pointer;
    height: 25px;
    >i{
      font-size: 30px;
    }
    >img {
      display: none;
    }
    >span {
      font-size: 16px;
      display: none;
    }
    &:hover {
      >img, >span{
        display: inline-block;
        vertical-align: middle;
      }
      >i {
        display: none;
      }
    }
  }
}



.import-app-form{
  display: inline-block;
  .datapath_file, .file-form {
    display: none;
  }
}
.config-area{
  width: 100%;
  height: 480px;
  padding: 30px 50px 0 50px;
  border-bottom: solid 1px #15c1e3;
}
.config-item{
  width: 50%;
}
</style>

