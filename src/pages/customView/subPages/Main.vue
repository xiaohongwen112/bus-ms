<template>
  <div>
    <NavBar :title="'交易总览'" :appName="'_'" />
    <Breadcrumb :title="'交易总览'" :crumbList="crumbList">
      <div slot="btnGroup" class="searchDiv">
        <select
          v-model="selectedApp"
          @change="getData"
        >
          <option value="all">全部交易</option>
          <option
            v-for="app in importanceData.app_count"
            :value="app.app_name"
            :key="app.app_name">{{ `${app.app_disp_name}(${app.count})` }}</option>
          <option value="follow">我的关注({{ importanceData.follow }})</option>
        </select>
        <div class="curSearchdiv">
          <input type="text" placeholder="搜索" v-model="searchTxt">
          <div
            class="searchRightBtn"
            @click="getData"
          ><img src="../../../assets/sys-icon/search.svg"></div>
        </div>
      </div>
    </Breadcrumb>
    <div>
      <!-- <TimeSeries /> -->
      <div class="customList" ref="cardContainer">
        <img
          v-if="cardsData.length === 0"
          class="noDataImage"
          src="../../../assets/common/noDataImg.svg"
        >
        <TradeCard
          v-for="(cardData, i) in cardsData"
          :data="cardData"
          :key="`${cardData.app_name}${cardData.intf_name}`"
          :index="currentPage === 1 && i === 0 ? 'first' : (currentPage === totalPage && i === lastNode) ? 'last' : ''"
          :i="i"
          :ifOneCard="importanceData.count!==1"
          @setOrder="editImportanceHandler"
          @setFollow="setFollow"
        />
      </div>
      <Pagination
        v-if="importanceData.count!==0 && this.totalPage !== Infinity"
        :total="totalPage"
        :current="currentPage"
        @to-page="goToPage"
      />
    </div>
  </div>
</template>
<script>

import {
  NavBar,
  Breadcrumb,
  Loading,
  Pagination,
  CmTip,
} from '@/components/common';
import TimeSeries from '@/components/common/TimeSeries';
import TradeCard from '@/components/customView/TradeCard';
import _ from 'lodash';

import * as api from '../service';

export default {
  components: {
    NavBar,
    Breadcrumb,
    Loading,
    TradeCard,
    Pagination,
    TimeSeries,
    CmTip,
  },
  data() {
    return {
      crumbList: ['index', 'manageapp', '交易总览'],
      searchTxt: '',
      currentPage: 1,
      pageSize: 8,
      importanceData: {},
      cardsData: [],
      selectedApp: 'all',
    };
  },
  methods: {
    async getImportance(follow) {
      try {
        const res = await api.getImportance({
          search: this.searchTxt,
          appName: this.selectedApp,
        });
        if (res.data.code === 0) {
          this.importanceData = res.data.data;
          if (res.data.data.follow > 0 && follow) {
            this.selectedApp = 'follow';
            this.importanceData.count = this.importanceData.follow;
          }
        } else {
          this.importanceData.count = 0;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async editImportance(cardData, direct, i) {
      try {
        await api.editImportance({
          app_name: cardData.app_name,
          intf_name: cardData.intf_name,
          direct,
          importance: cardData.importance,
          type: this.selectedApp,
        });
        if (direct === 'toTop') {
          this.currentPage = 1;
        } else if (direct === 'toBottom') {
          this.currentPage = this.totalPage;
        } else if (direct === 'front' && i % this.pageSize === 0) {
          this.currentPage = this.currentPage - 1;
        } else if (direct === 'behind' && i === this.pageSize - 1) {
          this.currentPage = this.currentPage + 1;
        }
        this.getCardsData();
      } catch (e) {
        console.error(e);
      }
    },
    async getCardsData() {
      try {
        const res = await api.getCardsData({
          page: this.currentPage,
          size: this.pageSize,
          search: this.searchTxt,
          appName: this.selectedApp,
        });
        let result = [];
        if (res.data.data.result && Array.isArray(res.data.data.result)) {
          result = res.data.data.result;
        }
        this.cardsData = result;
      } catch (e) {
        console.error(e);
      }
    },
    async getData() {
      this.currentPage = 1;
      await this.getImportance();
      await this.getCardsData();
    },
    async setFollow(cardData) {
      try {
        await api.setFollow({
          app_name: cardData.app_name,
          intf_name: cardData.intf_name,
          is_follow: !cardData.is_follow,
          importance: cardData.importance,
        });
        this.getCardsData();
        this.getImportance();
      } catch (e) {
        console.error(e);
      }
    },
    editImportanceHandler(payload) {
      this.editImportance(payload.data, payload.type, payload.i);
    },
    goToPage(page) {
      this.currentPage = page;
      this.getCardsData();
    },
    resizeHandler() {
      const { cardContainer } = this.$refs;
      const cardWidth = 436;
      const cardHeight = 304;
      const containerWidth = cardContainer.clientWidth;
      const containerHeight = cardContainer.clientHeight;
      let col = Math.floor(containerWidth / cardWidth);
      let row = Math.floor(containerHeight / cardHeight);
      cardContainer.style.paddingLeft = `${(containerWidth - col * cardWidth) / 2}px`;
      cardContainer.style.paddingTop = `${(containerHeight - row * cardHeight) / 2}px`;
      if (this.pageSize !== col * row) {
        this.pageSize = col * row;
        if (col === 0) {
          col = 1;
          this.pageSize = col * row;
        } else if (row === 0) {
          row = 1;
          this.pageSize = col * row;
        } else if (this.currentPage > this.importanceData.count / this.pageSize) {
          this.currentPage = Math.ceil(this.importanceData.count / this.pageSize);
        }
        this.getCardsData();
      }
    },
  },
  computed: {
    totalPage() {
      if (this.importanceData.count === undefined) this.importanceData.count = 0;
      return Math.ceil(this.importanceData.count / this.pageSize);
    },
    lastNode() {
      return this.importanceData.count === this.pageSize ? this.importanceData.count - 1 : (this.importanceData.count % this.pageSize) - 1;
    },
  },
  async mounted() {
    await this.getImportance(true);
    await this.getCardsData();
    this.resizeHandler();
    window.addEventListener('resize', _.debounce(this.resizeHandler, 150));
    window.setInterval(this.getCardsData, 100000);
  },
};
</script>

<style lang="scss" scoped>

.searchDiv {
  display: flex;
  justify-content: space-between;
  align-content: center;
  height: 100%;

  select, input {
    height: 30px;
    line-height: 30px;
    color: #C6D0E2;
    background-color: #0a1f30;
    font-size: 16px;
    border: 1px solid #48b1ac;
    width: 180px;
    margin: 9px 10px;
    padding-left: 5px;
  }

  input {
    padding-right: 36px;
    width: 220px;
    box-sizing: content-box;
  }

  .searchRightBtn {
    float: right;
    position: relative;
    top: 10px;
    left: -41px;
    height: 30px;
    width: 30px;
    background-color: #18415f;
    text-align: center;
    cursor: pointer;
    line-height: 28px;

    img {
      width: 24px;
      height: 24px;
      margin-top: 5px;
      display: inline-block;
    }
  }
}

.customList {
  position: absolute;
  top: 100px;
  bottom: 96px;
  left: 0;
  right: 0;
  overflow: hidden;
  margin-bottom: 10px;

  .noDataImage {
    display: block;
    text-align: center;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -100px;
    margin-top: -100px;
  }
}

</style>

