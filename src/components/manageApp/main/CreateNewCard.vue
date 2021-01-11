<template>
  <div class="manageApp-newCard-bg" v-if="showFlag">
      <div class="manageApp-main">
        <div class="newCard-one">
          <span>名称</span>
          <input type="text" placeholder="请输入要创建的APP名称" v-model="cardName">
          <span>*</span>
        </div>
        <div class="newCard-one">
           <span>描述</span>
          <input type="text" placeholder="请输入要创建的APP描述"  v-model="cardDescript">
          <span>*</span>
        </div>
        <div class="newCard-buttons">
          <button @click="createNew">创建</button>
          <button @click="cancelCreate">取消</button>
        </div>
      </div>
      <Cmtip :tipContent="updateMessage" v-if="showTips" :closeFn="() => showTips = false">
      </Cmtip>
  </div>
</template>
<script>
import Cmtip from '@/components/common/CmTip';
import * as api from '@/pages/manageApp/service';

export default {
  components: { Cmtip },
  props: {
    showFlag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      updateMessage: '',
      showTips: false,
      cardName: '',
      cardDescript: '',
    };
  },
  methods: {
    createNew() {
      const data = {
        disp_name: this.cardName,
        desc: this.cardDescript,
        icon: 1,
      };
      this.createCard(data);
    },
    async createCard(data) {
      try {
        const res = await api.createCard(data);
        console.log(res);
        if (res.data.data.status === 1) {
          this.cardName = '';
          this.cardDescript = '';
          this.$emit('createNew');
        }
        if (res.data.detail.desc) {
          this.showTips = true;
          this.updateMessage = `业务描述错误：${res.data.detail.desc[0]}`;
        } else if (res.data.detail.disp_name) {
          this.showTips = true;
          this.updateMessage = `业务名称错误：${res.data.detail.disp_name[0]}`;
        }
      } catch (e) {
        console.log(e);
      }
    },
    cancelCreate() {
      this.$emit('cancel');
      this.cardName = '';
      this.cardDescript = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.manageApp-newCard-bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(16,25,32,0.5);
    z-index: 99;
}
.manageApp-main{
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -220px;
    margin-top: -155px;
    background: #020C15;
    color: #3dd9c4;
    padding: 15px 30px;
    border-radius: 5px;
    z-index: 100;
}
.newCard-one {
  font-size: 16px;
  margin: 20px 0;
  >span {
    &:first-child {
    color: #3dd9c4;
    };
    &:last-child {
      color: red;
    };
  }
  >input {
    background: #010A11;
    color: #ccc;
    width: 315px;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    border: none;
    padding-left: 5px;
    margin: 0 7px 0 10px;
    font-family: "SourceHanSansCN-Normal";
  }
}

.newCard-buttons {
  text-align: center;
  padding: 10px 0;
  >button {
    height: 28px;
    line-height: 28px;
    text-align: center;
    padding: 0 16px;
    border: 1px solid #00C3E7;
    outline: none;
    color: #00C3E7;
    font-size: 16px;
    display: inline-block;
    border-radius: 15px;
    margin: 0 10px;
    background: #0A283B;
    &:nth-child(1) {
      margin-right: 60px;
      background: #3dd9c4;
      color: #eee;
    }
    &:nth-child(2):hover {
      background: rgba(0,195,231,0.5);
      color: #eee;
    }
  }
}
</style>
